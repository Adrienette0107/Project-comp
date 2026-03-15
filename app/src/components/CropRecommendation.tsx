import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Zap } from 'lucide-react';

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

const CropRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    pH: '',
    rainfall: '',
    state: '',
    district: ''
  });

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
    setRecommendations([]);

    try {
      // Validate inputs
      const numericFields = ['N', 'P', 'K', 'temperature', 'humidity', 'pH', 'rainfall'];
      for (const field of numericFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`${field.toUpperCase()} is required`);
        }
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/recommendations/crops`,
        {
          N: parseFloat(formData.N),
          P: parseFloat(formData.P),
          K: parseFloat(formData.K),
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          pH: parseFloat(formData.pH),
          rainfall: parseFloat(formData.rainfall),
          state: formData.state,
          district: formData.district
        }
      );

      if (response.data.success) {
        setRecommendations(response.data.data.recommendations);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Crop Recommendation Engine
          </CardTitle>
          <CardDescription>
            Enter your farm conditions to get personalized crop recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Soil Nutrients */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="N">Nitrogen (N) mg/kg</Label>
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
                <Label htmlFor="P">Phosphorus (P) mg/kg</Label>
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
                <Label htmlFor="K">Potassium (K) mg/kg</Label>
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
              <div className="space-y-2">
                <Label htmlFor="pH">Soil pH</Label>
                <Input
                  id="pH"
                  name="pH"
                  type="number"
                  placeholder="e.g., 7.0"
                  value={formData.pH}
                  onChange={handleInputChange}
                  step="0.1"
                  min="3"
                  max="10"
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

            {/* Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State (Optional)</Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="e.g., Maharashtra"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District (Optional)</Label>
                <Input
                  id="district"
                  name="district"
                  type="text"
                  placeholder="e.g., Pune"
                  value={formData.district}
                  onChange={handleInputChange}
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
              {loading ? 'Processing...' : 'Get Recommendations'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recommendations Results */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommended Crops</h3>
          <div className="grid grid-cols-1 gap-4">
            {recommendations.map((crop, index) => (
              <Card key={crop.crop} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <p className="text-2xl font-bold">#{index + 1}</p>
                      </div>
                      <div>
                        <CardTitle>{crop.crop}</CardTitle>
                        <CardDescription>
                          Confidence: {crop.confidence}%
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Temperature</p>
                      <p className="font-semibold">{crop.temp_min}°C - {crop.temp_max}°C</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Ideal NPK Ratio</p>
                      <p className="font-semibold">{crop.ideal_N}:{crop.ideal_P}:{crop.ideal_K}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Rainfall Required</p>
                      <p className="font-semibold">{crop.rainfall_min} - {crop.rainfall_max} mm</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Best Season</p>
                      <p className="font-semibold">{crop.seasons.join(', ')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
