import { Request, Response } from 'express';
import axios from 'axios';
import { logger } from '../utils/logger';

interface CommodityData {
  commodity: string;
  country: string;
  year: number;
  volume: number;
  value: number;
}

interface ExportData {
  country: string;
  commodity: string;
  volume: number;
  trend: string;
}

// Global commodities database
const GLOBAL_COMMODITIES = [
  'Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton', 'Sugar',
  'Tea', 'Coffee', 'Cocoa', 'Spices', 'Vegetables', 'Fruits'
];

// Major exporting countries
const TOP_EXPORTERS: { [key: string]: string[] } = {
  'Wheat': ['Russia', 'Ukraine', 'United States', 'France', 'Canada'],
  'Rice': ['India', 'Vietnam', 'Thailand', 'Pakistan', 'Indonesia'],
  'Corn': ['United States', 'Brazil', 'Argentina', 'Ukraine', 'Mexico'],
  'Soybeans': ['Brazil', 'United States', 'Argentina', 'Paraguay', 'Canada'],
  'Cotton': ['India', 'United States', 'Brazil', 'Australia', 'Uzbekistan'],
  'Tea': ['Kenya', 'India', 'Vietnam', 'China', 'Indonesia'],
  'Coffee': ['Brazil', 'Vietnam', 'Colombia', 'Indonesia', 'Ethiopia'],
  'Spices': ['India', 'Vietnam', 'Indonesia', 'Guatemala', 'China'],
  'Sugar': ['Brazil', 'Thailand', 'India', 'Mexico', 'Australia'],
  'Vegetables': ['China', 'Netherlands', 'United States', 'Spain', 'Mexico']
};

// Export volumes by country & commodity (mock data)
const EXPORT_DATA: CommodityData[] = [
  { commodity: 'Wheat', country: 'India', year: 2024, volume: 12.5, value: 3750 },
  { commodity: 'Rice', country: 'India', year: 2024, volume: 24.3, value: 9720 },
  { commodity: 'Cotton', country: 'India', year: 2024, volume: 5.8, value: 2900 },
  { commodity: 'Spices', country: 'India', year: 2024, volume: 2.1, value: 1680 },
  { commodity: 'Corn', country: 'United States', year: 2024, volume: 35.2, value: 8800 },
  { commodity: 'Soybeans', country: 'Brazil', year: 2024, volume: 28.5, value: 11400 },
  { commodity: 'Tea', country: 'Kenya', year: 2024, volume: 0.42, value: 504 },
  { commodity: 'Coffee', country: 'Brazil', year: 2024, volume: 3.7, value: 7400 }
];

// Market trends
const MARKET_TRENDS: { [key: string]: any } = {
  'Rice': {
    trend: 'increasing',
    stability: 'stable',
    price_2023: 385,
    price_2024: 410,
    forecast_2025: 420,
    demand_growth: 2.3
  },
  'Wheat': {
    trend: 'stable',
    stability: 'moderate',
    price_2023: 310,
    price_2024: 315,
    forecast_2025: 318,
    demand_growth: 1.5
  },
  'Corn': {
    trend: 'increasing',
    stability: 'stable',
    price_2023: 245,
    price_2024: 265,
    forecast_2025: 280,
    demand_growth: 2.8
  },
  'Cotton': {
    trend: 'volatile',
    stability: 'unstable',
    price_2023: 72,
    price_2024: 68,
    forecast_2025: 70,
    demand_growth: 1.2
  },
  'Spices': {
    trend: 'increasing',
    stability: 'stable',
    price_2023: 800,
    price_2024: 850,
    forecast_2025: 900,
    demand_growth: 3.5
  }
};

// Demand forecast data
const DEMAND_FORECAST: { [key: string]: any } = {
  'Rice': {
    'India': { 2024: 95, 2025: 97, 2026: 99 },
    'China': { 2024: 145, 2025: 150, 2026: 155 },
    'Indonesia': { 2024: 37, 2025: 38, 2026: 40 },
    'USA': { 2024: 3, 2025: 3.2, 2026: 3.4 }
  },
  'Wheat': {
    'India': { 2024: 102, 2025: 105, 2026: 108 },
    'USA': { 2024: 28, 2025: 29, 2026: 30 },
    'China': { 2024: 125, 2025: 130, 2026: 135 },
    'Russia': { 2024: 88, 2025: 90, 2026: 92 }
  }
};

export const getGlobalCountries = async (req: Request, res: Response) => {
  try {
    const countries = [
      'India', 'China', 'USA', 'Brazil', 'Russia',
      'Vietnam', 'Thailand', 'Indonesia', 'Mexico', 'Canada',
      'Ukraine', 'France', 'Australia', 'Argentina', 'Kenya'
    ];

    res.json({
      success: true,
      data: {
        countries,
        total: countries.length
      }
    });
  } catch (error) {
    logger.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching global markets'
    });
  }
};

export const getGlobalCommodities = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        commodities: GLOBAL_COMMODITIES,
        total: GLOBAL_COMMODITIES.length
      }
    });
  } catch (error) {
    logger.error('Error fetching commodities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching commodities'
    });
  }
};

