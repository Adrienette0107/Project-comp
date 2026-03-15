# Kisan-Sathi Integration API Documentation

## New Endpoints Added to AgroConnect

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.agroconnect.com/api
```

---

## Crop Recommendation Endpoints

### 1. Get Crop Recommendations
**Endpoint:** `POST /recommendations/crops`

**Description:** Get personalized crop recommendations based on soil and environmental conditions.

**Request Body:**
```json
{
  "N": 100,              // Nitrogen level (mg/kg)
  "P": 50,               // Phosphorus level (mg/kg)
  "K": 40,               // Potassium level (mg/kg)
  "temperature": 25,     // Temperature in Celsius
  "humidity": 65,        // Humidity percentage
  "pH": 7.0,             // Soil pH
  "rainfall": 800,       // Rainfall in mm
  "state": "Maharashtra", // Optional: State name
  "district": "Pune"     // Optional: District name
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "crop": "Rice",
        "confidence": 92,
        "ideal_N": 120,
        "ideal_P": 60,
        "ideal_K": 40,
        "temp_min": 20,
        "temp_max": 35,
        "rainfall_min": 1000,
        "rainfall_max": 2250,
        "seasons": ["Kharif", "Rabi"]
      },
      // ... more crops
    ],
    "input_conditions": { ... }
  }
}
```

---

### 2. Get Crops List
**Endpoint:** `GET /recommendations/crops/list`

**Description:** Get the complete list of available crops in the database.

**Response:**
```json
{
  "success": true,
  "data": {
    "crops": [
      {
        "name": "Rice",
        "ideal_conditions": { ... }
      },
      // ... more crops
    ],
    "total": 9
  }
}
```

---

### 3. Get Seasonal Recommendations
**Endpoint:** `GET /recommendations/seasonal`

**Query Parameters:**
- `season` (required): "Kharif" or "Rabi"
- `state` (optional): State name

**Response:**
```json
{
  "success": true,
  "data": {
    "season": "Kharif",
    "crops": [
      {
        "crop": "Rice",
        "seasons": ["Kharif", "Rabi"],
        "ideal_conditions": { ... }
      }
    ],
    "total": 5
  }
}
```

---

## Yield Prediction Endpoints

### 4. Predict Crop Yield
**Endpoint:** `POST /recommendations/yield-prediction`

**Description:** Predict crop yield based on farm conditions and crop requirements.

**Request Body:**
```json
{
  "crop": "Rice",
  "area": 5,             // Farm area in hectares
  "N": 120,
  "P": 60,
  "K": 40,
  "temperature": 25,
  "humidity": 65,
  "rainfall": 1000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "crop": "Rice",
    "area": 5,
    "estimated_yield_per_hectare": 58.5,  // in quintals
    "total_production": 292.5,             // in quintals
    "confidence": "Medium",
    "factors": {
      "nutrient_score": 0.95,
      "temperature_factor": 0.98,
      "humidity_factor": 0.96,
      "rainfall_factor": 0.94
    }
  }
}
```

---

## Soil Data Endpoints

### 5. Get Soil Data
**Endpoint:** `GET /recommendations/soil-data`

**Query Parameters:**
- `state` (required): State name
- `district` (optional): District name

**Description:** Get default soil nutrient data for a region.

**Response:**
```json
{
  "success": true,
  "data": {
    "state": "Maharashtra",
    "district": "Pune",
    "soil_nutrients": {
      "N": 250,
      "P": 25,
      "K": 150,
      "pH": 7.2
    },
    "recommendations": [
      "Get soil testing done at nearest lab",
      "Based on test results, apply balanced fertilizers",
      "Consider organic matter addition"
    ]
  }
}
```

---

### 6. Get Soil Testing Centers
**Endpoint:** `GET /recommendations/testing-centers`

**Query Parameters:**
- `state` (required): State name

**Description:** Find approved soil testing laboratories in your region.

**Response:**
```json
{
  "success": true,
  "data": {
    "state": "Maharashtra",
    "centers": [
      {
        "id": "1",
        "name": "NAYATHI Regional Soil & Plant Analysis Lab",
        "state": "Maharashtra",
        "district": "Pune",
        "address": "Mahatma Phule Krishi Vidyapeeth, Rahuri, Pune",
        "phone": "+91-2426-267000",
        "email": "soil.lab@mpkv.ac.in"
      }
    ],
    "total": 2
  }
}
```

---

## Global Market Endpoints

### 7. Get Global Countries
**Endpoint:** `GET /global-market/countries`

**Description:** Get list of all countries for global market analysis.

**Response:**
```json
{
  "success": true,
  "data": {
    "countries": ["India", "China", "USA", "Brazil", ...],
    "total": 15
  }
}
```

---

### 8. Get Global Commodities
**Endpoint:** `GET /global-market/commodities`

**Description:** Get list of all tracked commodities.

**Response:**
```json
{
  "success": true,
  "data": {
    "commodities": ["Wheat", "Rice", "Corn", "Soybeans", ...],
    "total": 12
  }
}
```

---

### 9. Get Top Exporters
**Endpoint:** `GET /global-market/exporters`

**Query Parameters:**
- `commodity` (required): Commodity name
- `limit` (optional, default: 10): Number of results

**Description:** Get top exporting countries for a specific commodity.

**Response:**
```json
{
  "success": true,
  "data": {
    "commodity": "Rice",
    "exporters": ["India", "Vietnam", "Thailand", "Pakistan"],
    "total": 4
  }
}
```

---

### 10. Get Export by Country
**Endpoint:** `GET /global-market/export-by-country/:country`

**Description:** Get export details of a specific country.

**Response:**
```json
{
  "success": true,
  "data": {
    "country": "India",
    "exports": [
      {
        "commodity": "Rice",
        "volume_million_tons": 24.3,
        "value_million_usd": 9720,
        "per_unit_price": 399.59
      }
    ],
    "total_exports": 32.1,
    "total_value": 52340
  }
}
```

---

### 11. Get Commodity Trend
**Endpoint:** `GET /global-market/commodity-trend/:commodity`

**Description:** Get market trend analysis for a commodity.

**Response:**
```json
{
  "success": true,
  "data": {
    "commodity": "Rice",
    "market_trend": {
      "trend": "increasing",
      "stability": "stable",
      "price_2023": 385,
      "price_2024": 410,
      "forecast_2025": 420,
      "demand_growth": 2.3
    }
  }
}
```

---

### 12. Get Demand Forecast
**Endpoint:** `GET /global-market/demand-forecast`

**Query Parameters:**
- `commodity` (required): Commodity name
- `country` (optional): Country name

**Description:** Get demand forecast for a commodity by country.

**Response:**
```json
{
  "success": true,
  "data": {
    "commodity": "Rice",
    "country": "India",
    "forecast": {
      "2024": 95,
      "2025": 97,
      "2026": 99
    }
  }
}
```

---

### 13. Get Country Commodities
**Endpoint:** `GET /global-market/country-commodities/:country`

**Query Parameters:**
- `limit` (optional, default: 20): Number of results

**Description:** Get list of commodities exported by a country.

**Response:**
```json
{
  "success": true,
  "data": {
    "country": "India",
    "commodities": [
      {
        "commodity": "Rice",
        "volume": 24.3,
        "value": 9720
      }
    ],
    "total": 4
  }
}
```

---

### 14. Get Export Demand
**Endpoint:** `GET /global-market/export-demand`

**Query Parameters:**
- `commodity` (required): Commodity name

**Description:** Get global export demand analysis for a commodity.

**Response:**
```json
{
  "success": true,
  "data": {
    "commodity": "Rice",
    "total_global_exports": 48.5,
    "major_exporters": ["India", "Vietnam", "Thailand", "Pakistan"],
    "export_details": [
      {
        "country": "India",
        "volume": 24.3,
        "value": 9720
      }
    ]
  }
}
```

---

### 15. Get Market Insights
**Endpoint:** `GET /global-market/market-insights/:commodity`

**Description:** Get comprehensive market insights for a commodity.

**Response:**
```json
{
  "success": true,
  "data": {
    "commodity": "Rice",
    "market_analysis": {
      "trend": "increasing",
      "stability": "stable",
      "price_history": {
        "2023": 385,
        "2024": 410,
        "forecast_2025": 420
      },
      "global_exports": [ ... ],
      "demand_growth": "2.3% annually"
    }
  }
}
```

---

## Supported Crops

The system supports recommendations for the following 9 crops:

1. **Rice** - Kharif & Rabi
2. **Wheat** - Rabi
3. **Maize** - Kharif & Rabi
4. **Sugarcane** - Kharif
5. **Cotton** - Kharif
6. **Chickpea** - Rabi
7. **Potato** - Rabi
8. **Tomato** - Kharif & Rabi
9. **Onion** - Kharif & Rabi

---

## Global Commodities Tracked

- Wheat, Rice, Corn, Soybeans, Cotton, Sugar
- Tea, Coffee, Cocoa, Spices
- Vegetables, Fruits

---

## Error Responses

All endpoints follow standard error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common Status Codes:**
- `200`: Success
- `400`: Bad Request (missing/invalid parameters)
- `404`: Resource not found
- `500`: Server error

---

## Rate Limiting

API requests are rate limited to 100 requests per 15 minutes per IP address.

---

## Frontend Component Usage

### Import and Use Recommendations Store

```typescript
import { useRecommendationStore } from '@/stores';

const store = useRecommendationStore();

// Get crop recommendations
await store.getCropRecommendations({
  N: 100,
  P: 50,
  K: 40,
  temperature: 25,
  humidity: 65,
  pH: 7,
  rainfall: 800
});

// Access results
console.log(store.recommendations);
```

### Components Available

1. **CropRecommendation.tsx** - Crop recommendation form and results
2. **YieldPrediction.tsx** - Yield prediction calculator
3. **GlobalMarket.tsx** - Global market analysis interface
4. **SoilTestingCenters.tsx** - Soil testing lab finder
5. **Recommendations.tsx** - Main recommendations page with all components

---

## Integration Notes

- All API responses follow a standardized format with `success` and `data` fields
- Database integration required for storing user preferences and historical data
- ML model deployment needed for advanced predictions
- External API integration (weather, market data) can be added in future versions

---

## Support

For API issues or questions, contact: support@agroconnect.com
