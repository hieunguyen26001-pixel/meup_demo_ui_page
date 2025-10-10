import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
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

interface CampaignData {
  campaign_id: string;
  campaign_name: string;
  cost: number;
  cost_per_order: number;
  gross_revenue: number;
  max_delivery_budget: number;
  net_cost: number;
  operation_status: string;
  orders: number;
  roas_bid: number;
  roi: number;
  schedule_end_time: string;
  schedule_start_time: string;
  schedule_type: string;
  target_roi_budget: number;
  bid_type: string;
  stat_time_day: string;
  days_count: number;
}

const GmvMaxProduct: React.FC = () => {
  const navigate = useNavigate();

  // TikTok-style currency formatter
  const formatTikTokCurrency = (value: number): string => {
    if (isNaN(value) || !isFinite(value)) return '0';
    
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B';
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    } else {
      return value.toFixed(0);
    }
  };

  // Helper function to safely format numbers and prevent NaN
  const safeFormat = (value: number, decimals: number = 2, fallback: string = '0'): string => {
    if (isNaN(value) || !isFinite(value)) return fallback;
    return value.toFixed(decimals);
  };

  const safeFormatCurrency = (value: number, fallback: string = '₫0'): string => {
    if (isNaN(value) || !isFinite(value)) return fallback;
    return formatCurrency(value.toString());
  };

  // Helper function to safely calculate percentages
  const safePercentage = (numerator: number, denominator: number, decimals: number = 1): string => {
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return '0.0';
    return ((numerator / denominator) * 100).toFixed(decimals);
  };

  // API State
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
  const [rawApiData, setRawApiData] = useState<any[]>([]); // Store raw API data for daily aggregation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);
    return { startDate, endDate };
  });

  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [presetView, setPresetView] = useState<string>('all');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['all']);

  // Fetch GMV Max Product data with cache
  const fetchGmvMaxProductData = useCallback(async (startDate: Date, endDate: Date) => {
    const cacheKey = `gmv-max-product_${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
    
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
      const response = await axios.get(`${config.backendEndpoint}/api/gmv-max-product`, {
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
        setError('Quá nhiều yêu cầu. Vui lòng đợi một chút trước khi thử lại.');
      } else {
        setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      }
      throw err;
    }
  }, []);

  // Fetch data with debouncing
  const fetchDataWithDates = useCallback(
    debounce(async (startDate: Date, endDate: Date) => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchGmvMaxProductData(startDate, endDate);
        
        // Transform API response to match our interface
        if (data?.data?.list) {
          // Store raw API data for daily aggregation
          setRawApiData(data.data.list);
          
          // Group data by campaign_id and aggregate metrics
          const campaignMap = new Map();
          
          data.data.list.forEach((item: any) => {
            const campaignId = item.dimensions?.campaign_id || item.metrics?.campaign_id || '';
            
            if (!campaignMap.has(campaignId)) {
              campaignMap.set(campaignId, {
                campaign_id: campaignId,
                campaign_name: item.metrics?.campaign_name || '',
                cost: 0,
                cost_per_order: 0,
                gross_revenue: 0,
                max_delivery_budget: parseFloat(item.metrics?.max_delivery_budget || '0'),
                net_cost: 0,
                operation_status: item.metrics?.operation_status || 'DISABLE',
                orders: 0,
                roas_bid: parseFloat(item.metrics?.roas_bid || '0'),
                roi: 0,
                schedule_end_time: item.metrics?.schedule_end_time || '',
                schedule_start_time: item.metrics?.schedule_start_time || '',
                schedule_type: item.metrics?.schedule_type || '',
                target_roi_budget: parseFloat(item.metrics?.target_roi_budget || '0'),
                bid_type: item.metrics?.bid_type || '',
                stat_time_day: item.dimensions?.stat_time_day || '',
                days_count: 0
              });
            }
            
            const campaign = campaignMap.get(campaignId);
            campaign.cost += parseFloat(item.metrics?.cost || '0');
            campaign.gross_revenue += parseFloat(item.metrics?.gross_revenue || '0');
            campaign.net_cost += parseFloat(item.metrics?.net_cost || '0');
            campaign.orders += parseInt(item.metrics?.orders || '0');
            campaign.days_count += 1;
          });
          
          // Calculate aggregated metrics
          const transformedData = Array.from(campaignMap.values()).map(campaign => {
            // Calculate average cost per order
            campaign.cost_per_order = campaign.orders > 0 ? campaign.cost / campaign.orders : 0;
            
            // Calculate ROI
            campaign.roi = campaign.cost > 0 ? campaign.gross_revenue / campaign.cost : 0;
            
            return campaign;
          });
          
          setCampaignData(transformedData);
        } else {
          setCampaignData([]);
          setRawApiData([]);
        }
      } catch (err: any) {
        console.error('Error fetching GMV Max Product data:', err);
        // Fallback to sample data if API fails
        setCampaignData(sampleCampaignData);
        setRawApiData([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [fetchGmvMaxProductData]
  );

  // Load data on component mount
  useEffect(() => {
    fetchDataWithDates(dateRange.startDate, dateRange.endDate);
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
      categories: [
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
        formatter: (val: number) => formatTikTokCurrency(val),
      },
    },
  };

  const revenueChartSeries = [
    {
      name: "Tổng Doanh Thu",
      data: [
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
      categories: [
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
        formatter: (val: number) => formatTikTokCurrency(val),
      },
    },
  };

  const costChartSeries = [
    {
      name: "Tổng CP GMV",
      data: [
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
      categories: [
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
      data: [
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
      categories: [
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
        formatter: (val: number) => formatTikTokCurrency(val),
      },
    },
  };

  const cpaChartSeries = [
    {
      name: "CP/đơn hàng GMV",
      data: [
        18000, 17500, 17800, 18200, 18500, 19000, 18800, 19200, 19500, 19800,
        20000, 19500, 19800, 20200, 20500, 20800, 21000, 20500, 20800, 21200,
        21500, 21000, 21300, 21800, 22000, 22500, 22200, 22800, 22500, 22000
      ],
    },
  ];
  
  // Sample data from your JSON
  const sampleCampaignData: CampaignData[] = [
    {
      campaign_id: "1844659997202449",
      campaign_name: "SPU - LF02",
      cost: "178089",
      cost_per_order: "29681",
      gross_revenue: "1314375",
      max_delivery_budget: "0",
      net_cost: "178089",
      operation_status: "ENABLE",
      orders: "6",
      roas_bid: "3.50",
      roi: "7.38",
      schedule_end_time: "2035-09-28 03:52:52",
      schedule_start_time: "2025-09-30 03:52:52",
      schedule_type: "Continuously",
      target_roi_budget: "6000000",
      bid_type: "CUSTOM",
      stat_time_day: "2025-10-07 00:00:00"
    },
    {
      campaign_id: "1842679658453105",
      campaign_name: "LAFIT - Số 1 Gen Nịt Bụng - 08/09",
      cost: "1265355",
      cost_per_order: "48667",
      gross_revenue: "3249352",
      max_delivery_budget: "0",
      net_cost: "1265355",
      operation_status: "ENABLE",
      orders: "26",
      roas_bid: "3.50",
      roi: "2.57",
      schedule_end_time: "2035-09-06 07:23:23",
      schedule_start_time: "2025-09-08 07:23:23",
      schedule_type: "Continuously",
      target_roi_budget: "6000000",
      bid_type: "CUSTOM",
      stat_time_day: "2025-10-05 00:00:00"
    }
  ];

  const formatCurrency = (value: string) => {
    return `₫${parseInt(value).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Calculate derived metrics for individual campaigns
  const calculateCampaignMetrics = (campaign: CampaignData) => {
    const cost = campaign.cost;
    const netCost = campaign.net_cost;
    const revenue = campaign.gross_revenue;
    const orders = campaign.orders;
    const budget = campaign.target_roi_budget;
    const roi = campaign.roi;
    const targetROAS = campaign.roas_bid;

    const cpa = orders > 0 ? cost / orders : 0;
    const aov = orders > 0 ? revenue / orders : 0;
    const spendBudgetRatio = budget > 0 ? (cost / budget) * 100 : 0;
    const billedSpendRatio = cost > 0 ? (netCost / cost) * 100 : 0;
    const targetGap = targetROAS > 0 ? (roi / targetROAS) * 100 : 0;

    return {
      cpa,
      aov,
      spendBudgetRatio,
      billedSpendRatio,
      targetGap
    };
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; class: string } } = {
      'ENABLE': { text: 'Đang chạy', class: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 dark:from-emerald-900/20 dark:to-teal-900/20 dark:text-emerald-400' },
      'DISABLE': { text: 'Tạm dừng', class: 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 dark:from-rose-900/20 dark:to-pink-900/20 dark:text-rose-400' },
      'PAUSED': { text: 'Tạm dừng', class: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/20 dark:to-orange-900/20 dark:text-amber-400' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 dark:from-slate-900/20 dark:to-gray-900/20 dark:text-slate-400' };
    
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    let filteredData = campaignData;

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredData = filteredData.filter(campaign => campaign.operation_status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter(campaign => 
        campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.campaign_id.includes(searchTerm)
      );
    }

    // Apply sorting
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue: any = a[sortField as keyof CampaignData];
      let bValue: any = b[sortField as keyof CampaignData];

      // Convert to numbers for numeric fields
      if (['cost', 'gross_revenue', 'roi', 'net_cost', 'target_roi_budget'].includes(sortField)) {
        aValue = aValue;
        bValue = bValue;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const getPaginatedData = () => {
    const sortedData = getSortedData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  };

  // Calculate hourly performance data from raw API data
  const getHourlyData = () => {
    const hourlyMap = new Map<string, { hour: string; revenue: number; orders: number; cost: number }>();

    // Use raw API data to aggregate by hour across all campaigns
    rawApiData.forEach((item: any) => {
      const statTime = item.dimensions?.stat_time_day;
      if (!statTime) return;

      // Extract hour from stat_time_day (assuming format like "2024-01-01 14:00:00")
      const hourMatch = statTime.match(/(\d{2}):\d{2}:\d{2}/);
      if (!hourMatch) return;

      const hour = hourMatch[1];
      const hourKey = `${hour}:00`;

      if (!hourlyMap.has(hourKey)) {
        hourlyMap.set(hourKey, {
          hour: hourKey,
          revenue: 0,
          orders: 0,
          cost: 0
        });
      }

      const hourlyData = hourlyMap.get(hourKey)!;
      hourlyData.revenue += parseFloat(item.metrics?.gross_revenue || '0');
      hourlyData.orders += parseInt(item.metrics?.orders || '0');
      hourlyData.cost += parseFloat(item.metrics?.cost || '0');
    });

    return Array.from(hourlyMap.values())
      .sort((a, b) => a.hour.localeCompare(b.hour))
      .map(hourData => ({
        ...hourData,
        efficiency: hourData.revenue > 0 ? 
          (hourData.revenue / hourData.cost > 2.5 ? 'Rất cao' : 
           hourData.revenue / hourData.cost > 2.0 ? 'Cao' : 'Trung bình') : 'Thấp'
      }));
  };

  // Calculate day of week performance data from raw API data
  const getDayOfWeekData = () => {
    const dayMap = new Map<string, { day: string; revenue: number; trend: string; color: string }>();

    // Use raw API data to aggregate by day of week
    rawApiData.forEach((item: any) => {
      const statTime = item.dimensions?.stat_time_day;
      if (!statTime) return;

      // Extract date from stat_time_day
      const dateMatch = statTime.match(/(\d{4}-\d{2}-\d{2})/);
      if (!dateMatch) return;

      const date = new Date(dateMatch[1]);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      const dayName = dayNames[dayOfWeek];

      if (!dayMap.has(dayName)) {
        dayMap.set(dayName, {
          day: dayName,
          revenue: 0,
          trend: '↗️',
          color: 'green'
        });
      }

      const dayData = dayMap.get(dayName)!;
      dayData.revenue += parseFloat(item.metrics?.gross_revenue || '0');
    });

    // Calculate trends based on revenue
    const sortedDays = Array.from(dayMap.values()).sort((a, b) => b.revenue - a.revenue);
    const maxRevenue = sortedDays[0]?.revenue || 0;

    return sortedDays.map((dayData, index) => ({
      ...dayData,
      trend: index === 0 ? '↗️' : dayData.revenue > maxRevenue * 0.8 ? '↗️' : '↘️',
      color: dayData.revenue > maxRevenue * 0.8 ? 'green' : dayData.revenue > maxRevenue * 0.6 ? 'blue' : 'gray'
    }));
  };

  // Calculate daily aggregated data for charts
  const getDailyData = () => {
    const dailyMap = new Map();
    
    // Use raw API data to aggregate by day across all campaigns
    rawApiData.forEach((item: any) => {
      const date = item.dimensions?.stat_time_day?.split(' ')[0] || ''; // Get date part only
      if (!date) return;
      
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          totalRevenue: 0,
          totalCost: 0,
          totalOrders: 0,
          avgROI: 0,
          avgCPA: 0
        });
      }
      
      const dailyData = dailyMap.get(date);
      dailyData.totalRevenue += parseFloat(item.metrics?.gross_revenue || '0');
      dailyData.totalCost += parseFloat(item.metrics?.cost || '0');
      dailyData.totalOrders += parseInt(item.metrics?.orders || '0');
    });
    
    // Calculate average ROI and CPA for each day
    Array.from(dailyMap.values()).forEach(day => {
      day.avgROI = day.totalCost > 0 ? day.totalRevenue / day.totalCost : 0;
      day.avgCPA = day.totalOrders > 0 ? day.totalCost / day.totalOrders : 0;
    });
    
    return Array.from(dailyMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Calculate derived metrics
  const calculateMetrics = () => {
    const totalSpend = campaignData.reduce((sum, campaign) => sum + campaign.cost, 0);
    const totalNetCost = campaignData.reduce((sum, campaign) => sum + campaign.net_cost, 0);
    const totalRevenue = campaignData.reduce((sum, campaign) => sum + campaign.gross_revenue, 0);
    const totalOrders = campaignData.reduce((sum, campaign) => sum + campaign.orders, 0);
    const totalBudget = campaignData.reduce((sum, campaign) => sum + campaign.target_roi_budget, 0);
    
    const avgROI = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const avgCPA = totalOrders > 0 ? totalSpend / totalOrders : 0;
    const avgAOV = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const spendBudgetRatio = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
    const billedSpendRatio = totalSpend > 0 ? (totalNetCost / totalSpend) * 100 : 0;
    
    // Find best/worst campaigns
    const campaignsWithROI = campaignData.filter(c => c.orders > 0);
    const bestROICampaign = campaignsWithROI.length > 0 ? campaignsWithROI.reduce((best, current) => 
      current.roi > best.roi ? current : best
    ) : null;
    const worstROICampaign = campaignsWithROI.length > 0 ? campaignsWithROI.reduce((worst, current) => 
      current.roi < worst.roi ? current : worst
    ) : null;

    return {
      totalSpend,
      totalNetCost,
      totalRevenue,
      totalOrders,
      totalBudget,
      avgROI,
      avgCPA,
      avgAOV,
      spendBudgetRatio,
      billedSpendRatio,
      bestROICampaign,
      worstROICampaign
    };
  };

  const metrics = calculateMetrics();

  // Generate alerts and warnings
  const generateAlerts = () => {
    const alertsList: any[] = [];
    
    campaignData.forEach(campaign => {
      const campaignMetrics = calculateCampaignMetrics(campaign);
      const roi = campaign.roi;
      const cost = campaign.cost;
      const orders = campaign.orders;
      
      // ROI alerts
      if (roi < 2 && cost > 50000) {
        alertsList.push({
          type: 'error',
          title: 'ROI Thấp',
          message: `${campaign.campaign_name} có ROI ${roi.toFixed(2)} < 2 và chi phí cao`,
          campaign: campaign.campaign_name
        });
      }
      
      // Billing alerts
      if (campaignMetrics.billedSpendRatio < 85 || campaignMetrics.billedSpendRatio > 115) {
        alertsList.push({
          type: 'warning',
          title: 'Billing Bất Thường',
          message: `${campaign.campaign_name} có tỷ lệ billing ${campaignMetrics.billedSpendRatio.toFixed(1)}%`,
          campaign: campaign.campaign_name
        });
      }
      
      // No orders alert
      if (orders === 0 && cost > 1000) {
        alertsList.push({
          type: 'error',
          title: 'Không Có Đơn Hàng',
          message: `${campaign.campaign_name} chi phí ${formatTikTokCurrency(cost)} nhưng không có đơn hàng`,
          campaign: campaign.campaign_name
        });
      }
      
      // Budget pacing alerts
      if (campaignMetrics.spendBudgetRatio > 80) {
        alertsList.push({
          type: 'warning',
          title: 'Chi Tiêu Cao',
          message: `${campaign.campaign_name} đã chi ${campaignMetrics.spendBudgetRatio.toFixed(1)}% ngân sách`,
          campaign: campaign.campaign_name
        });
      }
    });
    
    return alertsList;
  };

  const alertsList = generateAlerts();

  // Campaign comparison data
  const getComparisonData = () => {
    return selectedCampaigns.map(campaignId => {
      const campaign = campaignData.find(c => c.campaign_id === campaignId);
      if (!campaign) return null;
      const campaignMetrics = calculateCampaignMetrics(campaign);
      return {
        ...campaign,
        metrics: campaignMetrics
      };
    }).filter(Boolean);
  };

  const comparisonData = getComparisonData();
  const dailyData = getDailyData();
  const hourlyData = getHourlyData(); // New variable for hourly data
  const dayOfWeekData = getDayOfWeekData(); // New variable for day of week data
  const sortedData = getSortedData();
  const paginatedData = getPaginatedData();
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Export functions
  const exportToCSV = () => {
    const headers = ['Campaign ID', 'Campaign Name', 'Status', 'Budget', 'Cost', 'Orders', 'GMV', 'ROI', 'CPA', 'AOV', 'Start Date'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(campaign => {
        const metrics = calculateCampaignMetrics(campaign);
        return [
          campaign.campaign_id,
          `"${campaign.campaign_name}"`,
          campaign.operation_status,
          campaign.target_roi_budget.toString(),
          campaign.cost.toString(),
          campaign.orders.toString(),
          campaign.gross_revenue.toString(),
          campaign.roi.toFixed(2),
          metrics.cpa > 0 ? metrics.cpa.toFixed(0) : 'N/A',
          metrics.aov > 0 ? metrics.aov.toFixed(0) : 'N/A',
          campaign.schedule_start_time
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gmv-campaigns-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Preset views
  const applyPresetView = (view: string) => {
    setPresetView(view);
    switch (view) {
      case 'roi':
        setVisibleColumns(['campaign', 'status', 'roi', 'cpa', 'aov', 'revenue']);
        setSortField('roi');
        setSortDirection('desc');
        break;
      case 'growth':
        setVisibleColumns(['campaign', 'status', 'orders', 'revenue', 'roi', 'spendBudget']);
        setSortField('orders');
        setSortDirection('desc');
        break;
      case 'cost':
        setVisibleColumns(['campaign', 'status', 'budget', 'cost', 'spendBudget', 'netCost']);
        setSortField('cost');
        setSortDirection('desc');
        break;
      default:
        setVisibleColumns(['all']);
        setSortField('');
        setSortDirection('asc');
    }
  };

  return (
    <>
      <PageMeta title="GMV Max sản phẩm - meup" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            GMV Max sản phẩm
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý và theo dõi hiệu suất chiến dịch GMV Max sản phẩm
          </p>
        </div>

        {/* Date Range Filter Card */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-4">
            <TikTokDatePicker
              selectsRange={true}
              value={[dateRange.startDate, dateRange.endDate]}
              onChange={(dates) => {
                if (Array.isArray(dates) && dates.length === 2) {
                  setDateRange({ startDate: dates[0], endDate: dates[1] });
                  fetchDataWithDates(dates[0], dates[1]);
                }
              }}
              placeholder="Chọn khoảng thời gian"
              className="w-64"
            />
            
            {loading && (
              <div className="text-blue-600 text-sm flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Đang tải dữ liệu...
              </div>
            )}
            
            {error && (
              <div className="text-red-600 text-sm">
                <strong>Lỗi:</strong> {error}
              </div>
            )}
          </div>
        </div>

            {/* Alert Dashboard */}
            {alertsList.length > 0 && (
              <div className="mb-6">
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
                      <span className="text-red-500">⚠️</span>
                      Cảnh Báo & Thông Báo ({alertsList.length})
                    </h3>
                    <button 
                      onClick={() => setAlerts([])}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {alertsList.slice(0, 6).map((alert, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        alert.type === 'error' 
                          ? 'bg-red-50 border-red-400 dark:bg-red-900/10 dark:border-red-500'
                          : 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/10 dark:border-yellow-500'
                      }`}>
                        <div className="flex items-start gap-2">
                          <span className={`text-sm font-medium ${
                            alert.type === 'error' ? 'text-red-800 dark:text-red-300' : 'text-yellow-800 dark:text-yellow-300'
                          }`}>
                            {alert.type === 'error' ? '🚨' : '⚠️'}
                          </span>
                          <div>
                            <p className={`text-sm font-semibold ${
                              alert.type === 'error' ? 'text-red-800 dark:text-red-300' : 'text-yellow-800 dark:text-yellow-300'
                            }`}>
                              {alert.title}
                            </p>
                            <p className={`text-xs ${
                              alert.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {alert.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {alertsList.length > 6 && (
                    <div className="mt-3 text-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Và {alertsList.length - 6} cảnh báo khác...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced KPI Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              {/* Total Spend */}
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng Chi Phí</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                      {formatTikTokCurrency(metrics.totalSpend)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {metrics.spendBudgetRatio.toFixed(1)}% ngân sách
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl dark:from-rose-900/20 dark:to-pink-900/20 flex items-center justify-center">
                    <span className="text-rose-600 dark:text-rose-400 text-xl">💸</span>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng Doanh Thu</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                      {formatTikTokCurrency(metrics.totalRevenue)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {metrics.totalOrders} đơn hàng
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
                    <span className="text-emerald-600 dark:text-emerald-400 text-xl">💰</span>
                  </div>
                </div>
              </div>

              {/* Average ROI */}
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ROI Trung Bình</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                      {metrics.avgROI.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      CPA: {formatTikTokCurrency(metrics.avgCPA)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl dark:from-violet-900/20 dark:to-purple-900/20 flex items-center justify-center">
                    <span className="text-violet-600 dark:text-violet-400 text-xl">📈</span>
                  </div>
                </div>
              </div>

              {/* Average AOV */}
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">AOV Trung Bình</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                      {formatTikTokCurrency(metrics.avgAOV)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Giá trị đơn hàng
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                    <span className="text-indigo-600 dark:text-indigo-400 text-xl">🛒</span>
                  </div>
                </div>
              </div>
            </div>




            {/* Campaign Comparison Section */}
            {showComparison && comparisonData.length > 0 && (
              <div className="mb-6">
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      So Sánh Chiến Dịch ({comparisonData.length})
                    </h3>
                    <button 
                      onClick={() => setShowComparison(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                        <tr>
                          <th className="px-3 py-2 text-left">Campaign</th>
                          <th className="px-3 py-2 text-right">Cost</th>
                          <th className="px-3 py-2 text-right">Revenue</th>
                          <th className="px-3 py-2 text-right">Orders</th>
                          <th className="px-3 py-2 text-right">ROI</th>
                          <th className="px-3 py-2 text-right">CPA</th>
                          <th className="px-3 py-2 text-right">AOV</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((campaign: any) => (
                          <tr key={campaign.campaign_id} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="px-3 py-2">
                              <button 
                                onClick={() => navigate(`campaign-video/${campaign.campaign_id}?startDate=${dateRange.startDate.toISOString().split('T')[0]}&endDate=${dateRange.endDate.toISOString().split('T')[0]}`)}
                                className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                              >
                                {campaign.campaign_name}
                              </button>
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800 dark:text-white/90">
                              {formatTikTokCurrency(campaign.cost)}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800 dark:text-white/90">
                              {formatTikTokCurrency(campaign.gross_revenue)}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800 dark:text-white/90">
                              {campaign.orders}
                            </td>
                            <td className="px-3 py-2 text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                campaign.roi >= 3 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : campaign.roi >= 2
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {campaign.roi.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800 dark:text-white/90">
                              {campaign.metrics.cpa > 0 ? formatTikTokCurrency(campaign.metrics.cpa) : 'N/A'}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800 dark:text-white/90">
                              {campaign.metrics.aov > 0 ? formatTikTokCurrency(campaign.metrics.aov) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Charts Section */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
              {/* Revenue vs Cost Comparison */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Top 5 Chiến Dịch - Doanh Thu vs Chi Phí
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-300 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-400">Doanh Thu</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-pink-300 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-400">Chi Phí</span>
                    </div>
                  </div>
                </div>
                <Chart 
                  options={{
                    chart: {
                      type: "bar",
                      height: 220,
                      toolbar: { show: false },
                      fontFamily: 'Inter, sans-serif',
                      background: 'transparent'
                    },
                    colors: ["#A8E6CF", "#FFB3BA"],
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: '50%',
                        borderRadius: 8,
                        dataLabels: {
                          position: 'top'
                        }
                      }
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val: number) {
                        return "₫" + (val / 1000000).toFixed(1) + "M";
                      },
                      style: {
                        fontSize: '9px',
                        fontWeight: 'bold',
                        colors: ['#1F2937']
                      },
                      offsetY: -20
                    },
                    xaxis: {
                      categories: campaignData
                        .sort((a, b) => b.gross_revenue - a.gross_revenue)
                        .slice(0, 5)
                        .map(c => c.campaign_name.substring(0, 8) + "..."),
                      labels: {
                        style: {
                          fontSize: '10px',
                          fontWeight: '500',
                          colors: ['#6B7280']
                        },
                        rotate: -45
                      },
                      axisBorder: {
                        show: false
                      },
                      axisTicks: {
                        show: false
                      }
                    },
                    yaxis: {
                      labels: {
                        formatter: function (val: number) {
                          return "₫" + (val / 1000000).toFixed(0) + "M";
                        },
                        style: {
                          fontSize: '10px',
                          colors: ['#6B7280']
                        }
                      },
                      axisBorder: {
                        show: false
                      }
                    },
                    grid: {
                      borderColor: '#F3F4F6',
                      strokeDashArray: 3,
                      xaxis: {
                        lines: {
                          show: false
                        }
                      },
                      yaxis: {
                        lines: {
                          show: true
                        }
                      }
                    },
                    legend: {
                      position: 'top',
                      horizontalAlign: 'right',
                      fontSize: '11px',
                      fontWeight: '600',
                      markers: {
                        width: 8,
                        height: 8,
                        radius: 4
                      }
                    },
                    tooltip: {
                      y: {
                        formatter: function (val: number) {
                          return formatTikTokCurrency(val);
                        }
                      },
                      style: {
                        fontSize: '12px'
                      }
                    }
                  }} 
                  series={[
                    {
                      name: "💰 Doanh Thu",
                      data: campaignData
                        .sort((a, b) => b.gross_revenue - a.gross_revenue)
                        .slice(0, 5)
                        .map(c => c.gross_revenue)
                    },
                    {
                      name: "💸 Chi Phí", 
                      data: campaignData
                        .sort((a, b) => b.gross_revenue - a.gross_revenue)
                        .slice(0, 5)
                        .map(c => c.cost)
                    }
                  ]} 
                  type="bar" 
                  height={220} 
                />
              </div>

              {/* ROI Performance by Campaign */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Hiệu Suất ROI
                  </h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Top {Math.min(5, campaignData.length)} chiến dịch
                  </div>
                </div>
                <Chart 
                  options={{
                    chart: {
                      type: "bar",
                      height: 220,
                      toolbar: { show: false },
                      fontFamily: 'Inter, sans-serif'
                    },
                    colors: ["#3B82F6"],
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: '70%',
                        borderRadius: 6
                      }
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val: number) {
                        return val.toFixed(1);
                      },
                      style: {
                        fontSize: '11px',
                        fontWeight: 'bold',
                        colors: ['#1E40AF']
                      }
                    },
                    xaxis: {
                      categories: campaignData
                        .sort((a, b) => b.roi - a.roi)
                        .slice(0, 5)
                        .map(c => c.campaign_name.substring(0, 10) + "..."),
                      labels: {
                        style: {
                          fontSize: '11px',
                          fontWeight: '500'
                        }
                      }
                    },
                    yaxis: {
                      title: {
                        text: "ROI",
                        style: {
                          fontSize: '12px',
                          fontWeight: '600'
                        }
                      },
                      labels: {
                        formatter: function (val: number) {
                          return val.toFixed(1);
                        },
                        style: {
                          fontSize: '11px'
                        }
                      }
                    },
                    grid: {
                      borderColor: '#f1f5f9',
                      strokeDashArray: 3
                    },
                    tooltip: {
                      y: {
                        formatter: function (val: number) {
                          return "ROI: " + val.toFixed(2);
                        }
                      }
                    }
                  }} 
                  series={[{
                    name: "📈 ROI",
                    data: campaignData
                      .sort((a, b) => b.roi - a.roi)
                      .slice(0, 5)
                      .map(c => c.roi)
                  }]} 
                  type="bar" 
                  height={220} 
                />
              </div>

              {/* Budget Allocation Pie Chart */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Phân Bổ Ngân Sách
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Tỷ lệ ngân sách theo chiến dịch
                  </p>
                </div>
                <Chart 
                  options={{
                    colors: ["#A8E6CF", "#B8E6B8", "#C7E9C0", "#D4F1D4", "#E1F5E1", "#F0F8F0", "#F5F5F5"],
                    chart: {
                      fontFamily: "Inter, sans-serif",
                      type: "pie",
                      height: 220,
                      toolbar: { show: false },
                      background: 'transparent'
                    },
                    labels: campaignData.map(c => c.campaign_name.substring(0, 8) + "..."),
                    legend: {
                      position: "right",
                      fontSize: "11px",
                      fontWeight: "600",
                      itemMargin: {
                        horizontal: 10,
                        vertical: 6
                      },
                      markers: {
                        width: 8,
                        height: 8,
                        radius: 4
                      },
                      verticalAlign: "middle",
                      formatter: function(seriesName: string, opts: any) {
                        const val = opts.w.globals.series[opts.seriesIndex];
                        const percentage = ((val / opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(1);
                        return `${seriesName}: ${percentage}%`;
                      }
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: (val: string) => `${parseFloat(val).toFixed(0)}%`,
                      style: {
                        fontSize: '10px',
                        fontWeight: 'bold',
                        colors: ['#2D3748']
                      }
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '65%',
                          labels: {
                            show: true,
                            name: {
                              show: true,
                              fontSize: '13px',
                              fontWeight: '700',
                              color: '#4A5568'
                            },
                            value: {
                              show: true,
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#1A202C',
                              formatter: function (val: string) {
                                return "₫" + (parseFloat(val) / 1000000).toFixed(1) + "M";
                              }
                            },
                            total: {
                              show: true,
                              label: 'Tổng Ngân Sách',
                              fontSize: '11px',
                              color: '#718096',
                              formatter: function (w: any) {
                                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                                return "₫" + (total / 1000000).toFixed(1) + "M";
                              }
                            }
                          }
                        },
                        expandOnClick: true
                      }
                    },
                    tooltip: {
                      y: {
                        formatter: function (val: number) {
                          return formatTikTokCurrency(val);
                        }
                      }
                    }
                  }} 
                  series={campaignData.map(c => c.target_roi_budget)} 
                  type="pie" 
                  height={220} 
                />
              </div>

              {/* CPA vs AOV Analysis */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Top Chiến Dịch Hiệu Quả
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Top 5 chiến dịch có ROI cao nhất
                  </p>
                </div>
                <Chart 
                  options={{
                    chart: {
                      type: "bar",
                      height: 220,
                      toolbar: { show: false },
                      fontFamily: 'Inter, sans-serif',
                      background: 'transparent'
                    },
                    colors: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"],
                    plotOptions: {
                      bar: {
                        horizontal: true,
                        columnWidth: '60%',
                        borderRadius: 6,
                        dataLabels: {
                          position: 'right'
                        }
                      }
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val: number) {
                        return val.toFixed(1);
                      },
                      style: {
                        fontSize: '10px',
                        fontWeight: 'bold',
                        colors: ['#1F2937']
                      },
                      offsetX: 10
                    },
                    xaxis: {
                      title: {
                        text: "ROI",
                        style: {
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6B7280'
                        }
                      },
                      labels: {
                        formatter: function (val: number) {
                          return val.toFixed(1);
                        },
                        style: {
                          fontSize: '10px',
                          colors: ['#6B7280']
                        }
                      },
                      axisBorder: {
                        show: false
                      },
                      axisTicks: {
                        show: false
                      }
                    },
                    yaxis: {
                      categories: campaignData
                        .sort((a, b) => b.roi - a.roi)
                        .slice(0, 5)
                        .map(c => c.campaign_name.substring(0, 15) + "..."),
                      labels: {
                        style: {
                          fontSize: '9px',
                          fontWeight: '500',
                          colors: ['#6B7280']
                        }
                      },
                      axisBorder: {
                        show: false
                      }
                    },
                    grid: {
                      borderColor: '#F3F4F6',
                      strokeDashArray: 3,
                      xaxis: {
                        lines: {
                          show: true
                        }
                      },
                      yaxis: {
                        lines: {
                          show: false
                        }
                      }
                    },
                    tooltip: {
                      y: {
                        formatter: function (val: number, { seriesIndex, dataPointIndex }) {
                          const campaign = campaignData
                            .sort((a, b) => b.roi - a.roi)
                            .slice(0, 5)[dataPointIndex];
                          return `${campaign.campaign_name}: ROI ${val.toFixed(2)}`;
                        }
                      },
                      style: {
                        fontSize: '12px'
                      }
                    }
                  }} 
                  series={[{
                    name: "📈 ROI",
                    data: campaignData
                      .sort((a, b) => b.roi - a.roi)
                      .slice(0, 5)
                      .map(c => c.roi)
                  }]} 
                  type="bar" 
                  height={220} 
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Danh Sách Chiến Dịch
              </h3>
              <div className="flex items-center gap-3">
                {/* Preset Views */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Xem:</span>
                  <select
                    value={presetView}
                    onChange={(e) => applyPresetView(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="all">Tất Cả</option>
                    <option value="roi">Xem ROI</option>
                    <option value="growth">Xem Tăng Trưởng</option>
                    <option value="cost">Kiểm Soát Chi Phí</option>
                  </select>
                </div>
                
                {/* Export Button */}
                <button
                  onClick={exportToCSV}
                  className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                >
                  📊 Xuất CSV
                </button>
                
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Hiển Thị {sortedData.length} Chiến Dịch
                </span>
              </div>
            </div>

            {/* Enhanced Filters */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc ID chiến dịch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="all">Tất Cả Trạng Thái</option>
                    <option value="ENABLE">Đang Chạy</option>
                    <option value="DISABLE">Tạm Dừng</option>
                    <option value="PAUSED">Tạm Dừng</option>
                  </select>
                </div>
                <div className="sm:w-48">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    disabled={selectedCampaigns.length < 2}
                    className={`w-full px-4 py-2 rounded-lg font-medium text-sm ${
                      selectedCampaigns.length >= 2
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    So Sánh ({selectedCampaigns.length})
                  </button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCampaigns([])}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Bỏ Chọn Tất Cả
                  </button>
                <button
                  onClick={() => setSelectedCampaigns(sortedData.map(c => c.campaign_id))}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
                >
                  Chọn Tất Cả
                </button>
                <button
                  onClick={() => setSelectedCampaigns(sortedData.filter(c => c.roi >= 3).map(c => c.campaign_id))}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
                >
                  Chọn ROI Cao (≥3)
                </button>
                <button
                  onClick={() => setSelectedCampaigns(sortedData.filter(c => c.operation_status === 'ENABLE').map(c => c.campaign_id))}
                  className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30"
                >
                  Chọn Đang Chạy
                </button>
              </div>
            </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                      <tr>
                        <th className="px-4 py-3 w-12 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedCampaigns.length === paginatedData.length && paginatedData.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCampaigns([...selectedCampaigns, ...paginatedData.map(c => c.campaign_id)]);
                              } else {
                                setSelectedCampaigns(selectedCampaigns.filter(id => !paginatedData.map(c => c.campaign_id).includes(id)));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            onClick={() => handleSort('campaign_name')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Chiến dịch
                            {sortField === 'campaign_name' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3 whitespace-nowrap">
                          <button 
                            onClick={() => handleSort('operation_status')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Trạng thái
                            {sortField === 'operation_status' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            onClick={() => handleSort('target_roi_budget')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Ngân sách
                            {sortField === 'target_roi_budget' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            onClick={() => handleSort('cost')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Chi phí
                            {sortField === 'cost' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3 whitespace-nowrap">
                          <button 
                            onClick={() => handleSort('orders')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Đơn hàng
                            {sortField === 'orders' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            onClick={() => handleSort('gross_revenue')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            GMV
                            {sortField === 'gross_revenue' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            onClick={() => handleSort('roi')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            ROI
                            {sortField === 'roi' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <span className="flex items-center gap-1">
                            CPA
                          </span>
                        </th>
                        <th className="px-4 py-3">
                          <span className="flex items-center gap-1">
                            AOV
                          </span>
                        </th>
                        <th className="px-4 py-3 whitespace-nowrap">
                          <button 
                            onClick={() => handleSort('schedule_start_time')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Ngày bắt đầu
                            {sortField === 'schedule_start_time' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                      </tr>
                    </thead>
                <tbody>
                  {paginatedData.map((campaign, index) => {
                    const campaignMetrics = calculateCampaignMetrics(campaign);
                    return (
                      <tr key={campaign.campaign_id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-4 w-12">
                          <input
                            type="checkbox"
                            checked={selectedCampaigns.includes(campaign.campaign_id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCampaigns([...selectedCampaigns, campaign.campaign_id]);
                              } else {
                                setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.campaign_id));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <button 
                              onClick={() => navigate(`/campaign-video/${campaign.campaign_id}`)}
                              className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                            >
                              {campaign.campaign_name}
                            </button>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {campaign.campaign_id}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(campaign.operation_status)}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {formatTikTokCurrency(campaign.target_roi_budget)}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {formatTikTokCurrency(campaign.cost)}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {campaign.orders}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {formatTikTokCurrency(campaign.gross_revenue)}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.roi >= 3 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : campaign.roi >= 2
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {campaign.roi.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {campaignMetrics.cpa > 0 ? formatTikTokCurrency(campaignMetrics.cpa) : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {campaignMetrics.aov > 0 ? formatTikTokCurrency(campaignMetrics.aov) : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {formatDate(campaign.schedule_start_time)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedData.length)} trong tổng số {sortedData.length} chiến dịch
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
                  {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>

            {/* Additional Analysis Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
              {/* Revenue Chart */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Tổng Doanh Thu theo Ngày
                  </h3>
                </div>
                <Chart 
                  options={{
                    colors: ["#F59E0B"],
                    chart: {
                      fontFamily: "Inter, sans-serif",
                      type: "bar",
                      height: 220,
                      toolbar: { show: false },
                      background: 'transparent'
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
                      categories: dailyData.length > 0 ? dailyData.map(d => {
                        const date = new Date(d.date);
                        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                      }) : ['01/10'],
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                      labels: {
                        style: { fontSize: "10px", colors: ["#6B7280"] },
                        rotate: -45,
                      },
                    },
                    yaxis: {
                      labels: {
                        style: { fontSize: "10px", colors: ["#6B7280"] },
                        formatter: (val: number) => `₫${(val / 1000000).toFixed(0)}M`,
                      },
                    },
                    grid: {
                      yaxis: { lines: { show: true } },
                      xaxis: { lines: { show: false } },
                    },
                    fill: { opacity: 1 },
                    tooltip: {
                      y: { formatter: (val: number) => formatTikTokCurrency(val) },
                    },
                  }} 
                  series={[{
                    name: "Tổng Doanh Thu",
                    data: dailyData.length > 0 ? dailyData.map(d => d.totalRevenue) : [0]
                  }]} 
                  type="bar" 
                  height={220} 
                />
              </div>

              {/* Cost Chart */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Tổng Chi Phí theo Ngày
                  </h3>
                </div>
                <Chart 
                  options={{
                    colors: ["#EF4444"],
                    chart: {
                      fontFamily: "Inter, sans-serif",
                      type: "bar",
                      height: 220,
                      toolbar: { show: false },
                      background: 'transparent'
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
                      categories: dailyData.length > 0 ? dailyData.map(d => {
                        const date = new Date(d.date);
                        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                      }) : ['01/10'],
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                      labels: {
                        style: { fontSize: "10px", colors: ["#6B7280"] },
                        rotate: -45,
                      },
                    },
                    yaxis: {
                      labels: {
                        style: { fontSize: "10px", colors: ["#6B7280"] },
                        formatter: (val: number) => `₫${(val / 1000000).toFixed(0)}M`,
                      },
                    },
                    grid: {
                      yaxis: { lines: { show: true } },
                      xaxis: { lines: { show: false } },
                    },
                    fill: { opacity: 1 },
                    tooltip: {
                      y: { formatter: (val: number) => formatTikTokCurrency(val) },
                    },
                  }} 
                  series={[{
                    name: "Tổng Chi Phí",
                    data: dailyData.length > 0 ? dailyData.map(d => d.totalCost) : [0]
                  }]} 
                  type="bar" 
                  height={220} 
                />
              </div>

              {/* ROI Chart */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    ROI theo Ngày
                  </h3>
                </div>
                <Chart 
                  options={{
                    colors: ["#10B981"],
                    chart: {
                      fontFamily: "Inter, sans-serif",
                      type: "area",
                      height: 220,
                      toolbar: { show: false },
                      background: 'transparent'
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    stroke: {
                      curve: "smooth",
                      width: 2,
                    },
                    xaxis: {
                      categories: dailyData.length > 0 ? dailyData.map(d => {
                        const date = new Date(d.date);
                        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                      }) : ['01/10'],
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                      labels: {
                        style: { fontSize: "10px", colors: ["#6B7280"] },
                        rotate: -45,
                      },
                    },
                    yaxis: {
                      labels: {
                        style: { fontSize: "10px", colors: ["#6B7280"] },
                        formatter: (val: number) => val.toFixed(1),
                      },
                    },
                    grid: {
                      yaxis: { lines: { show: true } },
                      xaxis: { lines: { show: false } },
                    },
                    fill: {
                      type: "gradient",
                      gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.3,
                        stops: [0, 90, 100],
                      },
                    },
                    tooltip: {
                      y: { formatter: (val: number) => `ROI: ${val.toFixed(2)}` },
                    },
                  }} 
                  series={[{
                    name: "ROI",
                    data: dailyData.length > 0 ? dailyData.map(d => d.avgROI) : [0]
                  }]} 
                  type="area" 
                  height={220} 
                />
              </div>

              {/* CPA Chart */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    CPA theo Ngày
                  </h3>
                </div>
                <Chart 
                  options={{
                    colors: ["#8B5CF6"],
                    chart: {
                      fontFamily: "Inter, sans-serif",
                      type: "bar",
                      height: 220,
                      toolbar: { show: false },
                      background: 'transparent'
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
                      categories: dailyData.length > 0 ? dailyData.map(d => {
                        const date = new Date(d.date);
                        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                      }) : ['01/10'],
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                      labels: {
                        style: { fontSize: "10px", colors: ["#6B7280"] },
                        rotate: -45,
                      },
                    },
                    yaxis: {
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
                      y: { formatter: (val: number) => formatTikTokCurrency(val) },
                    },
                  }} 
                  series={[{
                    name: "CPA",
                    data: dailyData.length > 0 ? dailyData.map(d => d.avgCPA) : [0]
                  }]} 
                  type="bar" 
                  height={220} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GmvMaxProduct;
