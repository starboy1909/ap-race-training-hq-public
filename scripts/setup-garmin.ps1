$ErrorActionPreference = "Stop"
$env:PYTHONIOENCODING = "utf-8"

$uvxCandidates = @(
  (Get-Command uvx -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue),
  "C:\Users\Amar\AppData\Roaming\Python\Python312\Scripts\uvx.exe"
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

$uvxPath = $uvxCandidates | Select-Object -First 1
if (-not $uvxPath) {
  throw "uvx is not installed. Run: py -3.12 -m pip install --user uv"
}

Write-Host ""
Write-Host "AP Race and Training HQ - Garmin authentication" -ForegroundColor Cyan
Write-Host "Your password and MFA code are entered only in this window." -ForegroundColor Yellow
Write-Host "OAuth tokens will stay under C:\Users\Amar\.garminconnect and are never committed." -ForegroundColor Yellow
Write-Host ""

$chinaAnswer = Read-Host "Do you use Garmin Connect China (garmin.cn)? Enter y for yes, or press Enter for international"
$isChina = if ($chinaAnswer -match '^[Yy]') { "true" } else { "false" }
[Environment]::SetEnvironmentVariable("GARMIN_IS_CN", $isChina, "User")
$env:GARMIN_IS_CN = $isChina

& $uvxPath --python 3.12 --from git+https://github.com/Taxuspt/garmin_mcp garmin-mcp-auth
if ($LASTEXITCODE -ne 0) {
  throw "Garmin authentication did not complete."
}

& $uvxPath --python 3.12 --from git+https://github.com/Taxuspt/garmin_mcp garmin-mcp-auth --verify
if ($LASTEXITCODE -ne 0) {
  throw "Garmin token verification failed."
}

[Environment]::SetEnvironmentVariable("GARMIN_UVX_PATH", $uvxPath, "User")
Write-Host ""
Write-Host "Authentication verified. You can close this window and return to Codex." -ForegroundColor Green
