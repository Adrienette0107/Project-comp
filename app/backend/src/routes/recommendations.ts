import express from 'express';
import {
  recommendCrops,
  predictYield,
  getSoilData,
  getSoilTestingCenters,
  getCropsList,
  getSeasonalRecommendations
} from '../controllers/recommendationController';

const router = express.Router();

/**
 * Crop Recommendation Endpoints
 */
router.post('/crops', recommendCrops);
router.post('/yield-prediction', predictYield);
router.get('/crops/list', getCropsList);
router.get('/seasonal', getSeasonalRecommendations);

/**
 * Soil Data Endpoints
 */
router.get('/soil-data', getSoilData);
router.get('/testing-centers', getSoilTestingCenters);

export default router;
