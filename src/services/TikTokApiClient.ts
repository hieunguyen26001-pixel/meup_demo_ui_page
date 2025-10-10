/**
 * TikTok Shop API Client for React
 * Client-side service to interact with TikTok Shop APIs
 */

import axios, { type AxiosResponse } from "axios";
import config from "../config/env";

// Types
export interface TikTokTokenResponse {
  access_token: string;
  access_token_expire_in: number;
  refresh_token: string;
  refresh_token_expire_in: number;
  open_id: string;
  seller_name: string;
  seller_base_region: string;
  user_type: number;
}

export interface TikTokShopInfo {
  id: string;
  name: string;
  region: string;
  seller_type: string;
  code: string;
  cipher: string;
}

export interface TikTokBusinessAuthResponse {
  access_token: string;
  scope: number[];
  advertiser_ids: string[];
}

export interface TikTokStore {
  store_authorized_bc_id: string;
  store_code: string;
  store_id: string;
  store_name: string;
  store_type: string;
  targeting_region_codes: string[];
}

export interface TikTokStoreListResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    stores: TikTokStore[];
  };
}

export interface GmvMaxReportParams {
  advertiser_id: string;
  store_ids: string[];
  start_date: string;
  end_date: string;
  dimensions?: string[];
  metrics?: string[];
  filtering?: {
    gmv_max_promotion_types?: string[];
    campaign_ids?: string[];
    item_group_ids?: string[];
    item_ids?: string[];
  };
  page?: number;
  page_size?: number;
}

export interface GmvMaxReportResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    list: Array<{
      dimensions: {
        advertiser_id: string;
        stat_time_day: string;
        [key: string]: string;
      };
      metrics: {
        cost: string;
        cost_per_order: string;
        gross_revenue: string;
        net_cost: string;
        orders: string;
        roi: string;
        [key: string]: string;
      };
    }>;
    page_info: {
      page: number;
      page_size: number;
      total_number: number;
      total_page: number;
    };
  };
}

export interface Campaign {
  secondary_status: string;
  advertiser_id: string;
  is_smart_performance_campaign: boolean;
  campaign_name: string;
  is_new_structure: boolean;
  campaign_type: string;
  campaign_id: string;
  roas_bid: number;
  budget_mode: string;
  modify_time: string;
  operation_status: string;
  objective: string;
  objective_type: string;
  budget: number;
  create_time: string;
  deep_bid_type: string | null;
}

export interface CampaignListResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    list: Campaign[];
    page_info: {
      page: number;
      page_size: number;
      total_page: number;
      total_number: number;
    };
  };
}

export interface GmvMaxProductPerformanceParams {
  advertiser_id: string;
  store_ids: string[];
  start_date: string;
  end_date: string;
  campaign_ids: string[];
  product_id: string;
  page?: number;
  page_size?: number;
}

export interface GmvMaxProductPerformanceResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    list: Array<{
      dimensions: {
        item_group_id: string;
        stat_time_day: string;
      };
      metrics: {
        bid_type: string;
        cost: string;
        cost_per_order: string;
        currency: string;
        gross_revenue: string;
        item_group_id: string;
        orders: string;
        product_image_url: string;
        product_name: string;
        product_status: string;
        roi: string;
      };
    }>;
    page_info: {
      page: number;
      page_size: number;
      total_number: number;
      total_page: number;
    };
  };
}

export interface CreatorStats {
  creator_id: string;
  creator_avatar: string;
  creator_handle: string;
  creator_name: string;
  follower_cnt: number;
  affiliate_gmv: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  affiliate_live_gmv: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  affiliate_video_gmv: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  affiliate_showcase_gmv: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  est_commission: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  affiliate_refunded_gmv: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  target_collaboration_gmv: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  target_collaboration_est_commission: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  open_collaboration_gmv: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  open_collaboration_est_commission: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  affiliate_products_sold: number;
  items_sold: number;
  affiliate_orders: number;
  product_impressions: number;
  buyers: number;
  affiliate_lives: number;
  affiliate_videos: number;
  affiliate_items_refunded: number;
  avg_order_value: {
    amount_formatted: string;
    amount_delimited: string;
    amount: string;
    currency_code: string;
    currency_symbol: string;
  };
  ctr: string;
  redirect_info: {
    is_tsp_authorised: boolean;
    is_creator_analysis_authorised: boolean;
    redirect_url: string;
    disable_url: boolean;
  };
  cmp_affiliate_gmv: string;
  cmp_affiliate_live_gmv: string;
  cmp_affiliate_video_gmv: string;
  cmp_affiliate_showcase_gmv: string;
  cmp_est_commission: string;
  cmp_affiliate_refunded_gmv: string;
  cmp_target_collaboration_gmv: string;
  cmp_target_collaboration_est_commission: string;
  cmp_open_collaboration_gmv: string;
  cmp_open_collaboration_est_commission: string;
  cmp_affiliate_products_sold: string;
  cmp_items_sold: string;
  cmp_affiliate_orders: string;
  cmp_product_impressions: string;
  cmp_buyers: string;
  cmp_affiliate_lives: string;
  cmp_affiliate_videos: string;
  cmp_affiliate_items_refunded: string;
  cmp_avg_order_value: string;
  cmp_ctr: string;
}

