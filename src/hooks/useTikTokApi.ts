/**
 * React Hook for TikTok Shop API
 * Provides easy access to TikTok API functions in React components
 */

import { useState, useCallback, useEffect } from 'react';
import tiktokApiClient, { 
  type GmvMaxReportParams, 
  type GmvMaxReportResponse,
  type CampaignListResponse,
  type GmvMaxProductPerformanceParams,
  type GmvMaxProductPerformanceResponse,
  type CreatorListParams,
  type CreatorListResponse,
  type TikTokStoreListResponse
} from '../services/TikTokApiClient';

interface UseTikTokApiReturn {
  // State
  loading: boolean;
  error: string | null;
  data: any;
  
  // Actions
  getGmvMaxReport: (params: GmvMaxReportParams, accessToken: string) => Promise<void>;
  getCampaigns: (advertiserId: string, accessToken: string) => Promise<void>;
  getGmvMaxProductPerformance: (params: GmvMaxProductPerformanceParams, accessToken: string) => Promise<void>;
  getCreatorList: (params: CreatorListParams) => Promise<void>;
  getStores: (advertiserId: string, accessToken: string) => Promise<void>;
  getAdvertiserInfos: (advertiserIds: string[], accessToken: string) => Promise<void>;
  
  // Token management
  cacheToken: (key: string, token: string, expiresIn: number) => void;
  getCachedToken: (key: string) => string | null;
  clearCachedToken: (key: string) => void;
  needsRefresh: (key: string) => boolean;
  
  // Utility
  generateAuthUrl: (appKey: string, state?: string) => string;
  clearError: () => void;
}

export const useTikTokApi = (): UseTikTokApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiCall = useCallback(async (apiCall: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGmvMaxReport = useCallback(async (params: GmvMaxReportParams, accessToken: string) => {
    return handleApiCall(() => tiktokApiClient.getGmvMaxReport(accessToken, params));
  }, [handleApiCall]);

  const getCampaigns = useCallback(async (advertiserId: string, accessToken: string) => {
    return handleApiCall(() => tiktokApiClient.getCampaigns(accessToken, advertiserId));
  }, [handleApiCall]);

  const getGmvMaxProductPerformance = useCallback(async (params: GmvMaxProductPerformanceParams, accessToken: string) => {
    return handleApiCall(() => tiktokApiClient.getGmvMaxProductPerformance(accessToken, params));
  }, [handleApiCall]);

  const getCreatorList = useCallback(async (params: CreatorListParams) => {
    return handleApiCall(() => tiktokApiClient.getCreatorList(params));
  }, [handleApiCall]);

  const getStores = useCallback(async (advertiserId: string, accessToken: string) => {
    return handleApiCall(() => tiktokApiClient.getStores(accessToken, advertiserId));
  }, [handleApiCall]);

  const getAdvertiserInfos = useCallback(async (advertiserIds: string[], accessToken: string) => {
    return handleApiCall(() => tiktokApiClient.getAdvertiserInfos(accessToken, advertiserIds));
  }, [handleApiCall]);

  const cacheToken = useCallback((key: string, token: string, expiresIn: number) => {
    tiktokApiClient.cacheToken(key, token, expiresIn);
  }, []);

  const getCachedToken = useCallback((key: string) => {
    return tiktokApiClient.getCachedToken(key);
  }, []);

  const clearCachedToken = useCallback((key: string) => {
    tiktokApiClient.clearCachedToken(key);
  }, []);

  const needsRefresh = useCallback((key: string) => {
    return tiktokApiClient.needsRefresh(key);
  }, []);

  const generateAuthUrl = useCallback((appKey: string, state?: string) => {
    return tiktokApiClient.generateAuthorizationUrl(appKey, state);
  }, []);

  return {
    // State
    loading,
    error,
    data,
    
    // Actions
    getGmvMaxReport,
    getCampaigns,
    getGmvMaxProductPerformance,
    getCreatorList,
    getStores,
    getAdvertiserInfos,
    
    // Token management
    cacheToken,
    getCachedToken,
    clearCachedToken,
    needsRefresh,
    
    // Utility
    generateAuthUrl,
    clearError,
  };
};

/**
 * Hook for TikTok authentication flow
 */
export const useTikTokAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [advertiserIds, setAdvertiserIds] = useState<string[]>([]);

  useEffect(() => {
    // Check for stored authentication on mount
    const storedToken = localStorage.getItem('tiktok_access_token');
    const storedAdvertiserIds = localStorage.getItem('tiktok_advertiser_ids');
    
    if (storedToken) {
      setAccessToken(storedToken);
      setIsAuthenticated(true);
    }
    
    if (storedAdvertiserIds) {
      try {
        setAdvertiserIds(JSON.parse(storedAdvertiserIds));
      } catch (error) {
        console.error('Failed to parse stored advertiser IDs:', error);
      }
    }
  }, []);

  const login = useCallback((token: string, advertiserIds: string[]) => {
    setAccessToken(token);
    setAdvertiserIds(advertiserIds);
    setIsAuthenticated(true);
    
    // Store in localStorage
    localStorage.setItem('tiktok_access_token', token);
    localStorage.setItem('tiktok_advertiser_ids', JSON.stringify(advertiserIds));
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setAdvertiserIds([]);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('tiktok_access_token');
    localStorage.removeItem('tiktok_advertiser_ids');
    
    // Clear all cached tokens
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('tiktok_token_')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const generateAuthUrl = useCallback((state?: string) => {
    return tiktokApiClient.generateAuthorizationUrl(config.businessAppKey, state);
  }, []);

  return {
    isAuthenticated,
    accessToken,
    advertiserIds,
    login,
    logout,
    generateAuthUrl,
  };
};

export default useTikTokApi;
