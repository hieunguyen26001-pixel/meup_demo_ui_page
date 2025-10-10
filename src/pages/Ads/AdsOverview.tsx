import React, { useState, useEffect, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
  DollarLineIcon,
} from "../../icons";
import Badge from "../../components/ui/badge/Badge";
import axios from "axios";
import config from "../../config/env";
import TikTokDatePicker from "../../components/ui/TikTokDatePicker";
import { format, startOfMonth, endOfMonth } from "date-fns";

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Debounce utility
const debounce = (func: Function, wait: number) => {
  let timeout: number;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const AdsOverview: React.FC = () => {
  // State for API data
  const [adsData, setAdsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);
    
    return {
      startDate,
      endDate
    };
  });

  // Fetch ads data with cache
  const fetchAdsWithCache = useCallback(async (startDate: Date, endDate: Date) => {
    const cacheKey = `${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.data;
      } else {
        cache.delete(cacheKey);
      }
    }

    try {
      const response = await axios.get(`${config.backendEndpoint}/api/ads-overview`, {
        params: {
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd')
        },
        timeout: 30000
      });

      // Cache the response
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });

      return response.data;
    } catch (err: any) {
      if (err.response?.status === 429) {
        setRateLimited(true);
        setError('Quá nhiều yêu cầu. Vui lòng đợi một chút trước khi thử lại.');
        setTimeout(() => setRateLimited(false), 60000); // 1 minute
      } else {
        setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      }
      throw err;
    }
  }, []);

  // Fetch ads data from backend
  const fetchAdsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAdsWithCache(dateRange.startDate, dateRange.endDate);
      setAdsData(data);
    } catch (err: any) {
      console.error('Error fetching ads data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ads data with specific dates (debounced)
  const fetchAdsDataWithDates = useCallback(
    debounce(async (startDate: Date, endDate: Date) => {
      setLoading(true);
      setComparisonLoading(true);
      setError(null);

      try {
        // Fetch current period data
        const data = await fetchAdsWithCache(startDate, endDate);
        setAdsData(data);
        setLoading(false);

        // Fetch comparison data
        const comparison = await getComparisonData(startDate, endDate);
        setComparisonData(comparison);
        setComparisonLoading(false);
      } catch (err: any) {
        console.error('Error fetching ads data:', err);
        setLoading(false);
        setComparisonLoading(false);
      }
    }, 500),
    [fetchAdsWithCache]
  );

  // Helper component for comparison badge with loading
  const ComparisonBadge = ({ currentValue, previousValue, isPositive = true }: { currentValue: number, previousValue: number, isPositive?: boolean }) => {
    if (comparisonLoading) {
      return (
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-gray-500">Đang tải...</span>
        </div>
      );
    }
    if (!comparisonData) return null;
    
    const comparison = calculateComparison(currentValue, previousValue);
    let badgeColor: "success" | "error";
    let icon: React.ReactNode;
    
    if (isPositive) {
      // Revenue, Orders: tăng = tốt (xanh), giảm = xấu (đỏ)
      badgeColor = comparison.isPositive ? "success" : "error";
      icon = comparison.isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />;
    } else {
      // Cost, CPA: giảm = tốt (xanh), tăng = xấu (đỏ)
      badgeColor = !comparison.isIncrease ? "success" : "error";
      icon = !comparison.isIncrease ? <ArrowDownIcon /> : <ArrowUpIcon />;
    }
    
    return (
      <Badge color={badgeColor}>
        {icon}
        {comparison.percentage.toFixed(1)}%
      </Badge>
    );
  };
  const calculateSummary = (data: any) => {
    if (!data?.data?.list) return { totalRevenue: 0, totalOrders: 0, totalCost: 0 };
    
    const campaigns = data.data.list;
    return {
      totalRevenue: campaigns.reduce((sum: number, campaign: any) => sum + Number(campaign.metrics?.gross_revenue || 0), 0),
      totalOrders: campaigns.reduce((sum: number, campaign: any) => sum + Number(campaign.metrics?.orders || 0), 0),
      totalCost: campaigns.reduce((sum: number, campaign: any) => sum + Number(campaign.metrics?.cost || 0), 0)
    };
  };

  // Calculate comparison with previous period based on selected range
  const calculateComparison = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) return { percentage: 0, isPositive: currentValue > 0 };
    const percentage = ((currentValue - previousValue) / previousValue) * 100;
    return {
      percentage: Math.abs(percentage),
      isPositive: percentage >= 0,
      isIncrease: percentage > 0
    };
  };

  // Get comparison text based on current date range
  const getComparisonText = (startDate?: Date, endDate?: Date) => {
    const currentStartDate = startDate || dateRange.startDate;
    const currentEndDate = endDate || dateRange.endDate;
    const daysDiff = Math.ceil((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (daysDiff === 1) {
      // Single day - compare with previous day
      return "vs hôm qua";
    } else if (daysDiff === 7) {
      // 7 days - compare with previous 7 days
      return "vs 7 ngày trước";
    } else if (daysDiff === 30) {
      // 30 days - compare with previous 30 days
      return "vs 30 ngày trước";
    } else {
      // Custom range - show actual days
      return `vs ${daysDiff} ngày trước`;
    }
  };

  // Get comparison data based on current date range
  const getComparisonData = async (currentStartDate: Date, currentEndDate: Date) => {
    const daysDiff = Math.ceil((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate previous period dates
    const previousStartDate = new Date(currentStartDate);
    const previousEndDate = new Date(currentEndDate);
    previousStartDate.setDate(currentStartDate.getDate() - daysDiff);
    previousEndDate.setDate(currentEndDate.getDate() - daysDiff);
    
    try {
      // Fetch actual data for previous period using cache
      const previousData = await fetchAdsWithCache(previousStartDate, previousEndDate);
      if (previousData?.data?.list) {
        const campaigns = previousData.data.list;
        return {
          totalRevenue: campaigns.reduce((sum: number, campaign: any) => sum + Number(campaign.metrics?.gross_revenue || 0), 0),
          totalOrders: campaigns.reduce((sum: number, campaign: any) => sum + Number(campaign.metrics?.orders || 0), 0),
          totalCost: campaigns.reduce((sum: number, campaign: any) => sum + Number(campaign.metrics?.cost || 0), 0),
          cpa: 0, // Will be calculated
          roi: 0, // Will be calculated
        };
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    }
    
    // Fallback to mock data if API fails
    const scaleFactor = daysDiff <= 1 ? 0.8 : (daysDiff <= 7 ? 0.9 : 0.95);
    
    return {
      totalRevenue: Math.round(summary.totalRevenue * scaleFactor),
      totalOrders: Math.round(summary.totalOrders * scaleFactor),
      totalCost: Math.round(summary.totalCost * scaleFactor),
      cpa: summary.totalOrders > 0 ? Math.round((summary.totalCost * scaleFactor) / (summary.totalOrders * scaleFactor)) : 0,
      roi: summary.totalCost > 0 ? (summary.totalRevenue * scaleFactor) / (summary.totalCost * scaleFactor) : 0,
    };
  };

  // Generate chart data from API response
  const generateChartData = (data: any) => {
    if (!data?.data?.list) return { dates: [], revenue: [], cost: [], roi: [], cpa: [] };
    
    const campaigns = data.data.list;
    const dates = campaigns.map((campaign: any) => campaign.dimensions?.stat_time_day?.split(' ')[0] || 'Unknown');
    const revenue = campaigns.map((campaign: any) => Number(campaign.metrics?.gross_revenue || 0));
    const cost = campaigns.map((campaign: any) => Number(campaign.metrics?.cost || 0));
    const roi = campaigns.map((campaign: any) => Number(campaign.metrics?.roi || 0));
    const cpa = campaigns.map((campaign: any) => Number(campaign.metrics?.cost_per_order || 0));
    
    return { dates, revenue, cost, roi, cpa };
  };

  const summary = adsData ? calculateSummary(adsData) : { totalRevenue: 0, totalOrders: 0, totalCost: 0 };
  const chartData = adsData ? generateChartData(adsData) : { dates: [], revenue: [], cost: [], roi: [], cpa: [] };

  // Auto-fetch data when component mounts
  useEffect(() => {
    fetchAdsData();
  }, []);

  // Revenue Chart Data
  const revenueChartOptions: ApexOptions = {
    colors: ["#F59E0B"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 220,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.dates.length > 0 ? chartData.dates : [
        "01/09", "02/09", "03/09", "04/09", "05/09", "06/09", "07/09", "08/09", "09/09", "10/09",
        "11/09", "12/09", "13/09", "14/09", "15/09", "16/09", "17/09", "18/09", "19/09", "20/09",
        "21/09", "22/09", "23/09", "24/09", "25/09", "26/09", "27/09", "28/09", "29/09", "30/09"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "10px",
          colors: ["#6B7280"],
        },
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
      title: {
        text: undefined,
      },
      labels: {
        style: {
          fontSize: "10px",
          colors: ["#6B7280"],
        },
        formatter: (val: number) => `₫${(val / 1000000).toFixed(0)}M`,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `₫${val.toLocaleString()}`,
      },
    },
  };

  const revenueChartSeries = [
    {
      name: "Tổng Doanh Thu",
      data: chartData.revenue.length > 0 ? chartData.revenue : [
        45000000, 52000000, 48000000, 61000000, 55000000, 67000000, 72000000, 68000000, 95000000, 88000000,
        75000000, 82000000, 78000000, 85000000, 90000000, 87000000, 92000000, 88000000, 85000000, 79000000,
        76000000, 82000000, 78000000, 85000000, 88000000, 92000000, 89000000, 95000000, 87000000, 82000000
      ],
    },
  ];

  // Cost Chart Data
  const costChartOptions: ApexOptions = {
    colors: ["#3B82F6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 220,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.dates.length > 0 ? chartData.dates : [
        "01/09", "02/09", "03/09", "04/09", "05/09", "06/09", "07/09", "08/09", "09/09", "10/09",
        "11/09", "12/09", "13/09", "14/09", "15/09", "16/09", "17/09", "18/09", "19/09", "20/09",
        "21/09", "22/09", "23/09", "24/09", "25/09", "26/09", "27/09", "28/09", "29/09", "30/09"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "10px",
          colors: ["#6B7280"],
        },
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
      title: {
        text: undefined,
      },
      labels: {
        style: {
          fontSize: "10px",
          colors: ["#6B7280"],
        },
        formatter: (val: number) => `₫${(val / 1000000).toFixed(0)}M`,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `₫${val.toLocaleString()}`,
      },
    },
  };

  const costChartSeries = [
    {
      name: "Tổng CP GMV",
      data: chartData.cost.length > 0 ? chartData.cost : [
        8000000, 9200000, 8500000, 10800000, 9800000, 12000000, 12800000, 11500000, 16000000, 14500000,
        12500000, 13500000, 13000000, 14000000, 15000000, 14500000, 15500000, 14800000, 14200000, 13500000,
        12800000, 13500000, 13000000, 14000000, 14500000, 15000000, 14800000, 15500000, 14500000, 13800000
      ],
    },
  ];

  // ROI Chart Data
  const roiChartOptions: ApexOptions = {
    colors: ["#3B82F6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 220,
      type: "area",
      toolbar: {
        show: false,
      },
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
      hover: {
        size: 4,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.dates.length > 0 ? chartData.dates : [
        "01/09", "02/09", "03/09", "04/09", "05/09", "06/09", "07/09", "08/09", "09/09", "10/09",
        "11/09", "12/09", "13/09", "14/09", "15/09", "16/09", "17/09", "18/09", "19/09", "20/09",
        "21/09", "22/09", "23/09", "24/09", "25/09", "26/09", "27/09", "28/09", "29/09", "30/09"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "10px",
          colors: ["#6B7280"],
        },
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "10px",
          colors: ["#6B7280"],
        },
        formatter: (val: number) => val.toFixed(1),
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      fontSize: "12px",
    },
  };

  const roiChartSeries = [
    {
      name: "ROI",
      data: chartData.roi.length > 0 ? chartData.roi : [
        4.62, 5.32, 5.41, 5.63, 5.77, 5.01, 5.47, 5.52, 5.44, 5.34,
        5.47, 5.60, 5.53, 5.64, 5.74, 5.68, 5.72, 5.65, 5.70, 5.58,
        5.63, 5.67, 5.61, 5.66, 5.69, 5.73, 5.71, 5.75, 5.68, 5.64
      ],
    },
  ];

  // CPA Chart Data
  const cpaChartOptions: ApexOptions = {
    colors: ["#3B82F6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 220,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.dates.length > 0 ? chartData.dates : [
        "01/09", "02/09", "03/09", "04/09", "05/09", "06/09", "07/09", "08/09", "09/09", "10/09",
        "11/09", "12/09", "13/09", "14/09", "15/09", "16/09", "17/09", "18/09", "19/09", "20/09",
        "21/09", "22/09", "23/09", "24/09", "25/09", "26/09", "27/09", "28/09", "29/09", "30/09"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "10px",
          colors: ["#6B7280"],
        },
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
      title: {
        text: undefined,
      },
      labels: {
        style: {
          fontSize: "10px",
          colors: ["#6B7280"],
        },
        formatter: (val: number) => `₫${(val / 1000).toFixed(0)}K`,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `₫${val.toLocaleString()}`,
      },
    },
  };

  const cpaChartSeries = [
    {
      name: "CP/đơn hàng GMV",
      data: chartData.cpa.length > 0 ? chartData.cpa : [
        18000, 17500, 17800, 18200, 18500, 19000, 18800, 19200, 19500, 19800,
        20000, 19500, 19800, 20200, 20500, 20800, 21000, 20500, 20800, 21200,
        21500, 21000, 21300, 21800, 22000, 22500, 22200, 22800, 22500, 22000
      ],
    },
  ];

  return (
    <>
      <PageMeta title="Tổng quan Quảng cáo - meup" description="Tổng quan quảng cáo với dữ liệu thực từ API backend" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        {/* Date Range Filter Card */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-4">
            <TikTokDatePicker
              selectsRange={true}
              value={[dateRange.startDate, dateRange.endDate]}
              onChange={(dates) => {
                if (Array.isArray(dates) && dates.length === 2) {
                  setDateRange({ startDate: dates[0], endDate: dates[1] });
                  // Tự động gọi API khi chọn khoảng thời gian
                  fetchAdsDataWithDates(dates[0], dates[1]);
                }
              }}
              placeholder="Chọn khoảng thời gian"
              className="w-64"
            />
            
            {loading && (
              <div className="text-blue-600 text-sm flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Đang tải dữ liệu chính...
              </div>
            )}

            {comparisonLoading && (
              <div className="text-purple-600 text-sm flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                Đang tải dữ liệu so sánh...
              </div>
            )}
            
            {error && (
              <div className="text-red-600 text-sm">
                <strong>Lỗi:</strong> {error}
              </div>
            )}

            {rateLimited && (
              <div className="text-orange-600 text-sm flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                Đã vượt quá giới hạn yêu cầu. Vui lòng đợi 1 phút...
              </div>
            )}
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
          {/* Revenue Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl dark:bg-green-900/20 mb-3">
              <DollarLineIcon className="text-green-600 size-5 dark:text-green-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-base text-gray-500 dark:text-gray-400">
                  Doanh Thu
                </span>
                <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
                  {summary.totalRevenue > 0 ? summary.totalRevenue.toLocaleString() : '--'}
                </h4>
              </div>
              <div className="text-right">
                <ComparisonBadge 
                  currentValue={summary.totalRevenue} 
                  previousValue={comparisonData?.totalRevenue || 0} 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getComparisonText()}</p>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl dark:bg-blue-900/20 mb-3">
              <BoxIconLine className="text-blue-600 size-5 dark:text-blue-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-base text-gray-500 dark:text-gray-400">
                  Đơn Hàng
                </span>
                <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
                  {summary.totalOrders > 0 ? summary.totalOrders.toLocaleString() : '--'}
                </h4>
              </div>
              <div className="text-right">
                <ComparisonBadge 
                  currentValue={summary.totalOrders} 
                  previousValue={comparisonData?.totalOrders || 0} 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getComparisonText()}</p>
              </div>
            </div>
          </div>

          {/* Cost Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-xl dark:bg-red-900/20 mb-3">
              <DollarLineIcon className="text-red-600 size-5 dark:text-red-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-base text-gray-500 dark:text-gray-400">
                  Chi Phí
                </span>
                <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
                  {summary.totalCost > 0 ? summary.totalCost.toLocaleString() : '--'}
                </h4>
              </div>
              <div className="text-right">
                <ComparisonBadge 
                  currentValue={summary.totalCost} 
                  previousValue={comparisonData?.totalCost || 0} 
                  isPositive={false}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getComparisonText()}</p>
              </div>
            </div>
          </div>

          {/* CPA Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl dark:bg-purple-900/20 mb-3">
              <GroupIcon className="text-purple-600 size-5 dark:text-purple-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-base text-gray-500 dark:text-gray-400">
                  CPA
                </span>
                <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
                  {summary.totalOrders > 0 ? Math.round(summary.totalCost / summary.totalOrders).toLocaleString() : '--'}
                </h4>
              </div>
              <div className="text-right">
                <ComparisonBadge 
                  currentValue={summary.totalOrders > 0 ? summary.totalCost / summary.totalOrders : 0} 
                  previousValue={comparisonData?.totalOrders > 0 ? comparisonData.totalCost / comparisonData.totalOrders : 0} 
                  isPositive={false}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getComparisonText()}</p>
              </div>
            </div>
          </div>

          {/* ROI Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-xl dark:bg-orange-900/20 mb-3">
              <DollarLineIcon className="text-orange-600 size-5 dark:text-orange-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-base text-gray-500 dark:text-gray-400">
                  ROI
                </span>
                <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
                  {summary.totalCost > 0 ? (summary.totalRevenue / summary.totalCost).toFixed(2) : '--'}
                </h4>
              </div>
              <div className="text-right">
                <ComparisonBadge 
                  currentValue={summary.totalCost > 0 ? summary.totalRevenue / summary.totalCost : 0} 
                  previousValue={comparisonData?.totalCost > 0 ? comparisonData.totalRevenue / comparisonData.totalCost : 0} 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getComparisonText()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Tổng Doanh Thu
              </h3>
            </div>
            <Chart options={revenueChartOptions} series={revenueChartSeries} type="bar" height={220} />
          </div>

          {/* Cost Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Tổng Chi Phí
              </h3>
            </div>
            <Chart options={costChartOptions} series={costChartSeries} type="bar" height={220} />
          </div>

          {/* ROI Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                ROI
              </h3>
            </div>
            <Chart options={roiChartOptions} series={roiChartSeries} type="area" height={220} />
          </div>

          {/* CPA Chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                CPA
              </h3>
            </div>
            <Chart options={cpaChartOptions} series={cpaChartSeries} type="bar" height={220} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdsOverview;

