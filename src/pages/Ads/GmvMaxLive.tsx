import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import DateRangePicker from "../../components/ui/DateRangePicker";

const GmvMaxLive: React.FC = () => {
  // Date picker state
  const [dateRange, setDateRange] = useState<Date[]>([]);

  const handleDateRangeChange = (dates: Date[]) => {
    setDateRange(dates);
    // Here you can add logic to filter livestream data based on selected date range
    console.log('Selected date range:', dates);
  };
  return (
    <>
      <PageMeta title="GMV Max Live - meup" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            GMV Max Live
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Theo dõi và quản lý livestream GMV Max
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-start">
              <DateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                placeholder="Chọn khoảng thời gian"
                className="w-80"
              />
            </div>
          </div>
        </div>

        {/* Content placeholder */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Livestream hiện tại
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Người xem</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">2,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">GMV hiện tại</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">₫8,500,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Thời gian</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">2h 15m</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Thống kê Live
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Số livestream</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tổng GMV</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">₫45,200,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">GMV trung bình</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">₫1,883,333</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Tương tác
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Likes</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">15,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Comments</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">3,421</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Shares</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">892</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GmvMaxLive;

