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
import KOCVideoProgressCard from '../../components/booking/KOCVideoProgressCard';
import VolumeChart from '../../components/booking/VolumeChart';
import KOCSearchChart from '../../components/booking/KOCSearchChart';
import KOCAgreeChart from '../../components/booking/KOCAgreeChart';
import KOCVideoChart from '../../components/booking/KOCVideoChart';
import BookingReportTable from '../../components/booking/BookingReportTable';
import KOCVideoLinksTable from '../../components/booking/KOCVideoLinksTable';

const BookingDashboard: React.FC = () => {
  // Date picker state
  const [dateRange, setDateRange] = useState<Date[]>([]);

  const handleDateRangeChange = (dates: Date[]) => {
    setDateRange(dates);
    // Here you can add logic to filter data based on selected date range
    console.log('Selected date range:', dates);
  };

  return (
    <>
      <PageMeta title="Quản lý Booking Code - meup" description="Dashboard tổng quan và quản lý các booking code KOC" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
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

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard
          title="TÌM KIẾM KOC"
          value={128}
          icon={GridIcon}
          color="blue"
        />
        <KPICard
          title="TỔNG KOC PHẢN HỒI"
          value={71}
          icon={ChatIcon}
          color="green"
        />
        <KPICard
          title="TỔNG KOC ĐỒNG Ý"
          value={34}
          icon={CheckCircleIcon}
          color="orange"
        />
        <KPICard
          title="TỔNG KOC ĐÃ LÀM VIDEO"
          value={28}
          icon={VideoIcon}
          color="purple"
        />
      </div>

      {/* Progress Card - Full width */}
      <div className="mb-6">
        <KOCVideoProgressCard />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <VolumeChart />
        <KOCSearchChart />
        <KOCAgreeChart />
        <KOCVideoChart />
      </div>
      </div>
    </>
  );
};

export default BookingDashboard;