export const getTopExporters = async (req: Request, res: Response) => {
  try {
    const { commodity, limit = 10 } = req.query;

    if (!commodity) {
      return res.status(400).json({
        success: false,
        message: 'Commodity parameter is required'
      });
    }

    const exporters = TOP_EXPORTERS[commodity as string] || [];
    const sliced = exporters.slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: {
        commodity,
        exporters: sliced,
        total: sliced.length
      }
    });
  } catch (error) {
    logger.error('Error fetching top exporters:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exporters'
    });
  }
};

export const getExportByCountry = async (req: Request, res: Response) => {
  try {
    const { country } = req.params;

    const countryExports = EXPORT_DATA
      .filter(item => item.country.toLowerCase() === (country as string).toLowerCase())
      .map(item => ({
        commodity: item.commodity,
        volume_million_tons: item.volume,
        value_million_usd: item.value,
        per_unit_price: Math.round((item.value / item.volume) * 100) / 100
      }));

    res.json({
      success: true,
      data: {
        country,
        exports: countryExports,
        total_exports: countryExports.reduce((sum, item) => sum + item.volume_million_tons, 0),
        total_value: countryExports.reduce((sum, item) => sum + item.value_million_usd, 0)
      }
    });
  } catch (error) {
    logger.error('Error fetching country exports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching country exports'
    });
  }
};

export const getCommodityTrend = async (req: Request, res: Response) => {
  try {
    const { commodity } = req.params;

    const trend = MARKET_TRENDS[commodity as string];

    if (!trend) {
      return res.status(404).json({
        success: false,
        message: `Trend data not found for commodity: ${commodity}`
      });
    }

    res.json({
      success: true,
      data: {
        commodity,
        market_trend: trend
      }
    });
  } catch (error) {
    logger.error('Error fetching commodity trend:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching commodity trend'
    });
  }
};

export const getDemandForecast = async (req: Request, res: Response) => {
  try {
    const { commodity, country } = req.query;

    if (!commodity) {
      return res.status(400).json({
        success: false,
        message: 'Commodity parameter is required'
      });
    }

    const commodityData = DEMAND_FORECAST[commodity as string];

    if (!commodityData) {
      return res.status(404).json({
        success: false,
        message: `Forecast data not found for commodity: ${commodity}`
      });
    }

    if (country) {
      const countryForecast = commodityData[country as string];
      return res.json({
        success: true,
        data: {
          commodity,
          country,
          forecast: countryForecast || { message: 'Data not available for this country' }
        }
      });
    }

    res.json({
      success: true,
      data: {
        commodity,
        forecast_by_country: commodityData
      }
    });
  } catch (error) {
    logger.error('Error fetching demand forecast:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching demand forecast'
    });
  }
};

export const getCountryCommodities = async (req: Request, res: Response) => {
  try {
    const { country } = req.params;
    const { limit = 20 } = req.query;

    const commodities = EXPORT_DATA
      .filter(item => item.country.toLowerCase() === (country as string).toLowerCase())
      .map(item => ({
        commodity: item.commodity,
        volume: item.volume,
        value: item.value
      }))
      .slice(0, parseInt(limit as string));

    res.json({
      success: true,
      data: {
        country,
        commodities,
        total: commodities.length
      }
    });
  } catch (error) {
    logger.error('Error fetching country commodities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching country commodities'
    });
  }
};

export const getExportDemand = async (req: Request, res: Response) => {
  try {
    const { commodity } = req.query;

    if (!commodity) {
      return res.status(400).json({
        success: false,
        message: 'Commodity parameter is required'
      });
    }

    const exporters = TOP_EXPORTERS[commodity as string] || [];
    const exports = EXPORT_DATA.filter(item => item.commodity === commodity);

    const demand = {
      commodity,
      total_global_exports: exports.reduce((sum, item) => sum + item.volume, 0),
      major_exporters: exporters.slice(0, 5),
      export_details: exports.map(item => ({
        country: item.country,
        volume: item.volume,
        value: item.value
      }))
    };

    res.json({
      success: true,
      data: demand
    });
  } catch (error) {
    logger.error('Error fetching export demand:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching export demand'
    });
  }
};

export const getMarketInsights = async (req: Request, res: Response) => {
  try {
    const { commodity } = req.params;

    const trend = MARKET_TRENDS[commodity as string];
    const exports = EXPORT_DATA.filter(item => item.commodity === commodity);

    if (!trend) {
      return res.status(404).json({
        success: false,
        message: `Market insights not found for: ${commodity}`
      });
    }

    res.json({
      success: true,
      data: {
        commodity,
        market_analysis: {
          trend: trend.trend,
          stability: trend.stability,
          price_history: {
            2023: trend.price_2023,
            2024: trend.price_2024,
            forecast_2025: trend.forecast_2025
          },
          global_exports: exports,
          demand_growth: `${trend.demand_growth}% annually`
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching market insights:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching market insights'
    });
  }
};
