import React from 'react';
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const VideoDailyStatsChart: React.FC = () => {
  const data = [
    { date: "10/2025", value: 15 },
    { date: "10/2025", value: 11 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 },
    { date: "10/2025", value: 0 }
  ];

  const chartOptions: ApexOptions = {
    colors: ["#3B82F6"],
    chart: {
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
      type: "bar",
      height: 280,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#FFFFFF"],
        fontSize: "12px",
        fontWeight: "bold",
      },
      offsetY: -20,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data.map(item => item.date),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "11px",
          colors: ["#6B7280"],
        },
      },
    },
    legend: {
      show: false,
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
      },
      min: 0,
      max: 16,
      tickAmount: 4,
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
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#60A5FA"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toString(),
      },
    },
  };

  const chartSeries = [
    {
      name: "Video",
      data: data.map(item => item.value)
    }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
        Thống kê hàng ngày
      </h3>

      <Chart options={chartOptions} series={chartSeries} type="bar" height={280} />
    </div>
  );
};

export default VideoDailyStatsChart;
