import React from 'react';
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const VideoVolumeChart: React.FC = () => {
  const data = [
    { name: "HieuNM", percentage: 35, value: 35 },
    { name: "MinhTT", percentage: 28, value: 28 },
    { name: "LinhLV", percentage: 20, value: 20 },
    { name: "DungPT", percentage: 17, value: 17 }
  ];

  const chartOptions: ApexOptions = {
    colors: ["#6366F1", "#EC4899", "#F59E0B", "#10B981"],
    chart: {
      fontFamily: "Be Vietnam Pro, Inter, Outfit, sans-serif",
      type: "pie",
      height: 220,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "bold",
              color: "#374151",
              formatter: function (val) {
                return val + "%";
              },
            },
            total: {
              show: false,
            },
          },
        },
      },
    },
    labels: data.map(item => item.name),
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val, opts) {
          return val + "%";
        },
      },
    },
  };

  const chartSeries = data.map(item => item.percentage);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        TỈ TRỌNG KHỐI LƯỢNG CÔNG VIỆC THEO NHÂN SỰ
      </h3>

      <div className="flex flex-col sm:flex-row items-center h-full -mt-5 gap-4 sm:gap-0">
        {/* Chart */}
        <div className="flex-1 w-full sm:w-auto">
          <Chart options={chartOptions} series={chartSeries} type="pie" height={220} />
        </div>

        {/* Legend */}
        <div className="sm:ml-4 flex-1 w-full sm:w-auto">
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: chartOptions.colors![index] }}
                  ></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800 dark:text-white">
                    {item.value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoVolumeChart;
