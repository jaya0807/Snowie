# Start Next.js frontend and FastAPI backend concurrently

$ProjectRoot = $PSScriptRoot
Write-Host "Starting AI Child Observation Platform from $ProjectRoot..." -ForegroundColor Green

# Start the frontend Next.js app in the background
$FrontendJob = Start-Job -Name "Frontend" -ScriptBlock {
    param($Root)
    cd "$Root\frontend"
    npm run dev
} -ArgumentList $ProjectRoot

# Start the backend FastAPI backend in the background
$BackendJob = Start-Job -Name "Backend" -ScriptBlock {
    param($Root)
    cd "$Root\backend"
    .\venv\Scripts\Activate.ps1
    # We now run from src module since it was moved
    uvicorn src.api:app --reload --port 8001
} -ArgumentList $ProjectRoot

Write-Host "Both servers are starting in the background." -ForegroundColor Cyan
Write-Host "Frontend running at: http://localhost:3000 (or 3001)"
Write-Host "Backend running at: http://localhost:8001"
Write-Host "Press Ctrl+C to stop both servers." -ForegroundColor Yellow

try {
    # Keep the script running and output logs
    Receive-Job -Name "Frontend", "Backend" -Wait -AutoRemoveJob
}
finally {
    # Clean up jobs when script is terminated
    Stop-Job -Name "Frontend", "Backend" -ErrorAction SilentlyContinue
    Remove-Job -Name "Frontend", "Backend" -ErrorAction SilentlyContinue
    Write-Host "Servers stopped." -ForegroundColor Red
}
