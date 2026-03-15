import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

interface CropRecommendationRequest {
  N: number; // Nitrogen
  P: number; // Phosphorus
  K: number; // Potassium
  temperature: number;
  humidity: number;
  pH: number;
  rainfall: number;
  state?: string;
  district?: string;
  season?: string;
}

interface CropRecommendation {
  crop: string;
  confidence: number;
  rainfall_needed: number;
  temperature_range: string;
  season: string[];
}

interface SoilTestingCenter {
  id: string;
  name: string;
  state: string;
  district: string;
  address: string;
  phone: string;
  email: string;
}

interface YieldPredictionRequest {
  crop: string;
  area: number;
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  rainfall: number;
}

// Crop database with characteristics
const CROP_DATABASE: { [key: string]: any } = {
  'Rice': {
    ideal_N: 120, ideal_P: 60, ideal_K: 40,
    temp_min: 20, temp_max: 35,
    humidity_min: 60, humidity_max: 100,
    pH_min: 5.5, pH_max: 8.0,
    rainfall_min: 1000, rainfall_max: 2250,
    seasons: ['Kharif', 'Rabi'],
    yield_range: [40, 70]
  },
  'Wheat': {
    ideal_N: 100, ideal_P: 50, ideal_K: 30,
    temp_min: 15, temp_max: 25,
    humidity_min: 40, humidity_max: 70,
    pH_min: 5.5, pH_max: 7.5,
    rainfall_min: 500, rainfall_max: 900,
    seasons: ['Rabi'],
    yield_range: [45, 65]
  },
  'Maize': {
    ideal_N: 150, ideal_P: 80, ideal_K: 40,
    temp_min: 20, temp_max: 30,
    humidity_min: 40, humidity_max: 80,
    pH_min: 5.5, pH_max: 7.0,
    rainfall_min: 500, rainfall_max: 1200,
    seasons: ['Kharif', 'Rabi'],
    yield_range: [40, 65]
  },
  'Sugarcane': {
    ideal_N: 150, ideal_P: 75, ideal_K: 75,
    temp_min: 18, temp_max: 28,
    humidity_min: 50, humidity_max: 90,
    pH_min: 5.5, pH_max: 8.0,
    rainfall_min: 600, rainfall_max: 1250,
    seasons: ['Kharif'],
    yield_range: [60, 80]
  },
  'Cotton': {
    ideal_N: 100, ideal_P: 50, ideal_K: 40,
    temp_min: 20, temp_max: 35,
    humidity_min: 40, humidity_max: 80,
    pH_min: 5.8, pH_max: 7.5,
    rainfall_min: 500, rainfall_max: 1000,
    seasons: ['Kharif'],
    yield_range: [15, 25]
  },
  'Chickpea': {
    ideal_N: 40, ideal_P: 50, ideal_K: 30,
    temp_min: 10, temp_max: 25,
    humidity_min: 30, humidity_max: 60,
    pH_min: 6.5, pH_max: 8.0,
    rainfall_min: 400, rainfall_max: 800,
    seasons: ['Rabi'],
    yield_range: [18, 25]
  },
  'Potato': {
    ideal_N: 150, ideal_P: 60, ideal_K: 200,
    temp_min: 15, temp_max: 20,
    humidity_min: 50, humidity_max: 85,
    pH_min: 5.2, pH_max: 6.5,
    rainfall_min: 600, rainfall_max: 900,
    seasons: ['Rabi'],
    yield_range: [17, 25]
  },
  'Tomato': {
    ideal_N: 150, ideal_P: 50, ideal_K: 150,
    temp_min: 20, temp_max: 30,
    humidity_min: 50, humidity_max: 85,
    pH_min: 5.5, pH_max: 7.0,
    rainfall_min: 400, rainfall_max: 650,
    seasons: ['Kharif', 'Rabi'],
    yield_range: [25, 40]
  },
  'Onion': {
    ideal_N: 120, ideal_P: 60, ideal_K: 60,
    temp_min: 12, temp_max: 24,
    humidity_min: 40, humidity_max: 75,
    pH_min: 6.0, pH_max: 7.5,
    rainfall_min: 500, rainfall_max: 750,
    seasons: ['Kharif', 'Rabi'],
    yield_range: [25, 35]
  }
};

