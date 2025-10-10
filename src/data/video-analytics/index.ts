/**
 * Video Analytics Data Manager
 * 
 * This file provides utilities for managing video analytics data
 * Import and use these functions in your components
 */

export interface VideoAnalyticsData {
  tt_account_name: string;
  tt_account_avatar_icon: string;
  item_id: string;
  material_name: string;
  shop_content_type: string;
  material_video_info_poster_url: string;
  material_video_info_video_id: string;
  material_video_info_play_url: string;
  material_authorized_type: string;
  item_authorization_type: string;
  item_public_status: string;
  item_delivery_status: string;
  item_delivery_secondary_status: string;
  authorize_remove_time: string;
  item_authorization_priority: string;
  unavailable_reason_enum: string;
  video_bi_appeal_info: string;
  is_gmv_top_ten_percent: string;
  onsite_roi2_shopping_sku: string;
  onsite_roi2_shopping_value: string;
  onsite_shopping_sku_cvr: string;
  play_2s_rate: string;
  play_6s_rate: string;
  play_first_quartile_rate: string;
  play_midpoint_rate: string;
  play_third_quartile_rate: string;
  play_over_rate: string;
  mixed_real_cost: string;
  mixed_real_cost_per_onsite_roi2_shopping_sku: string;
  onsite_mixed_real_roi2_shopping: string;
  roi2_show_cnt: string;
  roi2_click_cnt: string;
  roi2_ctr: string;
}

export interface VideoAnalyticsMetadata {
  totalVideos: number;
  dataSource: string;
  fields: Record<string, string>;
}

export interface VideoAnalyticsResponse {
  pagination: {
    page: number;
    page_count: number;
    total_count: number;
  };
  table: VideoAnalyticsData[];
}

// Import the JSON data
import videoDataJson from './videoData.json';

/**
 * Get video analytics data
 * @returns VideoAnalyticsResponse
 */
export const getVideoAnalyticsData = (): VideoAnalyticsResponse => {
  return videoDataJson as VideoAnalyticsResponse;
};

/**
 * Get video data array
 * @returns VideoAnalyticsData[]
 */
export const getVideoData = (): VideoAnalyticsData[] => {
  const data = (videoDataJson as any).table || [];
  return data.slice(0, 20); // Limit to 20 videos for better performance
};

/**
 * Get video metadata
 * @returns VideoAnalyticsMetadata
 */
export const getVideoMetadata = (): VideoAnalyticsMetadata => {
  const data = videoDataJson as VideoAnalyticsResponse;
  return {
    totalVideos: data.pagination.total_count,
    dataSource: "TikTok Ads API",
    fields: {
      tt_account_name: "TikTok Account Name",
      tt_account_avatar_icon: "Account Avatar URL",
      item_id: "Video Item ID",
      material_name: "Video Title/Description",
      shop_content_type: "Content Type (video/product_card)",
      material_video_info_poster_url: "Video Thumbnail URL",
      material_video_info_video_id: "Video ID",
      material_video_info_play_url: "Video Play URL",
      item_delivery_status: "Delivery Status (3=Active, 4=Paused, 0=Inactive)",
      is_gmv_top_ten_percent: "Top 10% Performer (1=Yes, 0=No)",
      onsite_roi2_shopping_sku: "SKU Count",
      onsite_roi2_shopping_value: "Revenue Value",
      onsite_shopping_sku_cvr: "Conversion Rate",
      play_2s_rate: "2 Second Play Rate %",
      play_6s_rate: "6 Second Play Rate %",
      play_first_quartile_rate: "25% Completion Rate %",
      play_midpoint_rate: "50% Completion Rate %",
      play_third_quartile_rate: "75% Completion Rate %",
      play_over_rate: "100% Completion Rate %",
      mixed_real_cost: "Total Cost",
      mixed_real_cost_per_onsite_roi2_shopping_sku: "Cost per SKU",
      onsite_mixed_real_roi2_shopping: "ROI Value",
      roi2_show_cnt: "Show Count (Views)",
      roi2_click_cnt: "Click Count",
      roi2_ctr: "Click Through Rate %"
    }
  };
};

