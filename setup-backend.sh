#!/bin/bash

# Frontend Integration Setup Script
# Run this after deploying backend to Render

echo "🚀 PassAI Frontend Integration Setup"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists"
    read -p "Do you want to update VITE_BACKEND_URL? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your Render backend URL (e.g., https://your-app.onrender.com): " backend_url
        # Update or add VITE_BACKEND_URL
        if grep -q "VITE_BACKEND_URL" .env.local; then
            sed -i.bak "s|VITE_BACKEND_URL=.*|VITE_BACKEND_URL=$backend_url|" .env.local
            echo "✅ Updated VITE_BACKEND_URL in .env.local"
        else
            echo "VITE_BACKEND_URL=$backend_url" >> .env.local
            echo "✅ Added VITE_BACKEND_URL to .env.local"
        fi
    fi
else
    echo "📝 Creating .env.local file..."
    read -p "Enter your Render backend URL (e.g., https://your-app.onrender.com): " backend_url
    echo "VITE_BACKEND_URL=$backend_url" > .env.local
    echo "✅ Created .env.local with VITE_BACKEND_URL"
fi

echo ""
echo "🔍 Testing backend connection..."

# Test health endpoint
if [ ! -z "$backend_url" ]; then
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$backend_url/api/v1/health")
    
    if [ "$http_code" = "200" ]; then
        echo "✅ Backend is healthy and responding!"
    else
        echo "❌ Backend health check failed (HTTP $http_code)"
        echo "   Please verify your backend URL and that it's deployed"
    fi
fi

echo ""
echo "📦 Installing dependencies (if needed)..."
npm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Test file upload with each file type"
echo "3. Check browser console for any errors"
echo "4. Deploy to production when ready"
echo ""
echo "📖 See BACKEND_INTEGRATION.md for testing checklist"