// Soil testing centers by state
const SOIL_TESTING_CENTERS: { [key: string]: SoilTestingCenter[] } = {
  'Maharashtra': [
    {
      id: '1',
      name: 'NAYATHI Regional Soil & Plant Analysis Lab',
      state: 'Maharashtra',
      district: 'Pune',
      address: 'Mahatma Phule Krishi Vidyapeeth, Rahuri, Pune',
      phone: '+91-2426-267000',
      email: 'soil.lab@mpkv.ac.in'
    },
    {
      id: '2',
      name: 'Soil Science Department Lab',
      state: 'Maharashtra',
      district: 'Nagpur',
      address: 'Dr. Panjabrao Deshmukh Krishi Vidyapeeth, Nagpur',
      phone: '+91-7104-242900',
      email: 'soil@pdkv.ac.in'
    }
  ],
  'Punjab': [
    {
      id: '3',
      name: 'PAU Soil Research Institute',
      state: 'Punjab',
      district: 'Ludhiana',
      address: 'Punjab Agricultural University, Ludhiana',
      phone: '+91-161-2401960',
      email: 'soil@pau.edu'
    }
  ],
  'Haryana': [
    {
      id: '4',
      name: 'CCS Haryana Agricultural University',
      state: 'Haryana',
      district: 'Hisar',
      address: 'Soil Science Department, Hisar',
      phone: '+91-1662-276650',
      email: 'soil@hau.ac.in'
    }
  ]
};

// Calculate recommendation score
function calculateScore(request: CropRecommendationRequest, crop: string): number {
  const data = CROP_DATABASE[crop];
  if (!data) return 0;

  let score = 100;

  // N, P, K scoring (optimal range)
  const NPK_tolerance = 30;
  score -= Math.abs(request.N - data.ideal_N) > NPK_tolerance ? 15 : 0;
  score -= Math.abs(request.P - data.ideal_P) > NPK_tolerance ? 15 : 0;
  score -= Math.abs(request.K - data.ideal_K) > NPK_tolerance ? 15 : 0;

  // Temperature scoring
  if (request.temperature < data.temp_min || request.temperature > data.temp_max) {
    score -= 20;
  }

  // Humidity scoring
  if (request.humidity < data.humidity_min || request.humidity > data.humidity_max) {
    score -= 15;
  }

  // pH scoring
  if (request.pH < data.pH_min || request.pH > data.pH_max) {
    score -= 15;
  }

  // Rainfall scoring
  if (request.rainfall < data.rainfall_min || request.rainfall > data.rainfall_max) {
    score -= 20;
  }

  return Math.max(0, score);
}

export const recommendCrops = async (req: Request, res: Response) => {
  try {
    const request: CropRecommendationRequest = req.body;

    // Validate input
    if (!request.N || !request.P || !request.K || request.temperature === undefined || 
        request.humidity === undefined || request.pH === undefined || !request.rainfall) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: N, P, K, temperature, humidity, pH, rainfall'
      });
    }

    // Calculate scores for all crops
    const scores = Object.keys(CROP_DATABASE).map(crop => ({
      crop,
      confidence: calculateScore(request, crop)
    }));

    // Sort by confidence and get top 5
    const topCrops = scores
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)
      .map(item => ({
        crop: item.crop,
        confidence: Math.round(item.confidence),
        ...CROP_DATABASE[item.crop]
      }));

    logger.info(`Crop recommendation generated for user`);

    res.json({
      success: true,
      data: {
        recommendations: topCrops,
        input_conditions: {
          N: request.N,
          P: request.P,
          K: request.K,
          temperature: request.temperature,
          humidity: request.humidity,
          pH: request.pH,
          rainfall: request.rainfall
        }
      }
    });
  } catch (error) {
    logger.error('Error in crop recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating crop recommendations'
    });
  }
};

