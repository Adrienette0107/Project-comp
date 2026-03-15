import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CropRecommendation from '../components/CropRecommendation';
import YieldPrediction from '../components/YieldPrediction';
import GlobalMarket from '../components/GlobalMarket';
import SoilTestingCenters from '../components/SoilTestingCenters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, TrendingUp, Globe, Database } from 'lucide-react';

const Recommendations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Farming Intelligence
          </h1>
          <p className="text-gray-600">
            Make data-driven decisions with AI-powered crop recommendations, yield predictions, and market insights
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Crop Recommendations</p>
                  <p className="text-2xl font-bold">9+ Crops</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Yield Prediction</p>
                  <p className="text-2xl font-bold">ML Based</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Global Markets</p>
                  <p className="text-2xl font-bold">15+ Countries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Soil Testing</p>
                  <p className="text-2xl font-bold">Labs Nearby</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="crops" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="crops">Crop Recommendation</TabsTrigger>
            <TabsTrigger value="yield">Yield Prediction</TabsTrigger>
            <TabsTrigger value="soil">Soil Testing</TabsTrigger>
            <TabsTrigger value="market">Global Market</TabsTrigger>
          </TabsList>

          {/* Crop Recommendation Tab */}
          <TabsContent value="crops" className="space-y-4">
            <CropRecommendation />
          </TabsContent>

          {/* Yield Prediction Tab */}
          <TabsContent value="yield" className="space-y-4">
            <YieldPrediction />
          </TabsContent>

          {/* Soil Testing Tab */}
          <TabsContent value="soil" className="space-y-4">
            <SoilTestingCenters />
          </TabsContent>

          {/* Global Market Tab */}
          <TabsContent value="market" className="space-y-4">
            <GlobalMarket />
          </TabsContent>
        </Tabs>

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>How Crop Recommendation Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>Our AI engine analyzes multiple factors:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Soil Nutrients:</strong> Nitrogen, Phosphorus, Potassium levels</li>
                <li><strong>Climate:</strong> Temperature, humidity, rainfall patterns</li>
                <li><strong>Soil pH:</strong> Acidity/alkalinity balance</li>
                <li><strong>Location:</strong> Regional growing seasons</li>
              </ul>
              <p className="text-xs text-gray-500 italic">Get top 5 crop recommendations with confidence scores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Global Market Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>Access international market intelligence:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Price Trends:</strong> Historical and forecasted prices</li>
                <li><strong>Export Data:</strong> Top exporting countries by commodity</li>
                <li><strong>Demand Forecast:</strong> Future market demand predictions</li>
                <li><strong>Trade Analysis:</strong> Country-wise commodity exports</li>
              </ul>
              <p className="text-xs text-gray-500 italic">Make informed pricing and planting decisions</p>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Pro Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-blue-900">
            <p>✓ <strong>Get Soil Testing Done:</strong> Use our lab finder to get accurate soil nutrient levels</p>
            <p>✓ <strong>Monitor Weather:</strong> Keep track of local weather forecasts for accurate predictions</p>
            <p>✓ <strong>Check Market Trends:</strong> Review global market data before deciding on crop selection</p>
            <p>✓ <strong>Plan Ahead:</strong> Use yield predictions for harvest planning and market timing</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recommendations;
