$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$logRoot = Join-Path $repoRoot ".garmin-private"
$logPath = Join-Path $logRoot "weekly-review.garmin.log"
New-Item -ItemType Directory -Force -Path $logRoot | Out-Null

$uvxPath = [Environment]::GetEnvironmentVariable("GARMIN_UVX_PATH", "User")
if (-not $uvxPath) { $uvxPath = "C:\Users\Amar\AppData\Roaming\Python\Python312\Scripts\uvx.exe" }
$env:GARMIN_UVX_PATH = $uvxPath
$env:GARMIN_IS_CN = [Environment]::GetEnvironmentVariable("GARMIN_IS_CN", "User")
$env:PYTHONIOENCODING = "utf-8"

Push-Location $repoRoot
try {
  "$(Get-Date -Format o) Starting weekly Garmin review" | Add-Content -LiteralPath $logPath
  & node (Join-Path $PSScriptRoot "garmin-weekly-analysis.mjs") *>> $logPath
  if ($LASTEXITCODE -ne 0) { throw "Garmin weekly analysis exited with code $LASTEXITCODE." }
  & npm run check *>> $logPath
  if ($LASTEXITCODE -ne 0) { throw "Website validation failed after Garmin analysis." }
  "$(Get-Date -Format o) Weekly Garmin review completed" | Add-Content -LiteralPath $logPath
} catch {
  "$(Get-Date -Format o) ERROR $($_.Exception.Message)" | Add-Content -LiteralPath $logPath
  throw
} finally { Pop-Location }