/**
 * Calculate summary metrics from video data
 * @param data VideoAnalyticsData[]
 * @returns Summary metrics object
 */
export const calculateVideoMetrics = (data: VideoAnalyticsData[]) => {
  const totalViews = data.reduce((sum, video) => sum + parseInt(video.roi2_show_cnt), 0);
  const totalClicks = data.reduce((sum, video) => sum + parseInt(video.roi2_click_cnt), 0);
  const totalCost = data.reduce((sum, video) => sum + parseInt(video.mixed_real_cost), 0);
  const totalRevenue = data.reduce((sum, video) => sum + parseInt(video.onsite_roi2_shopping_value), 0);
  const totalSKU = data.reduce((sum, video) => sum + parseInt(video.onsite_roi2_shopping_sku), 0);
  
  const avgCTR = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  const avgROI = totalCost > 0 ? totalRevenue / totalCost : 0;
  const avgCVR = data.reduce((sum, video) => sum + parseFloat(video.onsite_shopping_sku_cvr), 0) / data.length;
  const avgPlay2sRate = data.reduce((sum, video) => sum + parseFloat(video.play_2s_rate), 0) / data.length;
  
  return {
    totalViews,
    totalClicks,
    totalCost,
    totalRevenue,
    totalSKU,
    avgCTR,
    avgROI,
    avgCVR,
    avgPlay2sRate,
    videoCount: data.length
  };
};

/**
 * Filter videos by delivery status
 * @param data VideoAnalyticsData[]
 * @param status Delivery status (3=Active, 4=Paused, 0=Inactive)
 * @returns Filtered video data
 */
export const filterVideosByStatus = (data: VideoAnalyticsData[], status: string): VideoAnalyticsData[] => {
  return data.filter(video => video.item_delivery_status === status);
};

/**
 * Get top performing videos by ROI
 * @param data VideoAnalyticsData[]
 * @param limit Number of top videos to return
 * @returns Top performing videos
 */
export const getTopPerformingVideos = (data: VideoAnalyticsData[], limit: number = 5): VideoAnalyticsData[] => {
  return data
    .sort((a, b) => parseFloat(b.onsite_mixed_real_roi2_shopping) - parseFloat(a.onsite_mixed_real_roi2_shopping))
    .slice(0, limit);
};

/**
 * Get videos by creator
 * @param data VideoAnalyticsData[]
 * @param creatorName Creator name to filter by
 * @returns Videos by specific creator
 */
export const getVideosByCreator = (data: VideoAnalyticsData[], creatorName: string): VideoAnalyticsData[] => {
  return data.filter(video => video.tt_account_name.includes(creatorName));
};

/**
 * Get performance distribution analysis
 * @param data VideoAnalyticsData[]
 * @returns Performance distribution data
 */
export const getPerformanceDistribution = (data: VideoAnalyticsData[]) => {
  const performanceRanges = [
    { label: 'Xuất sắc (ROI > 3)', min: 3, max: Infinity, count: 0, color: '#10B981' },
    { label: 'Tốt (ROI 2-3)', min: 2, max: 3, count: 0, color: '#3B82F6' },
    { label: 'Trung bình (ROI 1-2)', min: 1, max: 2, count: 0, color: '#F59E0B' },
    { label: 'Kém (ROI < 1)', min: 0, max: 1, count: 0, color: '#EF4444' }
  ];

  data.forEach(video => {
    // Sử dụng ROI có sẵn trong dữ liệu
    const roi = parseFloat(video.onsite_mixed_real_roi2_shopping);
    
    // Phân loại theo ROI có sẵn
    if (roi > 3) {
      performanceRanges[0].count++; // Xuất sắc
    } else if (roi >= 2) {
      performanceRanges[1].count++; // Tốt
    } else if (roi >= 1) {
      performanceRanges[2].count++; // Trung bình
    } else {
      performanceRanges[3].count++; // Kém
    }
  });

  return performanceRanges;
};

