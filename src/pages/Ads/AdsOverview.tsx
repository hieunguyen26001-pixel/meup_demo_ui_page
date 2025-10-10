import React from "react";
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

const AdsOverview: React.FC = () => {
  // Revenue Chart Data
  const revenueChartOptions: ApexOptions = {
    colors: ["#F59E0B"],
    chart: {
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
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
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
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
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
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
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
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
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
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
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
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
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
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
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
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

  return (
    <>
      <PageMeta title="Tổng quan Quảng cáo - meup" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
                  1,508,263,278
                </h4>
              </div>
              <Badge color="success">
                <ArrowUpIcon />
                12.5%
              </Badge>
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
                  14,097
                </h4>
              </div>
              <Badge color="success">
                <ArrowUpIcon />
                8.2%
              </Badge>
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
                  276,493,081
                </h4>
              </div>
              <Badge color="error">
                <ArrowDownIcon />
                3.1%
              </Badge>
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
                  19,858
                </h4>
              </div>
              <Badge color="error">
                <ArrowDownIcon />
                5.7%
              </Badge>
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

