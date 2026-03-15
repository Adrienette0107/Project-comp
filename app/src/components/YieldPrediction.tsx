import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Sprout, TrendingUp } from 'lucide-react';

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

const YieldPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<YieldPrediction | null>(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    crop: 'Rice',
    area: '',
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    rainfall: ''
  });

  const crops = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Chickpea', 'Potato', 'Tomato', 'Onion'];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      // Validate inputs
      const requiredFields = ['crop', 'area', 'N', 'P', 'K', 'temperature', 'humidity', 'rainfall'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`${field} is required`);
        }
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/recommendations/yield-prediction`,
        {
          crop: formData.crop,
          area: parseFloat(formData.area),
          N: parseFloat(formData.N),
          P: parseFloat(formData.P),
          K: parseFloat(formData.K),
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          rainfall: parseFloat(formData.rainfall)
        }
      );

      if (response.data.success) {
        setPrediction(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to predict yield');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-500" />
            Yield Prediction
          </CardTitle>
          <CardDescription>
            Estimate your crop yield based on farm conditions and historical data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Crop and Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crop">Select Crop</Label>
                <select
                  id="crop"
                  name="crop"
                  value={formData.crop}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {crops.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Farm Area (Hectares)</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.area}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
            </div>

            {/* Soil Nutrients */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="N">Nitrogen (mg/kg)</Label>
                <Input
                  id="N"
                  name="N"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.N}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="P">Phosphorus (mg/kg)</Label>
                <Input
                  id="P"
                  name="P"
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.P}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="K">Potassium (mg/kg)</Label>
                <Input
                  id="K"
                  name="K"
                  type="number"
                  placeholder="e.g., 40"
                  value={formData.K}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  placeholder="e.g., 25"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidity">Humidity (%)</Label>
                <Input
                  id="humidity"
                  name="humidity"
                  type="number"
                  placeholder="e.g., 65"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rainfall">Rainfall (mm)</Label>
                <Input
                  id="rainfall"
                  name="rainfall"
                  type="number"
                  placeholder="e.g., 800"
                  value={formData.rainfall}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Calculating...' : 'Predict Yield'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Prediction Result */}
      {prediction && (
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Yield Prediction Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                <p className="text-gray-600 text-sm">Estimated Yield per Hectare</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {prediction.estimated_yield_per_hectare}
                </p>
                <p className="text-gray-500 text-xs mt-1">quintals/hectare</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                <p className="text-gray-600 text-sm">Total Production</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {prediction.total_production}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {prediction.crop} ({prediction.area} hectares)
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-amber-200">
                <p className="text-gray-600 text-sm">Confidence Level</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">
                  {prediction.confidence}
                </p>
                <p className="text-gray-500 text-xs mt-1">Based on current factors</p>
              </div>
            </div>

            {/* Factor analysis */}
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Influencing Factors</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Nutrient Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${Math.min(prediction.factors.nutrient_score * 100, 100)}%` }}
                      />
                    </div>
                    <span className="font-semibold w-12 text-right">
                      {Math.round(prediction.factors.nutrient_score * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Temperature Factor</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${prediction.factors.temperature_factor * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold w-12 text-right">
                      {Math.round(prediction.factors.temperature_factor * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Humidity Factor</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 transition-all"
                        style={{ width: `${prediction.factors.humidity_factor * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold w-12 text-right">
                      {Math.round(prediction.factors.humidity_factor * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rainfall Factor</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all"
                        style={{ width: `${prediction.factors.rainfall_factor * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold w-12 text-right">
                      {Math.round(prediction.factors.rainfall_factor * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YieldPrediction;
