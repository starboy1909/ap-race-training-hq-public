$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$publicSummary = "src/data/garmin-weekly.json"

Push-Location $repoRoot
try {
  $dirtyBefore = @(git status --porcelain)
  if ($LASTEXITCODE -ne 0) { throw "Could not inspect the Git working tree." }
  if ($dirtyBefore.Count -gt 0) {
    throw "The repository has uncommitted changes. Weekly Garmin publishing stopped to protect unrelated work."
  }

  & git pull --ff-only origin main
  if ($LASTEXITCODE -ne 0) { throw "Could not fast-forward the canonical main branch." }

  & (Join-Path $PSScriptRoot "run-weekly-garmin-review.ps1")
  if ($LASTEXITCODE -ne 0) { throw "The Garmin review or website validation failed." }

  & git diff --quiet -- $publicSummary
  if ($LASTEXITCODE -eq 0) {
    Write-Host "No public Garmin summary change to publish."
    exit 0
  }

  & git add -- $publicSummary
  & git diff --cached --check
  if ($LASTEXITCODE -ne 0) { throw "The public Garmin summary failed Git validation." }

  $date = Get-Date -Format "yyyy-MM-dd"
  & git commit -m "Update weekly Garmin training review $date"
  if ($LASTEXITCODE -ne 0) { throw "Could not commit the weekly Garmin review." }

  & git push origin main
  if ($LASTEXITCODE -ne 0) { throw "Could not publish the weekly Garmin review." }
} finally {
  Pop-Location
}