export interface CreatorListParams {
  shopId: string;
  timeDescriptor: {
    start: string;
    end: string;
    timezone_offset: string;
    granularity: string;
    scenario: number;
  };
  statsTypes: number[];
  listControl: {
    rules: Array<{
      field: string;
      direction: number;
    }>;
    pagination: {
      page: number;
      size: number;
    };
  };
  filter: {
    shop_id: string;
  };
}

export interface CreatorListResponse {
  code: number;
  message: string;
  data: {
    time_descriptor: {
      start: string;
      end: string;
      timezone_offset: number;
      granularity: string;
      scenario: number;
    };
    list_control: {
      rules: Array<{
        direction: number;
        field: string;
      }>;
      next_pagination: {
        has_more: boolean;
        next_page: number;
        total_page: number;
        total: number;
      };
    };
    filter: {
      shop_id: string;
    };
    stats: CreatorStats[];
  };
}

class TikTokApiClient {
  private baseUrl = "https://business-api.tiktok.com";
  private partnerApiUrl = "https://partner.tiktokshop.com";
  
  // Token cache for client-side
  private tokenCache = new Map<string, { token: string; expiresAt: number }>();

  /**
   * Generate authorization URL for TikTok Shop
   */
  generateAuthorizationUrl(appKey: string, state?: string): string {
    const baseAuthUrl = "https://services.tiktokshop.com/open/authorize";
    const redirectUri = `${window.location.origin}/auth/tiktok/callback`;

    const params = new URLSearchParams({
      service_id: appKey,
      state: state || Date.now().toString(),
      redirect_uri: redirectUri,
    });

    return `${baseAuthUrl}?${params.toString()}`;
  }

  /**
   * Get advertiser information
   */
  async getAdvertiserInfos(
    accessToken: string,
    advertiserIds: string[]
  ): Promise<{
    code: number;
    message: string;
    request_id: string;
    data: { list: Array<Record<string, any>> };
  }> {
    const response: AxiosResponse = await axios.get(
      `${this.baseUrl}/open_api/v1.3/advertiser/info/`,
      {
        params: { advertiser_ids: JSON.stringify(advertiserIds) },
        headers: {
          "Access-Token": accessToken,
        },
      }
    );

    const data = response.data;
    if (data.code !== 0) {
      throw new Error(`TikTok Business API Error: ${data.message}`);
    }

    return data;
  }

  /**
   * Get store list
   */
  async getStores(
    accessToken: string,
    advertiserId: string
  ): Promise<TikTokStoreListResponse> {
    const response: AxiosResponse = await axios.get(
      `${this.baseUrl}/open_api/v1.3/store/list/`,
      {
        params: { advertiser_id: advertiserId },
        headers: {
          "Access-Token": accessToken,
        },
      }
    );

    const data = response.data;
    if (data.code !== 0) {
      throw new Error(`TikTok Business API Error: ${data.message}`);
    }

    return data;
  }

