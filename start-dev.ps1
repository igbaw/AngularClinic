# AngularClinic Development Startup Script
# This script runs both the Angular frontend and ElysiaJS backend concurrently

Write-Host "Starting AngularClinic Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Define paths
$frontendPath = "WebApp\Frontend"
$backendPath = "WebApp\Backend\ElysiaJS"

# Function to check if a command exists
function Test-Command {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Check for required tools
Write-Host "Checking dependencies..." -ForegroundColor Yellow

if (-not (Test-Command "npm")) {
    Write-Host "Error: npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "bun")) {
    Write-Host "Error: bun is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Install from: https://bun.sh" -ForegroundColor Yellow
    exit 1
}

Write-Host "Dependencies OK" -ForegroundColor Green
Write-Host ""

# Start backend
Write-Host "Starting ElysiaJS Backend..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    bun run dev
} -ArgumentList (Join-Path $PSScriptRoot $backendPath)

Start-Sleep -Seconds 2

# Start frontend
Write-Host "Starting Angular Frontend..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    npm start
} -ArgumentList (Join-Path $PSScriptRoot $frontendPath)

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "Development servers starting..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Stream output from both jobs
try {
    while ($true) {
        # Get output from frontend
        $frontendOutput = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
        if ($frontendOutput) {
            Write-Host "[FRONTEND] " -ForegroundColor Blue -NoNewline
            Write-Host $frontendOutput
        }

        # Get output from backend
        $backendOutput = Receive-Job -Job $backendJob -ErrorAction SilentlyContinue
        if ($backendOutput) {
            Write-Host "[BACKEND] " -ForegroundColor Magenta -NoNewline
            Write-Host $backendOutput
        }

        # Check if jobs are still running
        if ($frontendJob.State -eq "Completed" -or $frontendJob.State -eq "Failed") {
            Write-Host "Frontend job stopped" -ForegroundColor Red
            break
        }
        if ($backendJob.State -eq "Completed" -or $backendJob.State -eq "Failed") {
            Write-Host "Backend job stopped" -ForegroundColor Red
            break
        }

        Start-Sleep -Milliseconds 500
    }
}
finally {
    # Cleanup: stop both jobs
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    
    Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    
    Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
    
    Write-Host "Servers stopped" -ForegroundColor Green
}