/**
 * Get engagement analysis
 * @param data VideoAnalyticsData[]
 * @returns Engagement metrics
 */
export const getEngagementAnalysis = (data: VideoAnalyticsData[]) => {
  const engagementRanges = [
    { label: 'Rất cao (CTR > 10%)', min: 10, max: Infinity, count: 0, color: '#8B5CF6' },
    { label: 'Cao (CTR 5-10%)', min: 5, max: 10, count: 0, color: '#06B6D4' },
    { label: 'Trung bình (CTR 2-5%)', min: 2, max: 5, count: 0, color: '#10B981' },
    { label: 'Thấp (CTR < 2%)', min: 0, max: 2, count: 0, color: '#F59E0B' }
  ];

  data.forEach(video => {
    const ctr = parseFloat(video.roi2_ctr);
    engagementRanges.forEach(range => {
      if (ctr >= range.min && ctr < range.max) {
        range.count++;
      }
    });
  });

  return engagementRanges;
};

/**
 * Get cost efficiency analysis
 * @param data VideoAnalyticsData[]
 * @returns Cost efficiency metrics
 */
export const getCostEfficiencyAnalysis = (data: VideoAnalyticsData[]) => {
  const costRanges = [
    { label: 'Rất hiệu quả (< 50k)', min: 0, max: 50000, count: 0, color: '#10B981' },
    { label: 'Hiệu quả (50k-100k)', min: 50000, max: 100000, count: 0, color: '#3B82F6' },
    { label: 'Trung bình (100k-200k)', min: 100000, max: 200000, count: 0, color: '#F59E0B' },
    { label: 'Kém hiệu quả (> 200k)', min: 200000, max: Infinity, count: 0, color: '#EF4444' }
  ];

  data.forEach(video => {
    const costPerSKU = parseInt(video.mixed_real_cost_per_onsite_roi2_shopping_sku) || 0;
    costRanges.forEach(range => {
      if (costPerSKU >= range.min && costPerSKU < range.max) {
        range.count++;
      }
    });
  });

  return costRanges;
};

/**
 * Get creator performance analysis
 * @param data VideoAnalyticsData[]
 * @returns Creator performance data
 */
export const getCreatorPerformanceAnalysis = (data: VideoAnalyticsData[]) => {
  const creatorMap = new Map<string, {
    name: string;
    videoCount: number;
    totalViews: number;
    totalClicks: number;
    totalCost: number;
    totalRevenue: number;
    avgROI: number;
    avgCTR: number;
    avatar: string;
  }>();

  data.forEach(video => {
    const creatorName = video.tt_account_name;
    if (!creatorMap.has(creatorName)) {
      creatorMap.set(creatorName, {
        name: creatorName,
        videoCount: 0,
        totalViews: 0,
        totalClicks: 0,
        totalCost: 0,
        totalRevenue: 0,
        avgROI: 0,
        avgCTR: 0,
        avatar: video.tt_account_avatar_icon
      });
    }

    const creator = creatorMap.get(creatorName)!;
    creator.videoCount++;
    creator.totalViews += parseInt(video.roi2_show_cnt);
    creator.totalClicks += parseInt(video.roi2_click_cnt);
    creator.totalCost += parseInt(video.mixed_real_cost);
    creator.totalRevenue += parseInt(video.onsite_roi2_shopping_value);
  });

  // Calculate averages using existing ROI data
  creatorMap.forEach(creator => {
    // Sử dụng ROI có sẵn trong dữ liệu thay vì tính toán
    const creatorVideos = data.filter(video => video.tt_account_name === creator.name);
    const roiSum = creatorVideos.reduce((sum, video) => sum + parseFloat(video.onsite_mixed_real_roi2_shopping), 0);
    creator.avgROI = creatorVideos.length > 0 ? roiSum / creatorVideos.length : 0;
    
    creator.avgCTR = creator.totalViews > 0 ? (creator.totalClicks / creator.totalViews) * 100 : 0;
  });

  return Array.from(creatorMap.values())
    .sort((a, b) => b.avgROI - a.avgROI)
    .slice(0, 10); // Top 10 creators
};

