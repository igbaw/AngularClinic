# PowerShell script to run integration tests
# This script starts the backend and runs integration tests

Write-Host "🚀 Starting ElysiaJS Backend..." -ForegroundColor Cyan

# Start backend in background
$backendJob = Start-Job -ScriptBlock {
    Set-Location "D:\Projects\AngularClinic\WebApp\Backend\ElysiaJS"
    bun run dev
}

Write-Host "⏳ Waiting for backend to start (5 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend failed to start. Check the logs." -ForegroundColor Red
    Stop-Job $backendJob
    Remove-Job $backendJob
    exit 1
}

Write-Host ""
Write-Host "🧪 Running Integration Tests..." -ForegroundColor Cyan
Write-Host ""

# Run integration tests
Set-Location "D:\Projects\AngularClinic\WebApp\Frontend"
npm test -- --include='**/*.integration.spec.ts' --watch=false --configuration=integration

$testResult = $LASTEXITCODE

# Cleanup: Stop backend
Write-Host ""
Write-Host "🛑 Stopping backend..." -ForegroundColor Yellow
Stop-Job $backendJob
Remove-Job $backendJob

if ($testResult -eq 0) {
    Write-Host "✅ All integration tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Some tests failed. Exit code: $testResult" -ForegroundColor Red
}

exit $testResult
