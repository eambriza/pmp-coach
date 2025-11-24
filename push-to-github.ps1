# Push to GitHub Script
# Run this after creating your repository on GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PMP Drill Coach - GitHub Upload" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get repository URL from user
Write-Host "First, create a new repository on GitHub:" -ForegroundColor Yellow
Write-Host "  1. Go to https://github.com/new" -ForegroundColor White
Write-Host "  2. Name it: pmp-drill-coach" -ForegroundColor White
Write-Host "  3. DO NOT initialize with README" -ForegroundColor White
Write-Host "  4. Click 'Create repository'" -ForegroundColor White
Write-Host ""

$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/pmp-drill-coach.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "Error: Repository URL is required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Adding remote repository..." -ForegroundColor Green
git remote add origin $repoUrl

if ($LASTEXITCODE -ne 0) {
    Write-Host "Remote might already exist. Updating..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

Write-Host "Renaming branch to main..." -ForegroundColor Green
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Your code is on GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "View your repository at:" -ForegroundColor Cyan
    Write-Host $repoUrl.Replace(".git", "") -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Error: Push failed. Please check your credentials and try again." -ForegroundColor Red
    Write-Host "You may need to use a Personal Access Token instead of password." -ForegroundColor Yellow
    Write-Host "Generate one at: https://github.com/settings/tokens" -ForegroundColor Yellow
}
