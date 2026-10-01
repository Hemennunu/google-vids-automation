import fs from "node:fs/promises";
import { chromium } from "playwright";
import { log } from "../googleVids.js";

export type VisualCheck = {
  durationSec: number;
  /** Per sampled frame: share of pixels that differ clearly from the frame's dominant colour. */
  detailShares: number[];
  looksBlank: boolean;
};

/** Frames where less than this share of pixels carries detail count as "empty". */
const EMPTY_FRAME_DETAIL = 0.2;
/** A video is flagged when at least this share of sampled frames are empty. */
const BLANK_VIDEO_FRAME_SHARE = 0.7;
const SAMPLE_POINTS = [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95];

/**
 * Samples frames of an exported MP4 in headless Chrome (bundled Chromium has no
 * H.264) and measures how much of each frame is more than a flat background.
 * Catches exports where every media slot is an empty placeholder.
 */
export async function checkVideoHasVisuals(filePath: string): Promise<VisualCheck> {
  const bytes = await fs.readFile(filePath);
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage();
    // Serve page + video from one fake origin so the canvas is not tainted.
    await page.route("http://video-check.local/**", (route) => {
      const url = route.request().url();
      if (url.endsWith("/v.mp4")) {
        // Range support is required for the video to be seekable.
        const range = /bytes=(\d+)-(\d*)/.exec(route.request().headers()["range"] ?? "");
        if (!range) {
          return route.fulfill({
            status: 200,
            contentType: "video/mp4",
            headers: { "Accept-Ranges": "bytes" },
            body: bytes,
          });
        }
        const start = Number(range[1]);
        const end = range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1;
        return route.fulfill({
          status: 206,
          contentType: "video/mp4",
          headers: {
            "Accept-Ranges": "bytes",
            "Content-Range": `bytes ${start}-${end}/${bytes.length}`,
          },
          body: bytes.subarray(start, end + 1),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "text/html",
        body: '<video id="v" src="/v.mp4" muted preload="auto"></video>',
      });
    });
    await page.goto("http://video-check.local/");
    await page.evaluate("globalThis.__name = globalThis.__name || ((fn) => fn)");

    return await page.evaluate(
      async ({ points, emptyDetail, blankShare }) => {
        const v = document.getElementById("v") as HTMLVideoElement;
        await new Promise<void>((resolve, reject) => {
          if (v.readyState >= 1) return resolve();
          v.onloadedmetadata = () => resolve();
          v.onerror = () => reject(new Error(`video error ${v.error?.code}`));
          setTimeout(() => reject(new Error("video metadata timeout")), 30_000);
        });

        const w = 320;
        const h = Math.round((w * v.videoHeight) / v.videoWidth) || 180;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

        const shares: number[] = [];
        for (const p of points) {
          await new Promise<void>((resolve) => {
            v.onseeked = () => resolve();
            v.currentTime = v.duration * p;
            setTimeout(resolve, 8_000);
          });
          ctx.drawImage(v, 0, 0, w, h);
          const data = ctx.getImageData(0, 0, w, h).data;

          // Dominant colour = most common coarse (5-bit) RGB bucket.
          const counts = new Map<number, number>();
          for (let i = 0; i < data.length; i += 4) {
            const key = ((data[i]! >> 3) << 10) | ((data[i + 1]! >> 3) << 5) | (data[i + 2]! >> 3);
            counts.set(key, (counts.get(key) ?? 0) + 1);
          }
          let bgKey = 0;
          let best = -1;
          for (const [k, c] of counts) if (c > best) { best = c; bgKey = k; }
          const bg = [((bgKey >> 10) & 31) << 3, ((bgKey >> 5) & 31) << 3, (bgKey & 31) << 3];

          let detailed = 0;
          const total = data.length / 4;
          for (let i = 0; i < data.length; i += 4) {
            const d = Math.abs(data[i]! - bg[0]!) + Math.abs(data[i + 1]! - bg[1]!) + Math.abs(data[i + 2]! - bg[2]!);
            if (d > 45) detailed++;
          }
          shares.push(Math.round((detailed / total) * 1000) / 1000);
        }

        const emptyFrames = shares.filter((s) => s < emptyDetail).length;
        return {
          durationSec: Math.round(v.duration),
          detailShares: shares,
          looksBlank: emptyFrames / shares.length >= blankShare,
        };
      },
      { points: SAMPLE_POINTS, emptyDetail: EMPTY_FRAME_DETAIL, blankShare: BLANK_VIDEO_FRAME_SHARE },
    );
  } finally {
    await browser.close();
  }
}

/** Throws when the MP4 looks like empty placeholders; logs the measurements either way. */
export async function assertVideoHasVisuals(filePath: string): Promise<void> {
  const check = await checkVideoHasVisuals(filePath);
  const summary = `${check.durationSec}s, frame detail ${check.detailShares.map((s) => `${Math.round(s * 100)}%`).join(" ")}`;
  if (check.looksBlank) {
    throw new Error(
      `Exported video looks blank (media placeholders only): ${summary}. The draft probably was not finished generating.`,
    );
  }
  log("info", `Visual check passed (${summary}).`);
}
