import React, { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface CampaignData {
  campaign_id: string;
  campaign_name: string;
  campaign_budget: string;
  campaign_primary_status: string;
  template_ad_roas_bid: string;
  cost: string;
  onsite_roi2_shopping_sku: string;
  cost_per_onsite_roi2_shopping_sku: string;
  onsite_roi2_shopping_value: string;
  onsite_roi2_shopping: string;
  billed_cost: string;
  template_ad_start_time: string;
  template_ad_end_time: string;
}

const GmvMaxProduct: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [presetView, setPresetView] = useState<string>('all');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['all']);

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
        formatter: (val: number) => `₫${val.toLocaleString()}`,
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
        formatter: (val: number) => `₫${val.toLocaleString()}`,
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
        formatter: (val: number) => `₫${val.toLocaleString()}`,
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
  const sampleData: CampaignData[] = [
    {
      campaign_id: "1844659997202449",
      campaign_name: "SPU - LF02",
      campaign_budget: "9000000",
      campaign_primary_status: "delivery_ok",
      template_ad_roas_bid: "6.30",
      cost: "71181",
      onsite_roi2_shopping_sku: "3",
      cost_per_onsite_roi2_shopping_sku: "23727",
      onsite_roi2_shopping_value: "296999",
      onsite_roi2_shopping: "4.17",
      billed_cost: "14039",
      template_ad_start_time: "2025-09-30 10:52:52",
      template_ad_end_time: "2035-09-28 10:52:52"
    },
    {
      campaign_id: "1842679658453105",
      campaign_name: "LAFIT - Số 1 Gen Nịt Bụng - 08/09",
      campaign_budget: "9000000",
      campaign_primary_status: "delivery_ok",
      template_ad_roas_bid: "6.30",
      cost: "28184",
      onsite_roi2_shopping_sku: "2",
      cost_per_onsite_roi2_shopping_sku: "14092",
      onsite_roi2_shopping_value: "387999",
      onsite_roi2_shopping: "13.77",
      billed_cost: "4950",
      template_ad_start_time: "2025-09-08 14:23:23",
      template_ad_end_time: "2035-09-06 14:23:23"
    },
    {
      campaign_id: "1843396732239954",
      campaign_name: "COMBO 2",
      campaign_budget: "30000000",
      campaign_primary_status: "disable",
      template_ad_roas_bid: "3.10",
      cost: "347",
      onsite_roi2_shopping_sku: "0",
      cost_per_onsite_roi2_shopping_sku: "0",
      onsite_roi2_shopping_value: "0",
      onsite_roi2_shopping: "0.00",
      billed_cost: "0",
      template_ad_start_time: "2025-09-16 12:21:14",
      template_ad_end_time: "2035-09-14 12:21:14"
    },
    {
      campaign_id: "1845018809498770",
      campaign_name: "SPU - LF04",
      campaign_budget: "30000000",
      campaign_primary_status: "roi2_mutex_exclusive_product",
      template_ad_roas_bid: "2.70",
      cost: "294",
      onsite_roi2_shopping_sku: "0",
      cost_per_onsite_roi2_shopping_sku: "0",
      onsite_roi2_shopping_value: "0",
      onsite_roi2_shopping: "0.00",
      billed_cost: "103",
      template_ad_start_time: "2025-10-04 10:01:43",
      template_ad_end_time: "2035-10-02 10:01:43"
    },
    {
      campaign_id: "1845019610772658",
      campaign_name: "SPU - LF06",
      campaign_budget: "30000000",
      campaign_primary_status: "disable",
      template_ad_roas_bid: "2.70",
      cost: "260",
      onsite_roi2_shopping_sku: "0",
      cost_per_onsite_roi2_shopping_sku: "0",
      onsite_roi2_shopping_value: "0",
      onsite_roi2_shopping: "0.00",
      billed_cost: "50",
      template_ad_start_time: "2025-10-04 10:13:29",
      template_ad_end_time: "2035-10-02 10:13:29"
    },
    {
      campaign_id: "1845020000000001",
      campaign_name: "Campaign Test - Paused",
      campaign_budget: "15000000",
      campaign_primary_status: "disable",
      template_ad_roas_bid: "4.50",
      cost: "125000",
      onsite_roi2_shopping_sku: "8",
      cost_per_onsite_roi2_shopping_sku: "15625",
      onsite_roi2_shopping_value: "450000",
      onsite_roi2_shopping: "3.60",
      billed_cost: "125000",
      template_ad_start_time: "2025-09-15 09:00:00",
      template_ad_end_time: "2035-09-13 09:00:00"
    },
    {
      campaign_id: "1845020000000002",
      campaign_name: "Campaign Test - Conflict",
      campaign_budget: "20000000",
      campaign_primary_status: "roi2_mutex_exclusive_product",
      template_ad_roas_bid: "5.20",
      cost: "85000",
      onsite_roi2_shopping_sku: "5",
      cost_per_onsite_roi2_shopping_sku: "17000",
      onsite_roi2_shopping_value: "320000",
      onsite_roi2_shopping: "3.76",
      billed_cost: "85000",
      template_ad_start_time: "2025-09-20 14:30:00",
      template_ad_end_time: "2035-09-18 14:30:00"
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
    const cost = parseFloat(campaign.cost);
    const billedCost = parseFloat(campaign.billed_cost);
    const revenue = parseFloat(campaign.onsite_roi2_shopping_value);
    const orders = parseInt(campaign.onsite_roi2_shopping_sku);
    const budget = parseFloat(campaign.campaign_budget);
    const roi = parseFloat(campaign.onsite_roi2_shopping);
    const targetROAS = parseFloat(campaign.template_ad_roas_bid);

    const cpa = orders > 0 ? cost / orders : 0;
    const aov = orders > 0 ? revenue / orders : 0;
    const spendBudgetRatio = budget > 0 ? (cost / budget) * 100 : 0;
    const billedSpendRatio = cost > 0 ? (billedCost / cost) * 100 : 0;
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
      'delivery_ok': { text: 'Đang chạy', class: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 dark:from-emerald-900/20 dark:to-teal-900/20 dark:text-emerald-400' },
      'disable': { text: 'Tạm dừng', class: 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 dark:from-rose-900/20 dark:to-pink-900/20 dark:text-rose-400' },
      'roi2_mutex_exclusive_product': { text: 'Loại trừ', class: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/20 dark:to-orange-900/20 dark:text-amber-400' }
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
    let filteredData = sampleData;

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredData = filteredData.filter(campaign => campaign.campaign_primary_status === statusFilter);
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
      if (['campaign_budget', 'cost', 'onsite_roi2_shopping_value', 'onsite_roi2_shopping', 'billed_cost'].includes(sortField)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const sortedData = getSortedData();

  // Calculate derived metrics
  const calculateMetrics = () => {
    const totalSpend = sampleData.reduce((sum, campaign) => sum + parseFloat(campaign.cost), 0);
    const totalBilledCost = sampleData.reduce((sum, campaign) => sum + parseFloat(campaign.billed_cost), 0);
    const totalRevenue = sampleData.reduce((sum, campaign) => sum + parseFloat(campaign.onsite_roi2_shopping_value), 0);
    const totalOrders = sampleData.reduce((sum, campaign) => sum + parseInt(campaign.onsite_roi2_shopping_sku), 0);
    const totalBudget = sampleData.reduce((sum, campaign) => sum + parseFloat(campaign.campaign_budget), 0);
    
    const avgROI = totalOrders > 0 ? totalRevenue / totalSpend : 0;
    const avgCPA = totalOrders > 0 ? totalSpend / totalOrders : 0;
    const avgAOV = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const spendBudgetRatio = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
    const billedSpendRatio = totalSpend > 0 ? (totalBilledCost / totalSpend) * 100 : 0;
    
    // Find best/worst campaigns
    const campaignsWithROI = sampleData.filter(c => parseFloat(c.onsite_roi2_shopping_sku) > 0);
    const bestROICampaign = campaignsWithROI.reduce((best, current) => 
      parseFloat(current.onsite_roi2_shopping) > parseFloat(best.onsite_roi2_shopping) ? current : best
    );
    const worstROICampaign = campaignsWithROI.reduce((worst, current) => 
      parseFloat(current.onsite_roi2_shopping) < parseFloat(worst.onsite_roi2_shopping) ? current : worst
    );

    return {
      totalSpend,
      totalBilledCost,
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
    
    sampleData.forEach(campaign => {
      const campaignMetrics = calculateCampaignMetrics(campaign);
      const roi = parseFloat(campaign.onsite_roi2_shopping);
      const cost = parseFloat(campaign.cost);
      const orders = parseInt(campaign.onsite_roi2_shopping_sku);
      
      // ROI alerts
      if (roi < 2 && cost > 50000) {
        alertsList.push({
          type: 'error',
          title: 'ROI Thấp',
          message: `${campaign.campaign_name} có ROI ${roi} < 2 và chi phí cao`,
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
          message: `${campaign.campaign_name} chi phí ${formatCurrency(cost.toString())} nhưng không có đơn hàng`,
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
      const campaign = sampleData.find(c => c.campaign_id === campaignId);
      if (!campaign) return null;
      const campaignMetrics = calculateCampaignMetrics(campaign);
      return {
        ...campaign,
        metrics: campaignMetrics
      };
    }).filter(Boolean);
  };

  const comparisonData = getComparisonData();

  // Export functions
  const exportToCSV = () => {
    const headers = ['Campaign ID', 'Campaign Name', 'Status', 'Budget', 'Cost', 'Orders', 'GMV', 'ROI', 'CPA', 'AOV', 'Spend/Budget %', 'Billed Cost', 'Start Date'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(campaign => {
        const metrics = calculateCampaignMetrics(campaign);
        return [
          campaign.campaign_id,
          `"${campaign.campaign_name}"`,
          campaign.campaign_primary_status,
          campaign.campaign_budget,
          campaign.cost,
          campaign.onsite_roi2_shopping_sku,
          campaign.onsite_roi2_shopping_value,
          campaign.onsite_roi2_shopping,
          metrics.cpa.toFixed(0),
          metrics.aov.toFixed(0),
          metrics.spendBudgetRatio.toFixed(1),
          campaign.billed_cost,
          campaign.template_ad_start_time
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
        setSortField('onsite_roi2_shopping');
        setSortDirection('desc');
        break;
      case 'growth':
        setVisibleColumns(['campaign', 'status', 'orders', 'revenue', 'roi', 'spendBudget']);
        setSortField('onsite_roi2_shopping_sku');
        setSortDirection('desc');
        break;
      case 'cost':
        setVisibleColumns(['campaign', 'status', 'budget', 'cost', 'spendBudget', 'billedCost']);
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

            {/* Enhanced KPI Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              {/* Total Spend */}
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm hover:shadow-md transition-shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng Chi Phí</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                      ₫{metrics.totalSpend.toLocaleString()}
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
                      ₫{metrics.totalRevenue.toLocaleString()}
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
                      CPA: ₫{metrics.avgCPA.toLocaleString()}
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
                      ₫{metrics.avgAOV.toLocaleString()}
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
                          <th className="px-3 py-2 text-right">Spend/Budget %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonData.map((campaign: any) => (
                          <tr key={campaign.campaign_id} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="px-3 py-2">
                              <button 
                                onClick={() => navigate(`/meup/campaign-video/${campaign.campaign_id}`)}
                                className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                              >
                                {campaign.campaign_name}
                              </button>
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800 dark:text-white/90">
                              {formatCurrency(campaign.cost)}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800 dark:text-white/90">
                              {formatCurrency(campaign.onsite_roi2_shopping_value)}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800 dark:text-white/90">
                              {campaign.onsite_roi2_shopping_sku}
                            </td>
                            <td className="px-3 py-2 text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                parseFloat(campaign.onsite_roi2_shopping) >= 3 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : parseFloat(campaign.onsite_roi2_shopping) >= 2
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {campaign.onsite_roi2_shopping}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800 dark:text-white/90">
                              {campaign.metrics.cpa > 0 ? formatCurrency(campaign.metrics.cpa.toString()) : 'N/A'}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800 dark:text-white/90">
                              {campaign.metrics.aov > 0 ? formatCurrency(campaign.metrics.aov.toString()) : 'N/A'}
                            </td>
                            <td className="px-3 py-2 text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                campaign.metrics.spendBudgetRatio > 80 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                  : campaign.metrics.spendBudgetRatio > 50
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              }`}>
                                {campaign.metrics.spendBudgetRatio.toFixed(1)}%
                              </span>
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
                    Doanh Thu vs Chi Phí theo Chiến Dịch
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
                      categories: sampleData.map(c => c.campaign_name.substring(0, 8) + "..."),
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
                          return "₫" + val.toLocaleString('vi-VN');
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
                      data: sampleData.map(c => parseFloat(c.onsite_roi2_shopping_value))
                    },
                    {
                      name: "💸 Chi Phí", 
                      data: sampleData.map(c => parseFloat(c.cost))
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
                    Top {Math.min(5, sampleData.length)} chiến dịch
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
                      categories: sampleData
                        .sort((a, b) => parseFloat(b.onsite_roi2_shopping) - parseFloat(a.onsite_roi2_shopping))
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
                    data: sampleData
                      .sort((a, b) => parseFloat(b.onsite_roi2_shopping) - parseFloat(a.onsite_roi2_shopping))
                      .slice(0, 5)
                      .map(c => parseFloat(c.onsite_roi2_shopping))
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
                    labels: sampleData.map(c => c.campaign_name.substring(0, 8) + "..."),
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
                          return "₫" + val.toLocaleString('vi-VN');
                        }
                      }
                    }
                  }} 
                  series={sampleData.map(c => parseFloat(c.campaign_budget))} 
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
                      categories: sampleData
                        .sort((a, b) => parseFloat(b.onsite_roi2_shopping) - parseFloat(a.onsite_roi2_shopping))
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
                          const campaign = sampleData
                            .sort((a, b) => parseFloat(b.onsite_roi2_shopping) - parseFloat(a.onsite_roi2_shopping))
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
                    data: sampleData
                      .sort((a, b) => parseFloat(b.onsite_roi2_shopping) - parseFloat(a.onsite_roi2_shopping))
                      .slice(0, 5)
                      .map(c => parseFloat(c.onsite_roi2_shopping))
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
                    <option value="delivery_ok">Đang Chạy</option>
                    <option value="disable">Tạm Dừng</option>
                    <option value="roi2_mutex_exclusive_product">Loại Trừ</option>
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
                  onClick={() => setSelectedCampaigns(sortedData.filter(c => parseFloat(c.onsite_roi2_shopping) >= 3).map(c => c.campaign_id))}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
                >
                  Chọn ROI Cao (≥3)
                </button>
                <button
                  onClick={() => setSelectedCampaigns(sortedData.filter(c => c.campaign_primary_status === 'delivery_ok').map(c => c.campaign_id))}
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
                            checked={selectedCampaigns.length === sortedData.length && sortedData.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCampaigns(sortedData.map(c => c.campaign_id));
                              } else {
                                setSelectedCampaigns([]);
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
                        <th className="px-4 py-3">
                          <button 
                            onClick={() => handleSort('campaign_primary_status')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Trạng thái
                            {sortField === 'campaign_primary_status' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            onClick={() => handleSort('campaign_budget')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Ngân sách
                            {sortField === 'campaign_budget' && (
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
                            onClick={() => handleSort('onsite_roi2_shopping_sku')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Đơn hàng
                            {sortField === 'onsite_roi2_shopping_sku' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            onClick={() => handleSort('onsite_roi2_shopping_value')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            GMV
                            {sortField === 'onsite_roi2_shopping_value' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            onClick={() => handleSort('onsite_roi2_shopping')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            ROI
                            {sortField === 'onsite_roi2_shopping' && (
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
                          <span className="flex items-center gap-1">
                            Spend/Budget %
                          </span>
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            onClick={() => handleSort('billed_cost')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Billed Cost
                            {sortField === 'billed_cost' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3 whitespace-nowrap">
                          <button 
                            onClick={() => handleSort('template_ad_start_time')}
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Ngày bắt đầu
                            {sortField === 'template_ad_start_time' && (
                              <span className="text-blue-500">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                      </tr>
                    </thead>
                <tbody>
                  {sortedData.map((campaign, index) => {
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
                              onClick={() => navigate(`/meup/campaign-video/${campaign.campaign_id}`)}
                              className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                            >
                              {campaign.campaign_name}
                            </button>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {campaign.campaign_id}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(campaign.campaign_primary_status)}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {formatCurrency(campaign.campaign_budget)}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {formatCurrency(campaign.cost)}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {campaign.onsite_roi2_shopping_sku}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {formatCurrency(campaign.onsite_roi2_shopping_value)}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            parseFloat(campaign.onsite_roi2_shopping) >= 3 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : parseFloat(campaign.onsite_roi2_shopping) >= 2
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {campaign.onsite_roi2_shopping}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {campaignMetrics.cpa > 0 ? formatCurrency(campaignMetrics.cpa.toString()) : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {campaignMetrics.aov > 0 ? formatCurrency(campaignMetrics.aov.toString()) : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            campaignMetrics.spendBudgetRatio > 80 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : campaignMetrics.spendBudgetRatio > 50
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {campaignMetrics.spendBudgetRatio.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {formatCurrency(campaign.billed_cost)}
                        </td>
                        <td className="px-4 py-4 text-gray-800 dark:text-white/90">
                          {formatDate(campaign.template_ad_start_time)}
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
                Hiển thị {sortedData.length} chiến dịch
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
                  {currentPage}
                </span>
                <button 
                  onClick={() => setCurrentPage(Math.min(Math.ceil(sortedData.length / 10), currentPage + 1))}
                  disabled={currentPage >= Math.ceil(sortedData.length / 10)}
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
                    Tổng Doanh Thu
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
                      categories: [
                        "01/09", "02/09", "03/09", "04/09", "05/09", "06/09", "07/09", "08/09", "09/09", "10/09",
                        "11/09", "12/09", "13/09", "14/09", "15/09", "16/09", "17/09", "18/09", "19/09", "20/09",
                        "21/09", "22/09", "23/09", "24/09", "25/09", "26/09", "27/09", "28/09", "29/09", "30/09"
                      ],
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
                      y: { formatter: (val: number) => `₫${val.toLocaleString()}` },
                    },
                  }} 
                  series={[{
                    name: "Tổng Doanh Thu",
                    data: [
                      45000000, 52000000, 48000000, 61000000, 55000000, 67000000, 72000000, 68000000, 95000000, 88000000,
                      75000000, 82000000, 78000000, 85000000, 90000000, 87000000, 92000000, 88000000, 85000000, 79000000,
                      76000000, 82000000, 78000000, 85000000, 88000000, 92000000, 89000000, 95000000, 87000000, 82000000
                    ],
                  }]} 
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
                      categories: [
                        "01/09", "02/09", "03/09", "04/09", "05/09", "06/09", "07/09", "08/09", "09/09", "10/09",
                        "11/09", "12/09", "13/09", "14/09", "15/09", "16/09", "17/09", "18/09", "19/09", "20/09",
                        "21/09", "22/09", "23/09", "24/09", "25/09", "26/09", "27/09", "28/09", "29/09", "30/09"
                      ],
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
                      y: { formatter: (val: number) => `₫${val.toLocaleString()}` },
                    },
                  }} 
                  series={[{
                    name: "Tổng Chi Phí",
                    data: [
                      15000000, 18000000, 16000000, 20000000, 18000000, 22000000, 24000000, 22000000, 30000000, 28000000,
                      25000000, 27000000, 26000000, 28000000, 30000000, 29000000, 31000000, 29000000, 28000000, 26000000,
                      25000000, 27000000, 26000000, 28000000, 29000000, 31000000, 30000000, 32000000, 29000000, 27000000
                    ],
                  }]} 
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
                      categories: [
                        "01/09", "02/09", "03/09", "04/09", "05/09", "06/09", "07/09", "08/09", "09/09", "10/09",
                        "11/09", "12/09", "13/09", "14/09", "15/09", "16/09", "17/09", "18/09", "19/09", "20/09",
                        "21/09", "22/09", "23/09", "24/09", "25/09", "26/09", "27/09", "28/09", "29/09", "30/09"
                      ],
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
                    data: [
                      3.0, 2.9, 3.0, 3.1, 3.1, 3.0, 3.0, 3.1, 3.2, 3.1,
                      3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0,
                      3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0
                    ],
                  }]} 
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
                      categories: [
                        "01/09", "02/09", "03/09", "04/09", "05/09", "06/09", "07/09", "08/09", "09/09", "10/09",
                        "11/09", "12/09", "13/09", "14/09", "15/09", "16/09", "17/09", "18/09", "19/09", "20/09",
                        "21/09", "22/09", "23/09", "24/09", "25/09", "26/09", "27/09", "28/09", "29/09", "30/09"
                      ],
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
                      y: { formatter: (val: number) => `₫${val.toLocaleString()}` },
                    },
                  }} 
                  series={[{
                    name: "CPA",
                    data: [
                      150000, 180000, 160000, 200000, 180000, 220000, 240000, 220000, 300000, 280000,
                      250000, 270000, 260000, 280000, 300000, 290000, 310000, 290000, 280000, 260000,
                      250000, 270000, 260000, 280000, 290000, 310000, 300000, 320000, 290000, 270000
                    ],
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
