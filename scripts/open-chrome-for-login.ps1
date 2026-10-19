# Opens dedicated Google Chrome instance for nuhaminarega19@gmail.com on port 9222.
# This prevents Chrome from attaching to your existing personal Chrome window.

$ErrorActionPreference = 'Stop'

# Use the real Chrome Profile 1 (nuhaminarega19@gmail.com)
$profileDir = Join-Path $env:LOCALAPPDATA 'Google\Chrome\User Data'
$profileName = 'Profile 1'

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

Write-Host "Profile Directory: $profileDir"
Write-Host "Profile: $profileName (nuhaminarega19@gmail.com)"
Write-Host 'Debugging port: 9222'
Write-Host "Opening $vidsUrl ..."

Start-Process -FilePath $chrome -ArgumentList @(
  "--remote-debugging-port=9222",
  "--user-data-dir=$profileDir",
  "--profile-directory=$profileName",
  "--no-first-run",
  "--no-default-browser-check",
  $vidsUrl
)