export const predictYield = async (req: Request, res: Response) => {
  try {
    const { crop, area, N, P, K, temperature, humidity, rainfall }: YieldPredictionRequest = req.body;

    if (!crop || !area || !N || !P || !K || temperature === undefined || !humidity || !rainfall) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const cropData = CROP_DATABASE[crop];
    if (!cropData) {
      return res.status(400).json({
        success: false,
        message: `Crop '${crop}' not found in database`
      });
    }

    // Simple yield prediction model
    const [minYield, maxYield] = cropData.yield_range;
    let baseYield = (minYield + maxYield) / 2;

    // Adjust based on nutrients
    const nutrient_score = (
      (N / cropData.ideal_N +
        P / cropData.ideal_P +
        K / cropData.ideal_K) / 3
    );
    baseYield *= Math.min(nutrient_score, 1.2); // Cap at 120%

    // Adjust based on environmental factors
    const temp_diff = Math.abs(temperature - (cropData.temp_min + cropData.temp_max) / 2);
    const temp_factor = Math.max(0.8, 1 - (temp_diff / 10) * 0.1);

    const humidity_ideal = (cropData.humidity_min + cropData.humidity_max) / 2;
    const humidity_diff = Math.abs(humidity - humidity_ideal);
    const humidity_factor = Math.max(0.85, 1 - (humidity_diff / 20) * 0.1);

    const rainfall_diff = Math.abs(rainfall - (cropData.rainfall_min + cropData.rainfall_max) / 2);
    const rainfall_factor = Math.max(0.8, 1 - (rainfall_diff / 300) * 0.1);

    const adjustedYield = baseYield * temp_factor * humidity_factor * rainfall_factor;
    const totalProduction = adjustedYield * area;

    res.json({
      success: true,
      data: {
        crop,
        area,
        estimated_yield_per_hectare: Math.round(adjustedYield * 100) / 100,
        total_production: Math.round(totalProduction * 100) / 100,
        confidence: 'Medium',
        factors: {
          nutrient_score: Math.round(nutrient_score * 100) / 100,
          temperature_factor: Math.round(temp_factor * 100) / 100,
          humidity_factor: Math.round(humidity_factor * 100) / 100,
          rainfall_factor: Math.round(rainfall_factor * 100) / 100
        }
      }
    });
  } catch (error) {
    logger.error('Error in yield prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Error predicting yield'
    });
  }
};

export const getSoilData = async (req: Request, res: Response) => {
  try {
    const { state, district } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'State is required'
      });
    }

    // Get default soil data for the state
    const soilDefaults: { [key: string]: { N: number; P: number; K: number; pH: number } } = {
      'Maharashtra': { N: 250, P: 25, K: 150, pH: 7.2 },
      'Punjab': { N: 280, P: 30, K: 160, pH: 7.5 },
      'Haryana': { N: 260, P: 28, K: 155, pH: 7.4 },
      'Uttar Pradesh': { N: 240, P: 23, K: 140, pH: 7.1 },
      'Karnataka': { N: 220, P: 20, K: 130, pH: 6.8 },
      'Rajasthan': { N: 200, P: 18, K: 120, pH: 7.6 }
    };

    const soilData = soilDefaults[state as string] || {
      N: 230,
      P: 24,
      K: 140,
      pH: 7.0
    };

    res.json({
      success: true,
      data: {
        state,
        district: district || 'General',
        soil_nutrients: soilData,
        recommendations: [
          'Get soil testing done at nearest lab',
          'Based on test results, apply balanced fertilizers',
          'Consider organic matter addition'
        ]
      }
    });
  } catch (error) {
    logger.error('Error fetching soil data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching soil data'
    });
  }
};

export const getSoilTestingCenters = async (req: Request, res: Response) => {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'State is required'
      });
    }

    const centers = SOIL_TESTING_CENTERS[state as string] || [];

    if (centers.length === 0) {
      return res.json({
        success: true,
        data: {
          centers: [],
          message: `No soil testing centers found for ${state}. Please contact your nearest agricultural department.`
        }
      });
    }

    res.json({
      success: true,
      data: {
        state,
        centers,
        total: centers.length
      }
    });
  } catch (error) {
    logger.error('Error fetching soil testing centers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching soil testing centers'
    });
  }
};

export const getCropsList = async (req: Request, res: Response) => {
  try {
    const crops = Object.keys(CROP_DATABASE).map(crop => ({
      name: crop,
      ideal_conditions: CROP_DATABASE[crop]
    }));

    res.json({
      success: true,
      data: {
        crops,
        total: crops.length
      }
    });
  } catch (error) {
    logger.error('Error fetching crops list:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching crops list'
    });
  }
};

export const getSeasonalRecommendations = async (req: Request, res: Response) => {
  try {
    const { season, state } = req.query;

    if (!season) {
      return res.status(400).json({
        success: false,
        message: 'Season is required (Kharif/Rabi)'
      });
    }

    const recommendedCrops = Object.entries(CROP_DATABASE)
      .filter(([_, data]) => data.seasons.includes(season))
      .map(([crop, data]) => ({
        crop,
        seasons: data.seasons,
        ideal_conditions: {
          temperature: `${data.temp_min}-${data.temp_max}°C`,
          rainfall: `${data.rainfall_min}-${data.rainfall_max}mm`,
          pH: `${data.pH_min}-${data.pH_max}`
        }
      }));

    res.json({
      success: true,
      data: {
        season,
        state: state || 'General',
        crops: recommendedCrops,
        total: recommendedCrops.length
      }
    });
  } catch (error) {
    logger.error('Error fetching seasonal recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seasonal recommendations'
    });
  }
};
