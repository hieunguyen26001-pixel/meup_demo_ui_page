import React from 'react';
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const KOCSearchChart: React.FC = () => {
  const data = [
    { date: "01/10", value: 5 },
    { date: "02/10", value: 8 },
    { date: "03/10", value: 12 },
    { date: "04/10", value: 18 },
    { date: "05/10", value: 15 },
    { date: "06/10", value: 22 },
    { date: "07/10", value: 19 },
    { date: "08/10", value: 25 },
    { date: "09/10", value: 28 },
    { date: "10/10", value: 30 },
    { date: "11/10", value: 27 },
    { date: "12/10", value: 24 },
    { date: "13/10", value: 21 },
    { date: "14/10", value: 26 },
    { date: "15/10", value: 29 },
    { date: "16/10", value: 23 },
    { date: "17/10", value: 20 },
    { date: "18/10", value: 17 },
    { date: "19/10", value: 14 },
    { date: "20/10", value: 11 },
    { date: "21/10", value: 8 },
    { date: "22/10", value: 6 },
    { date: "23/10", value: 4 },
    { date: "24/10", value: 7 },
    { date: "25/10", value: 9 },
    { date: "26/10", value: 12 },
    { date: "27/10", value: 10 },
    { date: "28/10", value: 8 },
    { date: "29/10", value: 6 },
    { date: "30/10", value: 4 },
    { date: "31/10", value: 2 }
  ];

  const chartOptions: ApexOptions = {
    colors: ["#3B82F6"],
    chart: {
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
      type: "line",
      height: 220,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      line: {
        strokeWidth: 3,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
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
          fontSize: "10px",
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
        opacityFrom: 0.8,
        opacityTo: 0.1,
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
      name: "Tìm kiếm KOC",
      data: data.map(item => item.value)
    }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
        TÌM KIẾM KOC THEO NGÀY
      </h3>

      <Chart options={chartOptions} series={chartSeries} type="line" height={220} />
    </div>
  );
};

export default KOCSearchChart;
