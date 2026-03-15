import create from 'zustand';
import axios from 'axios';

interface CropRecommendation {
  crop: string;
  confidence: number;
  ideal_N: number;
  ideal_P: number;
  ideal_K: number;
  temp_min: number;
  temp_max: number;
  rainfall_min: number;
  rainfall_max: number;
  seasons: string[];
}

interface YieldPrediction {
  crop: string;
  area: number;
  estimated_yield_per_hectare: number;
  total_production: number;
  confidence: string;
  factors: {
    nutrient_score: number;
    temperature_factor: number;
    humidity_factor: number;
    rainfall_factor: number;
  };
}

interface CropData {
  name: string;
  ideal_conditions: any;
}

interface RecommendationStore {
  // State
  recommendations: CropRecommendation[];
  yieldPrediction: YieldPrediction | null;
  cropsList: CropData[];
  marketTrends: any[];
  globalCountries: string[];
  globalCommodities: string[];
  soilData: any;
  testingCenters: any[];
  loading: boolean;
  error: string | null;

  // Actions
  getCropRecommendations: (data: any) => Promise<void>;
  predictYield: (data: any) => Promise<void>;
  getCropsList: () => Promise<void>;
  getSoilData: (state: string, district?: string) => Promise<void>;
  getTestingCenters: (state: string) => Promise<void>;
  getGlobalCountries: () => Promise<void>;
  getGlobalCommodities: () => Promise<void>;
  getMarketTrends: (commodity: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const useRecommendationStore = create((set, get) => ({
  recommendations: [],
  yieldPrediction: null,
  cropsList: [],
  marketTrends: [],
  globalCountries: [],
  globalCommodities: [],
  soilData: null,
  testingCenters: [],
  loading: false,
  error: null,

  getCropRecommendations: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/recommendations/crops`,
        data
      );
      if (response.data.success) {
        set({ recommendations: response.data.data.recommendations });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to get recommendations' });
    } finally {
      set({ loading: false });
    }
  },

  predictYield: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/recommendations/yield-prediction`,
        data
      );
      if (response.data.success) {
        set({ yieldPrediction: response.data.data });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to predict yield' });
    } finally {
      set({ loading: false });
    }
  },

  getCropsList: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/recommendations/crops/list`
      );
      if (response.data.success) {
        set({ cropsList: response.data.data.crops });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch crops list' });
    } finally {
      set({ loading: false });
    }
  },

  getSoilData: async (state, district) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({ state });
      if (district) params.append('district', district);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/recommendations/soil-data?${params}`
      );
      if (response.data.success) {
        set({ soilData: response.data.data });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch soil data' });
    } finally {
      set({ loading: false });
    }
  },

  getTestingCenters: async (state) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/recommendations/testing-centers?state=${state}`
      );
      if (response.data.success) {
        set({ testingCenters: response.data.data.centers });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch testing centers' });
    } finally {
      set({ loading: false });
    }
  },

  getGlobalCountries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/global-market/countries`
      );
      if (response.data.success) {
        set({ globalCountries: response.data.data.countries });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch countries' });
    } finally {
      set({ loading: false });
    }
  },

  getGlobalCommodities: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/global-market/commodities`
      );
      if (response.data.success) {
        set({ globalCommodities: response.data.data.commodities });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch commodities' });
    } finally {
      set({ loading: false });
    }
  },

  getMarketTrends: async (commodity) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/global-market/market-insights/${commodity}`
      );
      if (response.data.success) {
        set({ marketTrends: [response.data.data] });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch market trends' });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set({
    recommendations: [],
    yieldPrediction: null,
    cropsList: [],
    marketTrends: [],
    soilData: null,
    testingCenters: [],
    loading: false,
    error: null
  })
}));

export default useRecommendationStore as unknown as () => RecommendationStore;
