/**
 * TikTok API Demo Component
 * Demonstrates how to use TikTok Shop API in React components
 */

import React, { useState } from 'react';
import { useTikTokApi, useTikTokAuth } from '../../hooks/useTikTokApi';
import TikTokDatePicker from '../ui/TikTokDatePicker';
import config from '../../config/env';

const TikTokApiDemo: React.FC = () => {
  const { 
    loading, 
    error, 
    data, 
    getGmvMaxReport, 
    getCampaigns,
    getStores,
    clearError 
  } = useTikTokApi();
  
  const { 
    isAuthenticated, 
    accessToken, 
    advertiserIds, 
    login, 
    logout, 
    generateAuthUrl 
  } = useTikTokAuth();

  const [selectedAdvertiserId, setSelectedAdvertiserId] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start_date: '2024-01-01',
    end_date: '2024-01-31'
  });

  const handleLogin = () => {
    const authUrl = generateAuthUrl();
    window.open(authUrl, '_blank');
  };

  const handleGetCampaigns = async () => {
    if (!accessToken || !selectedAdvertiserId) {
      alert('Please select an advertiser ID');
      return;
    }

    try {
      await getCampaigns(selectedAdvertiserId, accessToken);
    } catch (error) {
      console.error('Failed to get campaigns:', error);
    }
  };

  const handleGetGmvMaxReport = async () => {
    if (!accessToken || !selectedAdvertiserId) {
      alert('Please select an advertiser ID');
      return;
    }

    try {
      const params = {
        advertiser_id: selectedAdvertiserId,
        store_ids: ['your_store_id'], // Replace with actual store IDs
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        dimensions: ['stat_time_day'],
        metrics: ['cost', 'orders', 'gross_revenue', 'roi'],
        page: 1,
        page_size: 100
      };

      await getGmvMaxReport(params, accessToken);
    } catch (error) {
      console.error('Failed to get GMV Max report:', error);
    }
  };

  const handleGetStores = async () => {
    if (!accessToken || !selectedAdvertiserId) {
      alert('Please select an advertiser ID');
      return;
    }

    try {
      await getStores(selectedAdvertiserId, accessToken);
    } catch (error) {
      console.error('Failed to get stores:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          TikTok Shop API Demo
        </h2>
        
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This demo shows how to integrate with TikTok Shop API. 
            You need to authenticate first to access the API.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              API Credentials Required:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Partner App Key: {config.partnerAppKey ? '✅ Configured' : '❌ Missing'}</li>
              <li>• Business App Key: {config.businessAppKey ? '✅ Configured' : '❌ Missing'}</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Authenticate with TikTok Shop
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            TikTok Shop API Demo
          </h2>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-green-800 dark:text-green-200">
            ✅ Authenticated successfully! 
            Advertiser IDs: {advertiserIds.join(', ')}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          API Controls
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Advertiser ID
            </label>
            <select
              value={selectedAdvertiserId}
              onChange={(e) => setSelectedAdvertiserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Advertiser ID</option>
              {advertiserIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <TikTokDatePicker
              selectsRange={true}
              startDate={dateRange.start_date ? new Date(dateRange.start_date) : undefined}
              endDate={dateRange.end_date ? new Date(dateRange.end_date) : undefined}
              onChange={(dates) => {
                if (Array.isArray(dates) && dates.length === 2) {
                  setDateRange({
                    start_date: dates[0].toISOString().split('T')[0],
                    end_date: dates[1].toISOString().split('T')[0]
                  });
                }
              }}
              placeholder="Chọn khoảng thời gian"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGetCampaigns}
            disabled={loading || !selectedAdvertiserId}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Get Campaigns'}
          </button>

          <button
            onClick={handleGetGmvMaxReport}
            disabled={loading || !selectedAdvertiserId}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Get GMV Max Report'}
          </button>

          <button
            onClick={handleGetStores}
            disabled={loading || !selectedAdvertiserId}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Get Stores'}
          </button>

          {error && (
            <button
              onClick={clearError}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear Error
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
            Error
          </h3>
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Data Display */}
      {data && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            API Response
          </h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TikTokApiDemo;
