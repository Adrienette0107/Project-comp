#!/bin/bash

# Kisan-Sathi Integration - Quick Setup Guide
# Run this to verify the integration is working

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Kisan-Sathi Integration - Setup & Testing Guide              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Verify Backend Installation${NC}"
echo "=================================="
echo ""

cd app/backend 2>/dev/null || {
  echo -e "${YELLOW}❌ Backend directory not found. Make sure you're in the root directory.${NC}"
  exit 1
}

echo "Installing backend dependencies..."
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

echo -e "${BLUE}Step 2: Verify Frontend Installation${NC}"
echo "=================================="
echo ""

cd ../
echo "Installing frontend dependencies..."
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

echo -e "${BLUE}Step 3: Checking TypeScript Compilation${NC}"
echo "=================================="
echo ""

# Check if TypeScript files exist
if [ -f "backend/src/controllers/recommendationController.ts" ] && \
   [ -f "backend/src/routes/recommendations.ts" ] && \
   [ -f "backend/src/routes/globalMarket.ts" ]; then
  echo -e "${GREEN}✓ All new backend files found${NC}"
else
  echo -e "${YELLOW}❌ Some backend files missing${NC}"
fi

if [ -f "src/components/CropRecommendation.tsx" ] && \
   [ -f "src/components/GlobalMarket.tsx" ] && \
   [ -f "src/sections/Recommendations.tsx" ]; then
  echo -e "${GREEN}✓ All new frontend components found${NC}"
else
  echo -e "${YELLOW}❌ Some frontend components missing${NC}"
fi

echo ""
echo -e "${BLUE}Step 4: Quick Test Checklist${NC}"
echo "=================================="
echo ""
echo "Frontend Navigation:"
echo "  [ ] Check if 'Recommendations' appears in the navbar"
echo "  [ ] Can navigate to Recommendations section"
echo ""
echo "Crop Recommendation Component:"
echo "  [ ] Form displays with all input fields"
echo "  [ ] Can enter soil nutrients and conditions"
echo "  [ ] Submit button works and calls API"
echo ""
echo "Yield Prediction Component:"
echo "  [ ] Can select crop from dropdown"
echo "  [ ] Can enter farm area and conditions"
echo "  [ ] Results display with charts/factors"
echo ""
echo "Soil Testing Component:"
echo "  [ ] Can select state"
echo "  [ ] Testing centers list displays"
echo "  [ ] Can view lab details and contact info"
echo ""
echo "Global Market Component:"
echo "  [ ] Can view market trends"
echo "  [ ] Can view top exporters"
echo "  [ ] Can check demand forecasts"
echo ""

echo -e "${BLUE}Step 5: API Testing${NC}"
echo "=================================="
echo ""
echo "You can test the APIs using curl or Postman:"
echo ""
echo "1. Crop Recommendation:"
echo "   curl -X POST http://localhost:5000/api/recommendations/crops \\"
echo "   -H 'Content-Type: application/json' \\"
echo "   -d '{\"N\":100,\"P\":50,\"K\":40,\"temperature\":25,\"humidity\":65,\"pH\":7.0,\"rainfall\":800}'"
echo ""
echo "2. Get Crops List:"
echo "   curl http://localhost:5000/api/recommendations/crops/list"
echo ""
echo "3. Soil Data:"
echo "   curl 'http://localhost:5000/api/recommendations/soil-data?state=Maharashtra'"
echo ""
echo "4. Testing Centers:"
echo "   curl 'http://localhost:5000/api/recommendations/testing-centers?state=Maharashtra'"
echo ""
echo "5. Global Commodities:"
echo "   curl http://localhost:5000/api/global-market/commodities"
echo ""
echo "6. Market Insights:"
echo "   curl 'http://localhost:5000/api/global-market/market-insights/Rice'"
echo ""

echo -e "${BLUE}Step 6: Run Development Servers${NC}"
echo "=================================="
echo ""
echo "Backend:"
echo "  cd app/backend"
echo "  npm run dev"
echo ""
echo "Frontend (in another terminal):"
echo "  cd app"
echo "  npm run dev"
echo ""
echo "Open: http://localhost:5173 in your browser"
echo ""

echo -e "${BLUE}Step 7: Environment Variables${NC}"
echo "=================================="
echo ""
echo "Make sure these are set in your .env files:"
echo ""
echo ".env (root):"
echo "  VITE_API_URL=http://localhost:5000"
echo ""
echo "backend/.env:"
echo "  NODE_ENV=development"
echo "  PORT=5000"
echo "  FRONTEND_URL=http://localhost:5173"
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Setup Complete! 🎉${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "For detailed documentation, see:"
echo "  - API_INTEGRATION_GUIDE.md (API reference)"
echo "  - INTEGRATION_SUMMARY.md (Complete integration details)"
echo ""
echo "Questions? Check the documentation files or run tests!"
