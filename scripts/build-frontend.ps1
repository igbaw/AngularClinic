Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Push-Location "WebApp/Frontend"
try {
  if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm is not installed or not in PATH"
  }
  Write-Host "Installing dependencies..."
  npm ci
  Write-Host "Building Angular app..."
  npm run build
  
  # Move files from browser subdirectory to root for Cloudflare Pages
  if (Test-Path "dist/cloudflare/browser") {
    Write-Host "Flattening directory structure for Cloudflare Pages..."
    Get-ChildItem "dist/cloudflare/browser" -Recurse | Move-Item -Destination "dist/cloudflare" -Force
    Remove-Item "dist/cloudflare/browser" -Recurse -Force
  }
  
  Write-Host "Build output: dist/cloudflare"
}
finally {
  Pop-Location
}