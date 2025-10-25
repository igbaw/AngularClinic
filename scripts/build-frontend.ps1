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
  Write-Host "Build output: dist/coreui-free-angular-admin-template"
}
finally {
  Pop-Location
}