/**
 * Get time-based performance analysis
 * @param data VideoAnalyticsData[]
 * @returns Time-based performance data
 */
export const getTimeBasedAnalysis = (data: VideoAnalyticsData[]) => {
  const playRates = {
    play2s: data.map(v => parseFloat(v.play_2s_rate)),
    play6s: data.map(v => parseFloat(v.play_6s_rate)),
    play25: data.map(v => parseFloat(v.play_first_quartile_rate)),
    play50: data.map(v => parseFloat(v.play_midpoint_rate)),
    play75: data.map(v => parseFloat(v.play_third_quartile_rate)),
    play100: data.map(v => parseFloat(v.play_over_rate))
  };

  return {
    avgPlay2s: playRates.play2s.reduce((a, b) => a + b, 0) / playRates.play2s.length,
    avgPlay6s: playRates.play6s.reduce((a, b) => a + b, 0) / playRates.play6s.length,
    avgPlay25: playRates.play25.reduce((a, b) => a + b, 0) / playRates.play25.length,
    avgPlay50: playRates.play50.reduce((a, b) => a + b, 0) / playRates.play50.length,
    avgPlay75: playRates.play75.reduce((a, b) => a + b, 0) / playRates.play75.length,
    avgPlay100: playRates.play100.reduce((a, b) => a + b, 0) / playRates.play100.length,
    retentionCurve: [
      { stage: '25%', rate: playRates.play25.reduce((a, b) => a + b, 0) / playRates.play25.length },
      { stage: '50%', rate: playRates.play50.reduce((a, b) => a + b, 0) / playRates.play50.length },
      { stage: '75%', rate: playRates.play75.reduce((a, b) => a + b, 0) / playRates.play75.length },
      { stage: '100%', rate: playRates.play100.reduce((a, b) => a + b, 0) / playRates.play100.length }
    ]
  };
};

/**
 * Get correlation analysis
 * @param data VideoAnalyticsData[]
 * @returns Correlation insights
 */
export const getCorrelationAnalysis = (data: VideoAnalyticsData[]) => {
  const insights = [];
  
  // CTR vs ROI correlation
  const ctrRoiData = data.map(v => ({
    ctr: parseFloat(v.roi2_ctr),
    roi: parseFloat(v.onsite_mixed_real_roi2_shopping)
  }));
  
  const ctrRoiCorrelation = calculateCorrelation(
    ctrRoiData.map(d => d.ctr),
    ctrRoiData.map(d => d.roi)
  );
  
  insights.push({
    type: 'CTR vs ROI',
    correlation: ctrRoiCorrelation,
    insight: ctrRoiCorrelation > 0.5 ? 'CTR cao thường đi kèm ROI cao' : 
             ctrRoiCorrelation < -0.5 ? 'CTR cao có thể không đồng nghĩa ROI cao' : 
             'CTR và ROI có mối quan hệ trung bình'
  });

  // Play rate vs Conversion correlation
  const playConversionData = data.map(v => ({
    play2s: parseFloat(v.play_2s_rate),
    conversion: parseFloat(v.onsite_shopping_sku_cvr)
  }));
  
  const playConversionCorrelation = calculateCorrelation(
    playConversionData.map(d => d.play2s),
    playConversionData.map(d => d.conversion)
  );
  
  insights.push({
    type: 'Play Rate vs Conversion',
    correlation: playConversionCorrelation,
    insight: playConversionCorrelation > 0.5 ? 'Play rate cao thường dẫn đến conversion cao' : 
             'Play rate và conversion có mối quan hệ yếu'
  });

  return insights;
};

