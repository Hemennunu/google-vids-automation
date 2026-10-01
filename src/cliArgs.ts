/**
 * CLI option lookup that survives Windows PowerShell's npm shim.
 *
 * PowerShell swallows the `--` in `npm run batch -- --subject=Biology`, so npm
 * treats `--subject=Biology` as its own config ("Unknown cli config") and
 * passes it to the script only as the env var npm_config_subject.
 */
function npmConfigEnv(name: string): string | undefined {
  return process.env[`npm_config_${name.replace(/-/g, "_")}`];
}

/** Value of --name=value from argv, or from npm_config_name. */
export function cliValue(argv: string[], name: string): string | undefined {
  const fromArgv = argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
  return fromArgv ?? npmConfigEnv(name);
}

/** True if --name was passed (argv or npm_config_name="true"). */
export function cliFlag(argv: string[], name: string): boolean {
  if (argv.includes(`--${name}`)) return true;
  const env = npmConfigEnv(name);
  return env !== undefined && env !== "" && env !== "false";
}
