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
      
      <div className="mx-auto max-w-screen-2xl">
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
                   <KOCVideoProgressCard />
                 </div>
                 
                 {/* Right side - 4 KPI Cards in responsive grid */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-3 xl:gap-4">
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
               </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-4 xl:gap-6 lg:grid-cols-2">
        <VolumeChart />
        <KOCSearchChart />
        <KOCAgreeChart />
        <KOCVideoChart />
      </div>

      {/* Tables Section */}
      <div className="mt-6 space-y-6">
        <BookingReportTable />
        <KOCVideoLinksTable />
      </div>
      </div>
    </>
  );
};

export default BookingDashboard;