/**
 * Calculate correlation coefficient
 * @param x Array of x values
 * @param y Array of y values
 * @returns Correlation coefficient
 */
const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Get actionable insights
 * @param data VideoAnalyticsData[]
 * @returns Actionable insights
 */
export const getActionableInsights = (data: VideoAnalyticsData[]) => {
  const insights = [];
  const metrics = calculateVideoMetrics(data);
  const topCreators = getCreatorPerformanceAnalysis(data);
  const performanceDist = getPerformanceDistribution(data);
  
  // ROI insights - sử dụng ROI có sẵn trong dữ liệu
  const avgROIFromData = data.reduce((sum, video) => sum + parseFloat(video.onsite_mixed_real_roi2_shopping), 0) / data.length;
  if (avgROIFromData < 2) {
    insights.push({
      type: 'warning',
      title: 'ROI Thấp',
      message: `ROI trung bình ${avgROIFromData.toFixed(2)} thấp hơn mục tiêu. Cần tối ưu targeting và creative.`,
      action: 'Xem lại targeting và A/B test creative mới'
    });
  }
  
  // CTR insights
  if (metrics.avgCTR < 3) {
    insights.push({
      type: 'warning',
      title: 'CTR Thấp',
      message: `CTR trung bình ${metrics.avgCTR.toFixed(2)}% thấp. Cần cải thiện creative và targeting.`,
      action: 'Thử creative mới và narrow targeting'
    });
  }
  
  // Top performer insights
  if (topCreators.length > 0) {
    const topCreator = topCreators[0];
    insights.push({
      type: 'success',
      title: 'Creator Hiệu Quả Nhất',
      message: `${topCreator.name} có ROI ${topCreator.avgROI.toFixed(2)} với ${topCreator.videoCount} video.`,
      action: 'Tăng budget cho creator này và học hỏi strategy'
    });
  }
  
  // Performance distribution insights
  const excellentVideos = performanceDist.find(p => p.label.includes('Xuất sắc'))?.count || 0;
  const totalVideos = data.length;
  const excellentRatio = excellentVideos / totalVideos;
  
  if (excellentRatio < 0.2) {
    insights.push({
      type: 'info',
      title: 'Cần Cải Thiện Chất Lượng',
      message: `Chỉ ${(excellentRatio * 100).toFixed(1)}% video đạt ROI > 3. Cần tối ưu toàn bộ funnel.`,
      action: 'Phân tích video xuất sắc để học hỏi pattern'
    });
  }
  
  return insights;
};

/**
 * Format currency for display
 * @param amount Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return `₫${amount.toLocaleString('vi-VN')}`;
};

/**
 * Format percentage for display
 * @param value Percentage value
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Format number for display
 * @param num Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('vi-VN');
};

/**
 * Format date for display
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get delivery status badge info
 * @param status Delivery status code
 * @returns Badge configuration
 */
export const getDeliveryStatusInfo = (status: string) => {
  switch (status) {
    case '3':
      return { 
        label: 'Đang chạy', 
        className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
      };
    case '4':
      return { 
        label: 'Tạm dừng', 
        className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
      };
    case '0':
      return { 
        label: 'Không hoạt động', 
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' 
      };
    default:
      return { 
        label: 'Khác', 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
      };
  }
};

/**
 * Get content type badge info
 * @param type Content type
 * @returns Badge configuration
 */
export const getContentTypeInfo = (type: string) => {
  switch (type) {
    case 'video':
      return { 
        label: '🎬 Video', 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' 
      };
    case 'product_card':
      return { 
        label: '🛍️ Sản phẩm', 
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' 
      };
    default:
      return { 
        label: '❓ Khác', 
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' 
      };
  }
};

/**
 * Check if video is top 10% performer
 * @param isTopTen Top 10% indicator
 * @returns Badge configuration or null
 */
export const getTopTenPercentInfo = (isTopTen: string) => {
  return isTopTen === "1" ? {
    label: '🏆 Top 10%',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  } : null;
};
