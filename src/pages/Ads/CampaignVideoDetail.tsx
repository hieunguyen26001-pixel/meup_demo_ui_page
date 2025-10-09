import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";
import {
  getVideoData,
  calculateVideoMetrics,
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  getDeliveryStatusInfo,
  getContentTypeInfo,
  getTopTenPercentInfo,
  getPerformanceDistribution,
  getEngagementAnalysis,
  getCostEfficiencyAnalysis,
  getCreatorPerformanceAnalysis,
  getTimeBasedAnalysis,
  getCorrelationAnalysis,
  type VideoAnalyticsData,
} from "../../data/video-analytics";
import { ApexOptions } from "apexcharts";

interface CampaignInfo {
  campaign_id: string;
  campaign_name: string;
  budget_mode: number;
  shop_automation_type: number;
  opt_status: number;
}

interface AdInfo {
  name: string;
  campaign_id: string;
  ad_id: string;
  inventory_flow_type: number;
  inventory_flow: number[];
  inventory_type: null;
  external_type: number;
  schedule_type: number;
  start_time: string;
  end_time: string;
  budget_mode: number;
  budget: number;
  optimize_goal: number;
  external_action: number;
  deep_bid_type: number;
  roas_bid: number;
  product_platform_id: string;
  country: string;
  shop_id: string;
  shop_authorized_bc: string;
  promotion_flow_type: number;
  product_source: number;
  product_bid_type: number;
  product_specific_type: number;
  product_list: Array<{
    spu_id: string;
  }>;
  classify: number;
  shopping_identity_list: Array<{
    id: string;
    type: number;
    shop_id: string;
  }>;
  shopping_inventory_type: number;
  identity_list: Array<{
    tt_uid: string;
    identity_type: number;
  }>;
  product_video_selection_type: number;
  custom_anchor_videos: Array<{
    identity_info: {
      tt_uid: string;
      identity_type: number;
    };
    item_id: string;
    spu_id_list: string[];
  }>;
  shop_aca_mode: number;
  custom_anchor_video_ref_id: string;
  custom_tz_id: string;
  custom_tz_type: number;
  promotion_days_setting: {
    is_enable: boolean;
    automode_enable: boolean;
    roas_bid_multiplier: number;
    budget_multiplier: number;
    adjusted_budget: number;
    adjusted_roas_bid: number;
  };
  compensation_activity_type: number;
  enable_shop_video_exclusion_filter: boolean;
  shop_new_creative_exploration: number;
  gmv_max_flow_type: number;
}

interface CampaignData {
  campaign_info: CampaignInfo;
  ad_info: AdInfo;
}

