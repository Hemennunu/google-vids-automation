# Opens Google Chrome with remote debugging (no Playwright launch flags).
# Sign in to Google in this window, then run: npm run login:cdp

$ErrorActionPreference = 'Stop'

$profileDir = Join-Path $env:LOCALAPPDATA 'google-vids-automation-debug'
New-Item -ItemType Directory -Force -Path $profileDir | Out-Null

$candidates = @(
  (Join-Path ${env:ProgramFiles} 'Google\Chrome\Application\chrome.exe')
  (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe')
  (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
)

$chrome = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) {
  Write-Error 'Google Chrome not found. Install from https://www.google.com/chrome/'
}

$vidsUrl = 'https://vids.new'

Write-Host "Profile: $profileDir"
Write-Host 'Debugging port: 9222'
Write-Host "Opening $vidsUrl - sign in, then run: npm run login:cdp"

Start-Process -FilePath $chrome -ArgumentList @(
  '--remote-debugging-port=9222'
  "--user-data-dir=$profileDir"
  $vidsUrl
)
