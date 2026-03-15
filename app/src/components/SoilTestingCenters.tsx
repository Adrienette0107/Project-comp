import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, MapPin, Phone, Mail, Database } from 'lucide-react';

interface SoilTestingCenter {
  id: string;
  name: string;
  state: string;
  district: string;
  address: string;
  phone: string;
  email: string;
}

interface SoilData {
  state: string;
  district: string;
  soil_nutrients: {
    N: number;
    P: number;
    K: number;
    pH: number;
  };
  recommendations: string[];
}

const SoilTestingCenters = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('');
  const [centers, setCenters] = useState<SoilTestingCenter[]>([]);
  const [soilData, setSoilData] = useState<SoilData | null>(null);

  const indianStates = [
    'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh',
    'Karnataka', 'Rajasthan', 'Gujarat', 'Madhya Pradesh',
    'West Bengal', 'Bihar', 'Tamil Nadu', 'Andhra Pradesh'
  ];

  const handleSearchCenters = async () => {
    try {
      setLoading(true);
      setError('');
      setCenters([]);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/recommendations/testing-centers?state=${state}`
      );

      if (response.data.success) {
        setCenters(response.data.data.centers);
        if (response.data.data.centers.length === 0) {
          setError(response.data.data.message);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to find soil testing centers');
    } finally {
      setLoading(false);
    }
  };

  const handleGetSoilData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/recommendations/soil-data?state=${state}&district=${district}`
      );

      if (response.data.success) {
        setSoilData(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch soil data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Soil Data Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-500" />
            Soil Data & Information
          </CardTitle>
          <CardDescription>
            Get default soil nutrient data for your region
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="soil-state">State</Label>
              <select
                id="soil-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {indianStates.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="soil-district">District (Optional)</Label>
              <Input
                id="soil-district"
                type="text"
                placeholder="e.g., Pune"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleGetSoilData}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : 'Get Soil Data'}
          </Button>

          {soilData && (
            <div className="bg-orange-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">
                Soil Nutrient Data - {soilData.state}
                {soilData.district && ` (${soilData.district})`}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded border-l-4 border-l-green-500">
                  <p className="text-xs text-gray-600">Nitrogen (N)</p>
                  <p className="text-2xl font-bold">{soilData.soil_nutrients.N}</p>
                  <p className="text-xs text-gray-500">mg/kg</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-l-blue-500">
                  <p className="text-xs text-gray-600">Phosphorus (P)</p>
                  <p className="text-2xl font-bold">{soilData.soil_nutrients.P}</p>
                  <p className="text-xs text-gray-500">mg/kg</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-l-purple-500">
                  <p className="text-xs text-gray-600">Potassium (K)</p>
                  <p className="text-2xl font-bold">{soilData.soil_nutrients.K}</p>
                  <p className="text-xs text-gray-500">mg/kg</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-l-amber-500">
                  <p className="text-xs text-gray-600">Soil pH</p>
                  <p className="text-2xl font-bold">{soilData.soil_nutrients.pH}</p>
                  <p className="text-xs text-gray-500">pH Value</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded">
                <p className="font-semibold text-sm mb-2">Recommendations:</p>
                <ul className="space-y-1">
                  {soilData.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Soil Testing Centers Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Soil Testing Centers
          </CardTitle>
          <CardDescription>
            Find approved soil testing laboratories in your region
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="center-state">Select State</Label>
            <select
              id="center-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mt-1"
            >
              {indianStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleSearchCenters}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Searching...' : 'Find Testing Centers'}
          </Button>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {centers.length > 0 && (
            <div className="space-y-3">
              <p className="font-semibold">
                Found {centers.length} testing center{centers.length !== 1 ? 's' : ''}
              </p>
              {centers.map(center => (
                <Card key={center.id} className="bg-gray-50">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold text-lg mb-2">{center.name}</h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{center.address}</p>
                          <p className="text-gray-600">
                            {center.district}, {center.state}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <a href={`tel:${center.phone}`} className="text-blue-600 hover:underline">
                          {center.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-500" />
                        <a href={`mailto:${center.email}`} className="text-blue-600 hover:underline">
                          {center.email}
                        </a>
                      </div>
                    </div>

                    <Button
                      className="mt-3 w-full"
                      variant="outline"
                      onClick={() => window.open(`https://maps.google.com/?q=${center.address}`, '_blank')}
                    >
                      View on Maps
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SoilTestingCenters;