const CampaignVideoDetail: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [sortField, setSortField] =
    useState<keyof VideoAnalyticsData>("roi2_show_cnt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedVideo, setSelectedVideo] = useState<VideoAnalyticsData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample campaign data
  const campaignData: CampaignData = {
    campaign_info: {
      campaign_id: "1844659997202449",
      campaign_name: "SPU - LF02",
      budget_mode: -1,
      shop_automation_type: 2,
      opt_status: 0,
    },
    ad_info: {
      name: "Nhóm quảng cáo_LAFIT - Số 1 Gen Nịt Bụng_2025-09-30 10:52:52",
      campaign_id: "1844659997202449",
      ad_id: "1844659998997505",
      inventory_flow_type: 0,
      inventory_flow: [3000, 9000],
      inventory_type: null,
      external_type: 0,
      schedule_type: 1,
      start_time: "2025-09-30 10:52:52",
      end_time: "2035-09-28 10:52:52",
      budget_mode: 0,
      budget: 6000000,
      optimize_goal: 111,
      external_action: 0,
      deep_bid_type: 108,
      roas_bid: 7,
      product_platform_id: "0",
      country: "VN",
      shop_id: "7496239622529452872",
      shop_authorized_bc: "7517876527762194448",
      promotion_flow_type: 5,
      product_source: 2,
      product_bid_type: 0,
      product_specific_type: 3,
      product_list: [{ spu_id: "1732709075069798216" }],
      classify: 1,
      shopping_identity_list: [
        { id: "7520479232318587921", type: 8, shop_id: "7496239622529452872" },
        { id: "7547547263926387732", type: 8, shop_id: "7496239622529452872" },
        { id: "7517602005595194384", type: 8, shop_id: "7496239622529452872" },
      ],
      shopping_inventory_type: 1,
      identity_list: [
        { tt_uid: "7520479232318587921", identity_type: 8 },
        { tt_uid: "7547547263926387732", identity_type: 8 },
        { tt_uid: "7517602005595194384", identity_type: 8 },
      ],
      product_video_selection_type: 1,
      custom_anchor_videos: [
        {
          identity_info: { tt_uid: "7547547263926387732", identity_type: 8 },
          item_id: "7555330768629730567",
          spu_id_list: ["1732709075069798216"],
        },
      ],
      shop_aca_mode: 1,
      custom_anchor_video_ref_id: "7558460810373120017",
      custom_tz_id: "7473426712694849544",
      custom_tz_type: 2,
      promotion_days_setting: {
        is_enable: true,
        automode_enable: true,
        roas_bid_multiplier: 90,
        budget_multiplier: 150,
        adjusted_budget: 9000000,
        adjusted_roas_bid: 6.3,
      },
      compensation_activity_type: 3,
      enable_shop_video_exclusion_filter: false,
      shop_new_creative_exploration: 2,
      gmv_max_flow_type: 0,
    },
  };

  // Get video data from JSON file
  const videoData = getVideoData();

  // Calculate analytics data once
  const performanceDistribution = getPerformanceDistribution(videoData);
  const engagementAnalysis = getEngagementAnalysis(videoData);
  const costEfficiencyAnalysis = getCostEfficiencyAnalysis(videoData);
  const creatorPerformance = getCreatorPerformanceAnalysis(videoData);
  const timeBasedAnalysis = getTimeBasedAnalysis(videoData);

  const handleSort = (field: keyof VideoAnalyticsData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleOpenVideoModal = (video: VideoAnalyticsData) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const sortedData = [...videoData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  // Pagination calculations
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Calculate summary metrics using data manager
  const metrics = calculateVideoMetrics(videoData);

  return (
    <>
      <PageMeta title={`Chi tiết Video - Chiến dịch ${campaignId} - meup`} />

      <div className="mx-auto max-w-screen-2xl p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/meup/gmv-max-product")}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Chi tiết Video - Chiến dịch {campaignId}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Phân tích hiệu suất các video quảng cáo trong chiến dịch
          </p>
        </div>

        {/* Campaign Information */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            📋 Thông Tin Chiến Dịch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Campaign Basic Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Thông Tin Cơ Bản
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Tên chiến dịch:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {campaignData.campaign_info.campaign_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ID chiến dịch:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {campaignData.campaign_info.campaign_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Tên nhóm quảng cáo:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {campaignData.ad_info.name.substring(0, 30)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ID nhóm quảng cáo:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {campaignData.ad_info.ad_id}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget & Bidding */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Ngân Sách & Đặt Giá
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Ngân sách:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(campaignData.ad_info.budget)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ROAS bid:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {campaignData.ad_info.roas_bid}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Ngân sách điều chỉnh:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatCurrency(
                      campaignData.ad_info.promotion_days_setting
                        .adjusted_budget
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ROAS điều chỉnh:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {
                      campaignData.ad_info.promotion_days_setting
                        .adjusted_roas_bid
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule & Settings */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Lịch Trình & Cài Đặt
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Thời gian bắt đầu:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(campaignData.ad_info.start_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Thời gian kết thúc:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(campaignData.ad_info.end_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Quốc gia:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {campaignData.ad_info.country}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Shop ID:
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {campaignData.ad_info.shop_id.substring(0, 10)}...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Promotion Settings */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
              Cài Đặt Khuyến Mãi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Kích hoạt khuyến mãi
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {campaignData.ad_info.promotion_days_setting.is_enable
                    ? "✅ Có"
                    : "❌ Không"}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Tự động
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {campaignData.ad_info.promotion_days_setting.automode_enable
                    ? "✅ Có"
                    : "❌ Không"}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Hệ số ROAS
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {
                    campaignData.ad_info.promotion_days_setting
                      .roas_bid_multiplier
                  }
                  %
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Hệ số ngân sách
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {
                    campaignData.ad_info.promotion_days_setting
                      .budget_multiplier
                  }
                  %
                </div>
              </div>
            </div>
          </div>

          {/* Video Count */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Số Lượng Video
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Tổng số video trong chiến dịch này
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {campaignData.ad_info.custom_anchor_videos.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  video
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Cost Per Acquisition */}
          <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-4 dark:border-orange-800 dark:from-orange-900/20 dark:to-orange-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Chi Phí Mỗi Đơn Hàng
                </p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {formatCurrency(
                    Math.round(metrics.totalCost / metrics.totalSKU)
                  )}
                </p>
                <p className="text-xs text-orange-500 dark:text-orange-300 mt-1">
                  {formatNumber(metrics.totalSKU)} đơn hàng • Mục tiêu: ₫50k
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 text-xl">
                  💰
                </span>
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-emerald-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Tỷ Lệ Chuyển Đổi
                </p>
                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {(metrics.avgCVR * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-emerald-500 dark:text-emerald-300 mt-1">
                  {formatNumber(metrics.totalClicks)} clicks →{" "}
                  {formatNumber(metrics.totalSKU)} đơn hàng
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 text-xl">
                  🎯
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Per View */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Doanh Thu Mỗi Lượt Xem
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  ₫
                  {formatNumber(
                    Math.round(metrics.totalRevenue / metrics.totalViews)
                  )}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  {formatNumber(metrics.totalViews)} lượt xem •{" "}
                  {formatCurrency(metrics.totalRevenue)} tổng doanh thu
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">
                  💎
                </span>
              </div>
            </div>
          </div>

          {/* Profit Margin */}
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 p-4 dark:border-purple-800 dark:from-purple-900/20 dark:to-purple-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Lợi Nhuận Ròng
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(metrics.totalRevenue - metrics.totalCost)}
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-300 mt-1">
                  ROI: {metrics.avgROI.toFixed(1)}x • Margin:{" "}
                  {(
                    ((metrics.totalRevenue - metrics.totalCost) /
                      metrics.totalRevenue) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl dark:from-purple-900/20 dark:to-violet-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">
                  💵
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Tổng Doanh Thu
              </h3>
            </div>
            <Chart
              options={{
                colors: ["#3B82F6"],
                chart: {
                  fontFamily: "Outfit, sans-serif",
                  type: "bar",
                  height: 220,
                  toolbar: { show: false },
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "70%",
                    borderRadius: 4,
                    borderRadiusApplication: "end",
                  },
                },
                dataLabels: { enabled: false },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ["transparent"],
                },
                xaxis: {
                  categories: [
                    "01/09",
                    "02/09",
                    "03/09",
                    "04/09",
                    "05/09",
                    "06/09",
                    "07/09",
                    "08/09",
                    "09/09",
                    "10/09",
                    "11/09",
                    "12/09",
                    "13/09",
                    "14/09",
                    "15/09",
                    "16/09",
                    "17/09",
                    "18/09",
                    "19/09",
                    "20/09",
                    "21/09",
                    "22/09",
                    "23/09",
                    "24/09",
                    "25/09",
                    "26/09",
                    "27/09",
                    "28/09",
                    "29/09",
                    "30/09",
                  ],
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  labels: {
                    style: { fontSize: "10px", colors: ["#6B7280"] },
                    rotate: -45,
                  },
                },
                legend: {
                  show: true,
                  position: "top",
                  horizontalAlign: "left",
                  fontFamily: "Outfit",
                  fontSize: "12px",
                },
                yaxis: {
                  title: { text: undefined },
                  labels: {
                    style: { fontSize: "10px", colors: ["#6B7280"] },
                    formatter: (val: number) =>
                      `₫${(val / 1000000).toFixed(0)}M`,
                  },
                },
                grid: {
                  yaxis: { lines: { show: true } },
                  xaxis: { lines: { show: false } },
                },
                fill: { opacity: 1 },
                tooltip: {
                  x: { show: false },
                  y: { formatter: (val: number) => `₫${val.toLocaleString()}` },
                },
              }}
              series={[
                {
                  name: "Tổng Doanh Thu",
                  data: [
                    45000000, 52000000, 48000000, 61000000, 55000000, 67000000,
                    72000000, 68000000, 95000000, 88000000, 75000000, 82000000,
                    78000000, 85000000, 90000000, 87000000, 92000000, 88000000,
                    85000000, 79000000, 76000000, 82000000, 78000000, 85000000,
                    88000000, 92000000, 89000000, 95000000, 87000000, 82000000,
                  ],
                },
              ]}
              type="bar"
              height={220}
            />
          </div>

          {/* Cost Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Tổng Chi Phí
              </h3>
            </div>
            <Chart
              options={{
                colors: ["#3B82F6"],
                chart: {
                  fontFamily: "Outfit, sans-serif",
                  type: "bar",
                  height: 220,
                  toolbar: { show: false },
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "70%",
                    borderRadius: 4,
                    borderRadiusApplication: "end",
                  },
                },
                dataLabels: { enabled: false },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ["transparent"],
                },
                xaxis: {
                  categories: [
                    "01/09",
                    "02/09",
                    "03/09",
                    "04/09",
                    "05/09",
                    "06/09",
                    "07/09",
                    "08/09",
                    "09/09",
                    "10/09",
                    "11/09",
                    "12/09",
                    "13/09",
                    "14/09",
                    "15/09",
                    "16/09",
                    "17/09",
                    "18/09",
                    "19/09",
                    "20/09",
                    "21/09",
                    "22/09",
                    "23/09",
                    "24/09",
                    "25/09",
                    "26/09",
                    "27/09",
                    "28/09",
                    "29/09",
                    "30/09",
                  ],
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  labels: {
                    style: { fontSize: "10px", colors: ["#6B7280"] },
                    rotate: -45,
                  },
                },
                legend: {
                  show: true,
                  position: "top",
                  horizontalAlign: "left",
                  fontFamily: "Outfit",
                  fontSize: "12px",
                },
                yaxis: {
                  title: { text: undefined },
                  labels: {
                    style: { fontSize: "10px", colors: ["#6B7280"] },
                    formatter: (val: number) =>
                      `₫${(val / 1000000).toFixed(0)}M`,
                  },
                },
                grid: {
                  yaxis: { lines: { show: true } },
                  xaxis: { lines: { show: false } },
                },
                fill: { opacity: 1 },
                tooltip: {
                  x: { show: false },
                  y: { formatter: (val: number) => `₫${val.toLocaleString()}` },
                },
              }}
              series={[
                {
                  name: "Tổng CP GMV",
                  data: [
                    8000000, 9200000, 8500000, 10800000, 9800000, 12000000,
                    12800000, 11500000, 16000000, 14500000, 12500000, 13500000,
                    13000000, 14000000, 15000000, 14500000, 15500000, 14800000,
                    14200000, 13500000, 12800000, 13500000, 13000000, 14000000,
                    14500000, 15000000, 14800000, 15500000, 14500000, 13800000,
                  ],
                },
              ]}
              type="bar"
              height={220}
            />
          </div>

          {/* ROI Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                ROI
              </h3>
            </div>
            <Chart
              options={{
                colors: ["#3B82F6"],
                chart: {
                  fontFamily: "Outfit, sans-serif",
                  height: 220,
                  type: "area",
                  toolbar: { show: false },
                },
                stroke: {
                  curve: "smooth",
                  width: 2,
                },
                fill: {
                  type: "gradient",
                  gradient: {
                    opacityFrom: 0.3,
                    opacityTo: 0.1,
                  },
                },
                markers: {
                  size: 0,
                  strokeColors: "#fff",
                  strokeWidth: 2,
                  hover: { size: 4 },
                },
                grid: {
                  yaxis: { lines: { show: true } },
                  xaxis: { lines: { show: false } },
                },
                xaxis: {
                  categories: [
                    "01/09",
                    "02/09",
                    "03/09",
                    "04/09",
                    "05/09",
                    "06/09",
                    "07/09",
                    "08/09",
                    "09/09",
                    "10/09",
                    "11/09",
                    "12/09",
                    "13/09",
                    "14/09",
                    "15/09",
                    "16/09",
                    "17/09",
                    "18/09",
                    "19/09",
                    "20/09",
                    "21/09",
                    "22/09",
                    "23/09",
                    "24/09",
                    "25/09",
                    "26/09",
                    "27/09",
                    "28/09",
                    "29/09",
                    "30/09",
                  ],
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  labels: {
                    style: { fontSize: "10px", colors: ["#6B7280"] },
                    rotate: -45,
                  },
                },
                legend: {
                  show: true,
                  position: "top",
                  horizontalAlign: "left",
                  fontFamily: "Outfit",
                  fontSize: "12px",
                },
                yaxis: {
                  title: { text: undefined },
                  labels: {
                    style: { fontSize: "10px", colors: ["#6B7280"] },
                    formatter: (val: number) => val.toFixed(1),
                  },
                },
                tooltip: {
                  x: { show: false },
                  y: { formatter: (val: number) => val.toFixed(2) },
                },
              }}
              series={[
                {
                  name: "ROI",
                  data: [
                    4.62, 5.32, 5.41, 5.63, 5.77, 5.01, 5.47, 5.52, 5.44, 5.34,
                    5.47, 5.6, 5.53, 5.64, 5.74, 5.68, 5.72, 5.65, 5.7, 5.58,
                    5.63, 5.67, 5.61, 5.66, 5.69, 5.73, 5.71, 5.75, 5.68, 5.64,
                  ],
                },
              ]}
              type="area"
              height={220}
            />
          </div>

          {/* CPA Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                CPA
              </h3>
            </div>
            <Chart
              options={{
                colors: ["#3B82F6"],
                chart: {
                  fontFamily: "Outfit, sans-serif",
                  type: "bar",
                  height: 220,
                  toolbar: { show: false },
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "70%",
                    borderRadius: 4,
                    borderRadiusApplication: "end",
                  },
                },
                dataLabels: { enabled: false },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ["transparent"],
                },
                xaxis: {
                  categories: [
                    "01/09",
                    "02/09",
                    "03/09",
                    "04/09",
                    "05/09",
                    "06/09",
                    "07/09",
                    "08/09",
                    "09/09",
                    "10/09",
                    "11/09",
                    "12/09",
                    "13/09",
                    "14/09",
                    "15/09",
                    "16/09",
                    "17/09",
                    "18/09",
                    "19/09",
                    "20/09",
                    "21/09",
                    "22/09",
                    "23/09",
                    "24/09",
                    "25/09",
                    "26/09",
                    "27/09",
                    "28/09",
                    "29/09",
                    "30/09",
                  ],
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  labels: {
                    style: { fontSize: "10px", colors: ["#6B7280"] },
                    rotate: -45,
                  },
                },
                legend: {
                  show: true,
                  position: "top",
                  horizontalAlign: "left",
                  fontFamily: "Outfit",
                  fontSize: "12px",
                },
                yaxis: {
                  title: { text: undefined },
                  labels: {
                    style: { fontSize: "10px", colors: ["#6B7280"] },
                    formatter: (val: number) => `₫${(val / 1000).toFixed(0)}K`,
                  },
                },
                grid: {
                  yaxis: { lines: { show: true } },
                  xaxis: { lines: { show: false } },
                },
                fill: { opacity: 1 },
                tooltip: {
                  x: { show: false },
                  y: { formatter: (val: number) => `₫${val.toLocaleString()}` },
                },
              }}
              series={[
                {
                  name: "CP/đơn hàng GMV",
                  data: [
                    18000, 17500, 17800, 18200, 18500, 19000, 18800, 19200,
                    19500, 19800, 20000, 19500, 19800, 20200, 20500, 20800,
                    21000, 20500, 20800, 21200, 21500, 21000, 21300, 21800,
                    22000, 22500, 22200, 22800, 22500, 22000,
                  ],
                },
              ]}
              type="bar"
              height={220}
            />
          </div>
        </div>

        {/* Advanced Analytics Charts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
            📊 Phân Tích Chuyên Sâu
          </h2>

          {/* Performance Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Phân Bổ Hiệu Suất ROI
              </h3>
              <Chart
                options={{
                  chart: { type: "donut" },
                  labels: performanceDistribution.map((p) => p.label),
                  colors: performanceDistribution.map((p) => p.color),
                  legend: { position: "bottom" },
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => `${val.toFixed(1)}%`,
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: "70%",
                        labels: {
                          show: true,
                          total: {
                            show: true,
                            label: "Tổng Video",
                            formatter: () => videoData.length.toString(),
                          },
                        },
                      },
                    },
                  },
                }}
                series={performanceDistribution.map((p) => p.count)}
                type="donut"
                height={300}
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Phân Tích Engagement CTR
              </h3>
              <Chart
                options={{
                  chart: { type: "bar" },
                  xaxis: { categories: engagementAnalysis.map((e) => e.label) },
                  colors: engagementAnalysis.map((e) => e.color),
                  dataLabels: { enabled: true },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      borderRadius: 4,
                    },
                  },
                  title: {
                    text: "Phân bổ video theo mức CTR",
                    style: { fontSize: "14px" },
                  },
                }}
                series={[
                  {
                    name: "Số lượng video",
                    data: engagementAnalysis.map((e) => e.count),
                  },
                ]}
                type="bar"
                height={300}
              />
            </div>
          </div>

          {/* Creator Performance & Cost Efficiency */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Top Creator Hiệu Quả
              </h3>
              <Chart
                options={{
                  chart: { type: "bar" },
                  xaxis: {
                    categories: creatorPerformance
                      .slice(0, 5)
                      .map((c) => c.name.substring(0, 15) + "..."),
                    labels: { rotate: -45 },
                  },
                  colors: ["#3B82F6"],
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => `${val.toFixed(2)}x`,
                  },
                  plotOptions: {
                    bar: {
                      borderRadius: 4,
                    },
                  },
                  title: {
                    text: "ROI trung bình theo creator",
                    style: { fontSize: "14px" },
                  },
                }}
                series={[
                  {
                    name: "ROI",
                    data: creatorPerformance.slice(0, 5).map((c) => c.avgROI),
                  },
                ]}
                type="bar"
                height={300}
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Hiệu Quả Chi Phí
              </h3>
              <Chart
                options={{
                  chart: { type: "donut" },
                  labels: costEfficiencyAnalysis.map((c) => c.label),
                  colors: costEfficiencyAnalysis.map((c) => c.color),
                  legend: { position: "bottom" },
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => `${val.toFixed(1)}%`,
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: "70%",
                        labels: {
                          show: true,
                          total: {
                            show: true,
                            label: "Tổng Video",
                            formatter: () => videoData.length.toString(),
                          },
                        },
                      },
                    },
                  },
                }}
                series={costEfficiencyAnalysis.map((c) => c.count)}
                type="donut"
                height={300}
              />
            </div>
          </div>

          {/* Video Retention Curve */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Đường Cong Retention Video
            </h3>
            <Chart
              options={{
                chart: { type: "line" },
                xaxis: {
                  categories: timeBasedAnalysis.retentionCurve.map(
                    (r) => r.stage
                  ),
                },
                colors: ["#8B5CF6"],
                dataLabels: {
                  enabled: true,
                  formatter: (val) => `${val.toFixed(1)}%`,
                },
                stroke: { curve: "smooth", width: 3 },
                markers: { size: 6 },
                title: {
                  text: "Tỷ lệ người xem từ 25% đến 100% video",
                  style: { fontSize: "14px" },
                },
                yaxis: {
                  title: { text: "Tỷ lệ (%)" },
                  min: 0,
                  max: 100,
                },
              }}
              series={[
                {
                  name: "Retention Rate",
                  data: timeBasedAnalysis.retentionCurve.map((r) => r.rate),
                },
              ]}
              type="line"
              height={300}
            />
          </div>
        </div>

        {/* Video Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Danh Sách Video ({totalItems} mục)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleSort("material_name")}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Tên Video
                        {sortField === "material_name" && (
                          <span className="text-blue-500">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleSort("shop_content_type")}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Loại
                        {sortField === "shop_content_type" && (
                          <span className="text-blue-500">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleSort("roi2_show_cnt")}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Hiển thị
                        {sortField === "roi2_show_cnt" && (
                          <span className="text-blue-500">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleSort("roi2_click_cnt")}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Click
                        {sortField === "roi2_click_cnt" && (
                          <span className="text-blue-500">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleSort("roi2_ctr")}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        CTR
                        {sortField === "roi2_ctr" && (
                          <span className="text-blue-500">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleSort("mixed_real_cost")}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Chi phí
                        {sortField === "mixed_real_cost" && (
                          <span className="text-blue-500">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleSort("onsite_mixed_real_roi2_shopping")
                        }
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        ROI
                        {sortField === "onsite_mixed_real_roi2_shopping" && (
                          <span className="text-blue-500">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleSort("item_delivery_status")}
                        className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Trạng thái
                        {sortField === "item_delivery_status" && (
                          <span className="text-blue-500">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((video, index) => (
                    <tr
                      key={video.item_id}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={video.material_video_info_poster_url}
                            alt={video.material_name}
                            className="w-12 h-8 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {video.material_name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {video.item_id}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {video.tt_account_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              getContentTypeInfo(video.shop_content_type)
                                .className
                            }`}
                          >
                            {getContentTypeInfo(video.shop_content_type).label}
                          </span>
                          {getTopTenPercentInfo(
                            video.is_gmv_top_ten_percent
                          ) && (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                getTopTenPercentInfo(
                                  video.is_gmv_top_ten_percent
                                )!.className
                              }`}
                            >
                              {
                                getTopTenPercentInfo(
                                  video.is_gmv_top_ten_percent
                                )!.label
                              }
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900 dark:text-white">
                          {formatNumber(parseInt(video.roi2_show_cnt))}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900 dark:text-white">
                          {formatNumber(parseInt(video.roi2_click_cnt))}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            parseFloat(video.roi2_ctr) >= 7.0
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : parseFloat(video.roi2_ctr) >= 5.0
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {parseFloat(video.roi2_ctr).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900 dark:text-white">
                          {formatCurrency(parseInt(video.mixed_real_cost))}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            parseFloat(video.onsite_mixed_real_roi2_shopping) >=
                            2.5
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : parseFloat(
                                  video.onsite_mixed_real_roi2_shopping
                                ) >= 2.0
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {parseFloat(
                            video.onsite_mixed_real_roi2_shopping
                          ).toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getDeliveryStatusInfo(video.item_delivery_status)
                              .className
                          }`}
                        >
                          {
                            getDeliveryStatusInfo(video.item_delivery_status)
                              .label
                          }
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleOpenVideoModal(video)}
                          className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                        >
                          🎬 Xem Video
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Hiển thị:
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    mục
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Hiển thị {startIndex + 1} đến {Math.min(endIndex, totalItems)}{" "}
                  trong tổng số {totalItems} mục
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  Đầu
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  Trước
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded ${
                          currentPage === pageNum
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  Sau
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  Cuối
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={handleCloseModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={selectedVideo.material_video_info_play_url}
                controls
                className="w-full h-full"
                poster={selectedVideo.material_video_info_poster_url}
                autoPlay
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignVideoDetail;
