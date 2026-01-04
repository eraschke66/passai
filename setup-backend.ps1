# Frontend Integration Setup Script (Windows)
# Run this after deploying backend to Render

Write-Host "🚀 PassAI Frontend Integration Setup" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local already exists" -ForegroundColor Yellow
    $update = Read-Host "Do you want to update VITE_BACKEND_URL? (y/n)"
    
    if ($update -eq "y" -or $update -eq "Y") {
        $backendUrl = Read-Host "Enter your Render backend URL (e.g., https://your-app.onrender.com)"
        
        # Update or add VITE_BACKEND_URL
        $content = Get-Content ".env.local"
        if ($content -match "VITE_BACKEND_URL") {
            $content = $content -replace "VITE_BACKEND_URL=.*", "VITE_BACKEND_URL=$backendUrl"
            Set-Content ".env.local" $content
            Write-Host "✅ Updated VITE_BACKEND_URL in .env.local" -ForegroundColor Green
        }
        else {
            Add-Content ".env.local" "VITE_BACKEND_URL=$backendUrl"
            Write-Host "✅ Added VITE_BACKEND_URL to .env.local" -ForegroundColor Green
        }
    }
}
else {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Cyan
    $backendUrl = Read-Host "Enter your Render backend URL (e.g., https://your-app.onrender.com)"
    Set-Content ".env.local" "VITE_BACKEND_URL=$backendUrl"
    Write-Host "✅ Created .env.local with VITE_BACKEND_URL" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔍 Testing backend connection..." -ForegroundColor Cyan

# Test health endpoint
if ($backendUrl) {
    try {
        $response = Invoke-WebRequest -Uri "$backendUrl/api/v1/health" -Method Get -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend is healthy and responding!" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "❌ Backend health check failed" -ForegroundColor Red
        Write-Host "   Please verify your backend URL and that it's deployed" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📦 Installing dependencies (if needed)..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'npm run dev' to start the development server"
Write-Host "2. Test file upload with each file type"
Write-Host "3. Check browser console for any errors"
Write-Host "4. Deploy to production when ready"
Write-Host ""
Write-Host "📖 See BACKEND_INTEGRATION.md for testing checklist" -ForegroundColor Cyan