  /**
   * Get GMV Max report
   */
  async getGmvMaxReport(
    accessToken: string,
    params: GmvMaxReportParams
  ): Promise<GmvMaxReportResponse> {
    const queryParams = new URLSearchParams({
      advertiser_id: params.advertiser_id,
      store_ids: JSON.stringify(params.store_ids),
      start_date: params.start_date,
      end_date: params.end_date,
      page: (params.page || 1).toString(),
      page_size: (params.page_size || 1000).toString(),
    });

    if (params.dimensions) {
      queryParams.append("dimensions", JSON.stringify(params.dimensions));
    }

    if (params.metrics) {
      queryParams.append("metrics", JSON.stringify(params.metrics));
    }

    if (params.filtering) {
      queryParams.append("filtering", JSON.stringify(params.filtering));
    }

    const response: AxiosResponse = await axios.get(
      `${this.baseUrl}/open_api/v1.3/gmv_max/report/get/`,
      {
        params: queryParams,
        headers: {
          "Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (data.code !== 0) {
      throw new Error(`TikTok Business API Error: ${data.message}`);
    }

    return data;
  }

  /**
   * Get campaigns
   */
  async getCampaigns(
    accessToken: string,
    advertiserId: string
  ): Promise<CampaignListResponse> {
    const response: AxiosResponse = await axios.get(
      `${this.baseUrl}/open_api/v1.3/campaign/get/`,
      {
        params: {
          advertiser_id: advertiserId,
        },
        headers: {
          "Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (data.code !== 0) {
      throw new Error(`TikTok Business API Error: ${data.message}`);
    }

    return data;
  }

  /**
   * Get GMV Max product performance
   */
  async getGmvMaxProductPerformance(
    accessToken: string,
    params: GmvMaxProductPerformanceParams
  ): Promise<GmvMaxProductPerformanceResponse> {
    const queryParams = new URLSearchParams({
      advertiser_id: params.advertiser_id,
      store_ids: JSON.stringify(params.store_ids),
      start_date: params.start_date,
      end_date: params.end_date,
      dimensions: JSON.stringify(["item_group_id", "stat_time_day"]),
      metrics: JSON.stringify([
        "product_name",
        "item_group_id",
        "product_image_url",
        "product_status",
        "bid_type",
        "cost",
        "orders",
        "cost_per_order",
        "gross_revenue",
        "roi",
      ]),
      filtering: JSON.stringify({
        campaign_ids: params.campaign_ids,
      }),
      page: (params.page || 1).toString(),
      page_size: (params.page_size || 1000).toString(),
    });

    const response: AxiosResponse = await axios.get(
      `${this.baseUrl}/open_api/v1.3/gmv_max/report/get/`,
      {
        params: queryParams,
        headers: {
          "Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (data.code !== 0) {
      throw new Error(`TikTok Business API Error: ${data.message}`);
    }

    const allItems = data.data.list || [];
    const filteredItems = allItems.filter(
      (item: any) => item.dimensions?.item_group_id === params.product_id
    );

    const filteredData = {
      ...data,
      data: {
        ...data.data,
        list: filteredItems,
        page_info: {
          ...data.data.page_info,
          total_number: filteredItems.length,
          total_page: Math.ceil(
            filteredItems.length / (params.page_size || 1000)
          ),
        },
      },
    };

    return filteredData;
  }

  /**
   * Get creator list (Partner API)
   */
  async getCreatorList(
    params: CreatorListParams
  ): Promise<CreatorListResponse> {
    const queryParams: Record<string, string> = {
      user_language: "en",
      aid: "360019",
      app_name: "i18n_ecom_alliance",
      device_id: "0",
      fp: "verify_mfz1v8zr_GJEwDFgg_O5Et_4nT5_84S6_058VwQDulWy8",
      device_platform: "web",
      cookie_enabled: "true",
      timezone_name: "Asia%2FSaigon",
      partner_id: config.partnerAppKey,
      region_code: "VN",
      biz_role: "1",
    };

    const requestBody = {
      request: {
        time_descriptor: params.timeDescriptor,
        stats_types: params.statsTypes,
        list_control: params.listControl,
        filter: params.filter,
      },
      version: "2",
    };

    const response: AxiosResponse = await axios.post(
      `${this.partnerApiUrl}/api/v2/insights/partner/affiliate/creator/list`,
      requestBody,
      {
        params: queryParams,
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (data.code !== 0) {
      throw new Error(`TikTok Partner API Error: ${data.message}`);
    }

    return data;
  }

  /**
   * Cache token for client-side usage
   */
  cacheToken(key: string, token: string, expiresIn: number): void {
    const expiresAt = Date.now() + (expiresIn * 1000);
    this.tokenCache.set(key, { token, expiresAt });
    
    // Store in localStorage for persistence
    localStorage.setItem(`tiktok_token_${key}`, JSON.stringify({
      token,
      expiresAt
    }));
  }

  /**
   * Get cached token
   */
  getCachedToken(key: string): string | null {
    // Try memory cache first
    const cached = this.tokenCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.token;
    }

    // Try localStorage
    const stored = localStorage.getItem(`tiktok_token_${key}`);
    if (stored) {
      try {
        const { token, expiresAt } = JSON.parse(stored);
        if (expiresAt > Date.now()) {
          // Update memory cache
          this.tokenCache.set(key, { token, expiresAt });
          return token;
        } else {
          // Remove expired token
          localStorage.removeItem(`tiktok_token_${key}`);
        }
      } catch (error) {
        console.error('Failed to parse stored token:', error);
        localStorage.removeItem(`tiktok_token_${key}`);
      }
    }

    return null;
  }

  /**
   * Clear cached token
   */
  clearCachedToken(key: string): void {
    this.tokenCache.delete(key);
    localStorage.removeItem(`tiktok_token_${key}`);
  }

  /**
   * Check if token needs refresh
   */
  needsRefresh(key: string): boolean {
    const cached = this.tokenCache.get(key);
    if (!cached) return true;
    
    // Refresh if expires in less than 5 minutes
    return cached.expiresAt - Date.now() < 5 * 60 * 1000;
  }
}

// Export singleton instance
export const tiktokApiClient = new TikTokApiClient();
export default tiktokApiClient;
