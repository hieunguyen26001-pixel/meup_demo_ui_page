import React, { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import DateRangePicker from '../../components/ui/DateRangePicker';
import { 
  GridIcon, 
  ChatIcon, 
  CheckCircleIcon, 
  VideoIcon 
} from '../../icons';
import KPICard from '../../components/booking/KPICard';
import VideoProgressCard from '../../components/video/VideoProgressCard';
import VideoVolumeChart from '../../components/video/VideoVolumeChart';
import VideoDailyStatsChart from '../../components/video/VideoDailyStatsChart';

const VideoDashboard: React.FC = () => {
  // Date picker state
  const [dateRange, setDateRange] = useState<Date[]>([]);

  const handleDateRangeChange = (dates: Date[]) => {
    setDateRange(dates);
    console.log('Selected date range:', dates);
  };

  return (
    <>
      <PageMeta title="Quản lý Video - meup" description="Dashboard tổng quan và quản lý video" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        {/* Date Range Filter */}
        <div className="mb-4 sm:mb-6 lg:mb-4 xl:mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-4 xl:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-start">
              <DateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                placeholder="Chọn khoảng thời gian"
                className="w-full sm:w-80"
              />
            </div>
          </div>
        </div>

        {/* Top Section - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 sm:mb-6 lg:mb-4 xl:mb-6">
          {/* Left side - Progress Card */}
          <div>
            <VideoProgressCard />
          </div>
          
          {/* Right side - 4 KPI Cards in responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-3 xl:gap-4">
            <KPICard
              title="TỔNG VIDEO"
              value={156}
              icon={VideoIcon}
              color="blue"
            />
            <KPICard
              title="VIDEO HOÀN THÀNH"
              value={128}
              icon={CheckCircleIcon}
              color="green"
            />
            <KPICard
              title="VIDEO ĐANG XỬ LÝ"
              value={18}
              icon={GridIcon}
              color="orange"
            />
            <KPICard
              title="VIDEO CHỜ DUYỆT"
              value={10}
              icon={ChatIcon}
              color="purple"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-4 xl:gap-6 lg:grid-cols-2">
          <VideoVolumeChart />
          <VideoDailyStatsChart />
        </div>
      </div>
    </>
  );
};

export default VideoDashboard;
