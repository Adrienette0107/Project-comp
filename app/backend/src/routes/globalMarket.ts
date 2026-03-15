import express from 'express';
import {
  getGlobalCountries,
  getGlobalCommodities,
  getTopExporters,
  getExportByCountry,
  getCommodityTrend,
  getDemandForecast,
  getCountryCommodities,
  getExportDemand,
  getMarketInsights
} from '../controllers/globalMarketController';

const router = express.Router();

/**
 * Global Market Data Endpoints
 */
router.get('/countries', getGlobalCountries);
router.get('/commodities', getGlobalCommodities);

/**
 * Exporter & Demand Endpoints
 */
router.get('/exporters', getTopExporters);
router.get('/export-by-country/:country', getExportByCountry);
router.get('/country-commodities/:country', getCountryCommodities);
router.get('/export-demand', getExportDemand);

/**
 * Market Analysis Endpoints
 */
router.get('/commodity-trend/:commodity', getCommodityTrend);
router.get('/demand-forecast', getDemandForecast);
router.get('/market-insights/:commodity', getMarketInsights);

export default router;
