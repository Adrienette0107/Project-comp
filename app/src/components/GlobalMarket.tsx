import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MarketTrend {
  commodity: string;
  trend: string;
  stability: string;
  price_history: {
    2023: number;
    2024: number;
    forecast_2025: number;
  };
  demand_growth: string;
}

interface CountryExport {
  commodity: string;
  volume_million_tons: number;
  value_million_usd: number;
  per_unit_price: number;
}

const GlobalMarket = () => {
  const [activeTab, setActiveTab] = useState<'trends' | 'exporters' | 'demand'>('trends');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commodities, setCommodities] = useState<string[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState('Rice');
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [countries, setCountries] = useState<string[]>([]);
  const [marketData, setMarketData] = useState<any>(null);
  const [exportData, setExportData] = useState<CountryExport[]>([]);
  const [demandData, setDemandData] = useState<any>(null);

  // Fetch commodities and countries on mount
  useEffect(() => {
    fetchCommodidades();
    fetchCountries();
  }, []);

  // Fetch market data when commodity changes
  useEffect(() => {
    if (selectedCommodity) {
      fetchMarketData(selectedCommodity);
    }
  }, [selectedCommodity]);

  // Fetch export data when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchCountryExports(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchCommodidades = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/global-market/commodities`
      );
      if (response.data.success) {
        setCommodities(response.data.data.commodities);
      }
    } catch (err) {
      console.error('Error fetching commodities:', err);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/global-market/countries`
      );
      if (response.data.success) {
        setCountries(response.data.data.countries);
      }
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const fetchMarketData = async (commodity: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/global-market/market-insights/${commodity}`
      );
      if (response.data.success) {
        setMarketData(response.data.data.market_analysis);
        setError('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCountryExports = async (country: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/global-market/export-by-country/${country}`
      );
      if (response.data.success) {
        setExportData(response.data.data.exports);
      }
    } catch (err) {
      console.error('Error fetching country exports:', err);
    }
  };

  const fetchDemandForecast = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/global-market/demand-forecast?commodity=${selectedCommodity}&country=${selectedCountry}`
      );
      if (response.data.success) {
        setDemandData(response.data.data);
        setError('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch demand forecast');
    } finally {
      setLoading(false);
    }
  };

  const priceChartData = marketData?.price_history ? [
    { year: '2023', price: marketData.price_history['2023'] },
    { year: '2024', price: marketData.price_history['2024'] },
    { year: '2025F', price: marketData.price_history.forecast_2025 }
  ] : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Global Market Intelligence
          </CardTitle>
          <CardDescription>
            Analyze international commodity prices, demand trends, and export data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tab Selection */}
          <div className="flex gap-2 border-b">
            <Button
              variant={activeTab === 'trends' ? 'default' : 'outline'}
              onClick={() => setActiveTab('trends')}
              className="rounded-none"
            >
              Market Trends
            </Button>
            <Button
              variant={activeTab === 'exporters' ? 'default' : 'outline'}
              onClick={() => setActiveTab('exporters')}
              className="rounded-none"
            >
              Top Exporters
            </Button>
            <Button
              variant={activeTab === 'demand' ? 'default' : 'outline'}
              onClick={() => setActiveTab('demand')}
              className="rounded-none"
            >
              Demand Forecast
            </Button>
          </div>

          {/* Market Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commodity">Select Commodity</Label>
                <select
                  id="commodity"
                  value={selectedCommodity}
                  onChange={(e) => setSelectedCommodity(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {commodities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {loading && <p className="text-center">Loading...</p>}

              {marketData && (
                <div className="space-y-4">
                  {/* Trend indicators */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Market Trend</p>
                      <p className="text-lg font-semibold capitalize">{marketData.trend}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Stability</p>
                      <p className="text-lg font-semibold capitalize">{marketData.stability}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Demand Growth</p>
                      <p className="text-lg font-semibold">{marketData.demand_growth}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600">Global Exports</p>
                      <p className="text-lg font-semibold">{marketData.global_exports?.length || 0} Countries</p>
                    </div>
                  </div>

                  {/* Price chart */}
                  {priceChartData.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-4">Price Trend (USD/Ton)</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={priceChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Top Exporters Tab */}
          {activeTab === 'exporters' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Select Country</Label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {exportData.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-4">Export Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={exportData.map(item => ({
                          name: item.commodity,
                          volume: item.volume_million_tons,
                          value: item.value_million_usd
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="volume" fill="#10b981" name="Volume (M Tons)" />
                        <Bar yAxisId="right" dataKey="value" fill="#f59e0b" name="Value (M USD)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    {exportData.map(item => (
                      <div key={item.commodity} className="p-3 border rounded-lg">
                        <p className="font-semibold">{item.commodity}</p>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                          <p>Volume: {item.volume_million_tons}M Tons</p>
                          <p>Value: ${item.value_million_usd}M</p>
                          <p>Price: ${item.per_unit_price}/Unit</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Demand Forecast Tab */}
          {activeTab === 'demand' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="forecast-commodity">Commodity</Label>
                  <select
                    id="forecast-commodity"
                    value={selectedCommodity}
                    onChange={(e) => setSelectedCommodity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                  >
                    {commodities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="forecast-country">Country</Label>
                  <select
                    id="forecast-country"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                  >
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                onClick={fetchDemandForecast}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Loading...' : 'Get Forecast'}
              </Button>

              {demandData && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Demand Forecast</h4>
                    <p className="text-sm text-gray-600">
                      {demandData.commodity} | {demandData.country}
                    </p>
                    {demandData.forecast && (
                      <div className="grid grid-cols-3 gap-4 mt-3 text-center">
                        {Object.entries(demandData.forecast).map(([year, value]) => (
                          <div key={year}>
                            <p className="text-xs text-gray-500">{year}</p>
                            <p className="text-lg font-bold">{value}M Tons</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalMarket;
