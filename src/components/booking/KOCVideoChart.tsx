import React from 'react';
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const KOCVideoChart: React.FC = () => {
  const data = [
    { date: "01/10/2024", value: 1 },
    { date: "02/10/2024", value: 2 },
    { date: "03/10/2024", value: 3 },
    { date: "04/10/2024", value: 5 },
    { date: "05/10/2024", value: 4 },
    { date: "06/10/2024", value: 6 },
    { date: "07/10/2024", value: 5 },
    { date: "08/10/2024", value: 7 },
    { date: "09/10/2024", value: 8 },
    { date: "10/10/2024", value: 9 },
    { date: "11/10/2024", value: 7 },
    { date: "12/10/2024", value: 6 },
    { date: "13/10/2024", value: 5 },
    { date: "14/10/2024", value: 6 },
    { date: "15/10/2024", value: 7 },
    { date: "16/10/2024", value: 5 },
    { date: "17/10/2024", value: 4 },
    { date: "18/10/2024", value: 3 },
    { date: "19/10/2024", value: 2 },
    { date: "20/10/2024", value: 2 },
    { date: "21/10/2024", value: 1 },
    { date: "22/10/2024", value: 1 },
    { date: "23/10/2024", value: 1 },
    { date: "24/10/2024", value: 1 },
    { date: "25/10/2024", value: 2 },
    { date: "26/10/2024", value: 2 },
    { date: "27/10/2024", value: 2 },
    { date: "28/10/2024", value: 1 },
    { date: "29/10/2024", value: 1 },
    { date: "30/10/2024", value: 1 },
    { date: "31/10/2024", value: 1 }
  ];

  const chartOptions: ApexOptions = {
    colors: ["#F59E0B"],
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
      enabled: false,
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
        gradientToColors: ["#FBBF24"],
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
      name: "KOC làm video",
      data: data.map(item => item.value)
    }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
        KOC LÀM VIDEO THEO NGÀY
      </h3>

      <Chart options={chartOptions} series={chartSeries} type="bar" height={280} />
    </div>
  );
};

export default KOCVideoChart;
