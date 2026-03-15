@echo off
REM Kisan-Sathi Integration - Quick Setup Guide (Windows)
REM Run this to verify and setup the integration

setlocal enabledelayedexpansion

cls
echo.
echo ════════════════════════════════════════════════════════════════
echo   Kisan-Sathi Integration - Setup ^& Testing Guide (Windows)
echo ════════════════════════════════════════════════════════════════
echo.

echo.
echo Step 1: Verify Backend Installation
echo ====================================
echo.

cd /d "%~dp0app\backend" 2>nul || (
  echo ❌ Backend directory not found. Make sure you're in the root directory.
  pause
  exit /b 1
)

echo Installing backend dependencies...
call npm install
echo ✓ Backend dependencies installed
echo.

echo.
echo Step 2: Verify Frontend Installation
echo ====================================
echo.

cd /d "%~dp0app"
echo Installing frontend dependencies...
call npm install
echo ✓ Frontend dependencies installed
echo.

echo.
echo Step 3: Checking Files
echo ===========================
echo.

if exist "%~dp0app\backend\src\controllers\recommendationController.ts" (
  echo ✓ recommendationController.ts found
) else (
  echo ❌ recommendationController.ts NOT found
)

if exist "%~dp0app\backend\src\routes\recommendations.ts" (
  echo ✓ recommendations.ts routes found
) else (
  echo ❌ recommendations.ts routes NOT found
)

if exist "%~dp0app\backend\src\routes\globalMarket.ts" (
  echo ✓ globalMarket.ts routes found
) else (
  echo ❌ globalMarket.ts routes NOT found
)

if exist "%~dp0app\src\components\CropRecommendation.tsx" (
  echo ✓ CropRecommendation.tsx found
) else (
  echo ❌ CropRecommendation.tsx NOT found
)

if exist "%~dp0app\src\components\GlobalMarket.tsx" (
  echo ✓ GlobalMarket.tsx found
) else (
  echo ❌ GlobalMarket.tsx NOT found
)

if exist "%~dp0app\src\sections\Recommendations.tsx" (
  echo ✓ Recommendations.tsx found
) else (
  echo ❌ Recommendations.tsx NOT found
)

echo.
echo Step 4: Quick Test Checklist
echo =============================
echo.
echo Frontend Navigation:
echo   [ ] Check if 'Recommendations' appears in the navbar
echo   [ ] Can navigate to Recommendations section
echo.
echo Crop Recommendation Component:
echo   [ ] Form displays with all input fields
echo   [ ] Can enter soil nutrients and conditions
echo   [ ] Submit button works and calls API
echo.
echo Yield Prediction Component:
echo   [ ] Can select crop from dropdown
echo   [ ] Can enter farm area and conditions
echo   [ ] Results display with charts/factors
echo.
echo Soil Testing Component:
echo   [ ] Can select state
echo   [ ] Testing centers list displays
echo   [ ] Can view lab details and contact info
echo.
echo Global Market Component:
echo   [ ] Can view market trends
echo   [ ] Can view top exporters
echo   [ ] Can check demand forecasts
echo.

echo.
echo Step 5: API Testing
echo ===================
echo.
echo You can test the APIs using curl or tools like Postman:
echo.
echo 1. Crop Recommendation:
echo    curl -X POST http://localhost:5000/api/recommendations/crops ^
echo    -H "Content-Type: application/json" ^
echo    -d "{\"N\":100,\"P\":50,\"K\":40,\"temperature\":25,\"humidity\":65,\"pH\":7.0,\"rainfall\":800}"
echo.
echo 2. Get Crops List:
echo    curl http://localhost:5000/api/recommendations/crops/list
echo.
echo 3. Soil Data:
echo    curl "http://localhost:5000/api/recommendations/soil-data?state=Maharashtra"
echo.
echo 4. Testing Centers:
echo    curl "http://localhost:5000/api/recommendations/testing-centers?state=Maharashtra"
echo.
echo 5. Global Commodities:
echo    curl http://localhost:5000/api/global-market/commodities
echo.
echo 6. Market Insights:
echo    curl "http://localhost:5000/api/global-market/market-insights/Rice"
echo.

echo.
echo Step 6: Run Development Servers
echo ===============================
echo.
echo Backend (in Command Prompt/PowerShell):
echo   cd app\backend
echo   npm run dev
echo.
echo Frontend (in another terminal):
echo   cd app
echo   npm run dev
echo.
echo Open: http://localhost:5173 in your browser
echo.

echo.
echo Step 7: Environment Variables
echo =============================
echo.
echo Make sure these are set in your .env files:
echo.
echo .env (root):
echo   VITE_API_URL=http://localhost:5000
echo.
echo backend\.env:
echo   NODE_ENV=development
echo   PORT=5000
echo   FRONTEND_URL=http://localhost:5173
echo.

echo.
echo ════════════════════════════════════════════════════════════════
echo   Setup Complete! 🎉
echo ════════════════════════════════════════════════════════════════
echo.
echo For detailed documentation, see:
echo   - API_INTEGRATION_GUIDE.md (API reference)
echo   - INTEGRATION_SUMMARY.md (Complete integration details)
echo.
echo Questions? Check the documentation files or run tests!
echo.

pause
