import React, { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';

// Interface cho dữ liệu đơn hàng gốc
interface OrderRecord {
  "ID đơn hàng": number;
  "ID sản phẩm": number;
  "Tên sản phẩm": string;
  "Sku": string;
  "Id Sku": number;
  "Sku người bán": string;
  "Giá": number;
  "Payment Amount": number;
  "Đơn vị tiền tệ": string;
  "Số lượng": number;
  "Phương thức thanh toán": string;
  "Trạng thái đơn hàng": string;
  "Tên người dùng nhà sáng tạo": string;
  "Loại nội dung": string;
  "Id nội dung": string;
  "commission model": string;
  "Tỷ lệ khấu trừ Thuế TNCN": number;
  "Thuế TNCN ước tính": number;
  "Thuế TNCN thực tế": number;
  "Tỷ lệ hoa hồng tiêu chuẩn": number;
  "Cơ sở hoa hồng ước tính": number;
  "Thanh toán hoa hồng tiêu chuẩn ước tính": number;
  "Cơ sở hoa hồng thực tế": number;
  "Thanh toán hoa hồng thực tế": number;
  "Tỷ lệ hoa hồng Quảng cáo cửa hàng": string;
  "Thanh toán hoa hồng Quảng cáo cửa hàng ước tính": string;
  "Thanh toán hoa hồng Quảng cáo cửa hàng thực tế": string;
  "Thưởng đồng chi trả cho nhà sáng tạo ước tính": string;
  "Thưởng đồng chi trả cho nhà sáng tạo thực tế": string;
  "Trả hàng & hoàn tiền": number;
  "Hoàn tiền": number;
  "Thời gian đã tạo": string;
  "Thời gian thanh toán": string;
  "Thời gian sẵn sàng vận chuyển": string;
  "Order Delivery Time": string;
  "Thời gian hoàn thành đơn hàng": string;
  "Thời gian hoa hồng đã thanh toán": string;
  "Platform": string;
}

// Interface cho dữ liệu đã xử lý
interface ProcessedOrder {
  orderId: string;
  creatorUsername: string;
  productId: string;
  productName: string;
  orderStatus: 'completed' | 'cancelled';
  paymentAmount: number;
  commission: number;
  contentType: 'Video' | 'Display' | 'External';
  returnAmount: number;
  refundAmount: number;
  orderDate: string;
}

// Interface cho thống kê creator
interface CreatorStats {
  creatorName: string;
  totalOrders: number;
  totalRevenue: number;
  completionRate: number;
  cancelRate: number;
  returnRate: number;
  video: { orders: number; revenue: number; completionRate: number; cancelRate: number; returnRate: number };
  display: { orders: number; revenue: number; completionRate: number; cancelRate: number; returnRate: number };
  external: { orders: number; revenue: number; completionRate: number; cancelRate: number; returnRate: number };
}

type SortField = 'creatorName' | 'totalOrders' | 'totalRevenue' | 'video.orders' | 'video.revenue' | 'display.orders' | 'display.revenue' | 'external.orders';
type SortDirection = 'asc' | 'desc';

const CreatorAnalyticsNew: React.FC = () => {
  const [rawData, setRawData] = useState<OrderRecord[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedOrder[]>([]);
  const [creatorStats, setCreatorStats] = useState<CreatorStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('creatorName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Load data từ JSON file
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/creator_order.json');
      const data: OrderRecord[] = await response.json();
      setRawData(data);
      processData(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (data: OrderRecord[]) => {
    const processed: ProcessedOrder[] = data.map(record => {
      // Map order status
      const orderStatus: 'completed' | 'cancelled' = 
        record["Trạng thái đơn hàng"] === "Đã hoàn thành" ? 'completed' : 'cancelled';

      // Map content type
      let contentType: 'Video' | 'Display' | 'External' = 'Video';
      switch (record["Loại nội dung"]) {
        case "Trưng bày":
          contentType = 'Display';
          break;
        case "Phát trực tiếp":
          contentType = 'External';
          break;
        default:
          contentType = 'Video';
      }

      return {
        orderId: record["ID đơn hàng"].toString(),
        creatorUsername: record["Tên người dùng nhà sáng tạo"],
        productId: record["ID sản phẩm"].toString(),
        productName: record["Tên sản phẩm"],
        orderStatus,
        paymentAmount: record["Payment Amount"] || 0,
        commission: record["Thanh toán hoa hồng thực tế"] || 0,
        contentType,
        returnAmount: record["Trả hàng & hoàn tiền"] || 0,
        refundAmount: record["Hoàn tiền"] || 0,
        orderDate: record["Thời gian đã tạo"]
      };
    });

    setProcessedData(processed);
    calculateCreatorStats(processed);
  };

  const calculateCreatorStats = (data: ProcessedOrder[]) => {
    const creatorMap = new Map<string, CreatorStats>();

    // Group by creator
    data.forEach(order => {
      const creatorName = order.creatorUsername;
      
      if (!creatorMap.has(creatorName)) {
        creatorMap.set(creatorName, {
          creatorName,
          totalOrders: 0,
          totalRevenue: 0,
          completionRate: 0,
          cancelRate: 0,
          returnRate: 0,
          video: { orders: 0, revenue: 0, completionRate: 0, cancelRate: 0, returnRate: 0 },
          display: { orders: 0, revenue: 0, completionRate: 0, cancelRate: 0, returnRate: 0 },
          external: { orders: 0, revenue: 0, completionRate: 0, cancelRate: 0, returnRate: 0 }
        });
      }

      const creator = creatorMap.get(creatorName)!;
      
      // Update total stats
      creator.totalOrders++;
      creator.totalRevenue += order.paymentAmount;

      // Update content type stats
      const contentStats = creator[order.contentType.toLowerCase() as keyof Pick<CreatorStats, 'video' | 'display' | 'external'>];
      contentStats.orders++;
      contentStats.revenue += order.paymentAmount;
    });

    // Calculate rates for each creator
    const stats = Array.from(creatorMap.values()).map(creator => {
      const creatorOrders = data.filter(order => order.creatorUsername === creator.creatorName);
      const completedOrders = creatorOrders.filter(order => order.orderStatus === 'completed');
      const cancelledOrders = creatorOrders.filter(order => order.orderStatus === 'cancelled');
      const returnedOrders = creatorOrders.filter(order => order.returnAmount > 0);

      // Calculate overall rates
      creator.completionRate = creator.totalOrders > 0 ? (completedOrders.length / creator.totalOrders) * 100 : 0;
      creator.cancelRate = creator.totalOrders > 0 ? (cancelledOrders.length / creator.totalOrders) * 100 : 0;
      creator.returnRate = creator.totalOrders > 0 ? (returnedOrders.length / creator.totalOrders) * 100 : 0;

      // Calculate rates for each content type
      ['video', 'display', 'external'].forEach(contentType => {
        const contentOrders = creatorOrders.filter(order => 
          order.contentType.toLowerCase() === contentType
        );
        const contentCompleted = contentOrders.filter(order => order.orderStatus === 'completed');
        const contentCancelled = contentOrders.filter(order => order.orderStatus === 'cancelled');
        const contentReturned = contentOrders.filter(order => order.returnAmount > 0);

        const contentStats = creator[contentType as keyof Pick<CreatorStats, 'video' | 'display' | 'external'>];
        contentStats.completionRate = contentOrders.length > 0 ? (contentCompleted.length / contentOrders.length) * 100 : 0;
        contentStats.cancelRate = contentOrders.length > 0 ? (contentCancelled.length / contentOrders.length) * 100 : 0;
        contentStats.returnRate = contentOrders.length > 0 ? (contentReturned.length / contentOrders.length) * 100 : 0;
      });

      return creator;
    });

    // Sort by creator name
    stats.sort((a, b) => a.creatorName.localeCompare(b.creatorName));
    setCreatorStats(stats);
  };

  // Format currency like TikTok
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K';
    } else {
      return amount.toLocaleString('vi-VN');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Get nested value for sorting
  const getNestedValue = (obj: CreatorStats, field: SortField): number | string => {
    if (field === 'creatorName') return obj.creatorName;
    if (field === 'totalOrders') return obj.totalOrders;
    if (field === 'totalRevenue') return obj.totalRevenue;
    
    const [parent, child] = field.split('.');
    if (parent === 'video') return obj.video[child as keyof typeof obj.video] as number;
    if (parent === 'display') return obj.display[child as keyof typeof obj.display] as number;
    if (parent === 'external') return obj.external[child as keyof typeof obj.external] as number;
    
    return 0;
  };

  // Filter data by search term
  const filteredData = creatorStats.filter(creator => 
    creator.creatorName.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    const numA = Number(aValue);
    const numB = Number(bValue);
    
    return sortDirection === 'asc' ? numA - numB : numB - numA;
  });

  // Paginate data
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Creator Analytics" />
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng Creators</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{creatorStats.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{creatorStats.reduce((sum, creator) => sum + creator.totalOrders, 0)}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(creatorStats.reduce((sum, creator) => sum + creator.totalRevenue, 0))}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {creatorStats.length > 0 
                    ? ((creatorStats.reduce((sum, creator) => sum + creator.completionRate, 0) / creatorStats.length)).toFixed(1) + '%'
                    : '0%'
                  }
                </p>
              </div>
              <div className="p-3 bg-blue-light-100 dark:bg-blue-light-900/20 rounded-xl">
                <svg className="w-6 h-6 text-blue-light-600 dark:text-blue-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Performance Table - Redesigned */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Báo cáo hiệu suất Creator
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Phân tích theo loại nội dung: Video, Trưng bày, Phát trực tiếp
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm Creator..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                {/* Main Header Row */}
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th rowSpan={2} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 w-[150px] bg-gray-100 dark:bg-gray-700/50">
                    Creator
                  </th>
                  <th colSpan={2} className="px-4 py-3 text-center text-sm font-semibold text-white border border-blue-300 dark:border-blue-600 bg-gradient-to-r from-blue-500 to-blue-600">
                    Video
                  </th>
                  <th colSpan={2} className="px-4 py-3 text-center text-sm font-semibold text-white border border-green-300 dark:border-green-600 bg-gradient-to-r from-green-500 to-green-600">
                    Trưng bày
                  </th>
                  <th colSpan={1} className="px-4 py-3 text-center text-sm font-semibold text-white border border-purple-300 dark:border-purple-600 bg-gradient-to-r from-purple-500 to-purple-600">
                    Phát trực tiếp
                  </th>
                  <th colSpan={2} className="px-4 py-3 text-center text-sm font-semibold text-white border border-orange-300 dark:border-orange-600 bg-gradient-to-r from-orange-500 to-orange-600">
                    Tổng cộng
                  </th>
                </tr>
                {/* Sub Header Row */}
                <tr className="bg-gray-100/50 dark:bg-gray-800/20">
                  {/* Video columns */}
                  <th 
                    className="px-2 py-2 text-center text-xs font-medium text-blue-800 border border-blue-200 w-[80px] bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors select-none"
                    onClick={() => handleSort('video.orders')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Số đơn
                      {sortField === 'video.orders' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {sortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-2 py-2 text-center text-xs font-medium text-blue-800 border border-blue-200 w-[100px] bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors select-none"
                    onClick={() => handleSort('video.revenue')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tổng giá trị
                      {sortField === 'video.revenue' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {sortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  
                  {/* Display columns */}
                  <th 
                    className="px-2 py-2 text-center text-xs font-medium text-green-800 border border-green-200 w-[80px] bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors select-none"
                    onClick={() => handleSort('display.orders')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Số đơn
                      {sortField === 'display.orders' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {sortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-2 py-2 text-center text-xs font-medium text-green-800 border border-green-200 w-[100px] bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors select-none"
                    onClick={() => handleSort('display.revenue')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tổng giá trị
                      {sortField === 'display.revenue' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {sortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  
                  {/* External columns */}
                  <th 
                    className="px-2 py-2 text-center text-xs font-medium text-purple-800 border border-purple-200 w-[80px] bg-purple-50 dark:bg-purple-900/20 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors select-none"
                    onClick={() => handleSort('external.orders')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Số đơn
                      {sortField === 'external.orders' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {sortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  
                  {/* Tổng cộng columns */}
                  <th 
                    className="px-2 py-2 text-center text-xs font-medium text-orange-800 border border-orange-200 w-[80px] bg-orange-50 dark:bg-orange-900/20 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors select-none"
                    onClick={() => handleSort('totalOrders')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Số đơn
                      {sortField === 'totalOrders' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {sortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-2 py-2 text-center text-xs font-medium text-orange-800 border border-orange-200 w-[120px] bg-orange-50 dark:bg-orange-900/20 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors select-none"
                    onClick={() => handleSort('totalRevenue')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tổng giá trị
                      {sortField === 'totalRevenue' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {sortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((creator, index) => (
                  <tr key={creator.creatorName} className={`${index % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-800/10' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100/50 dark:hover:bg-gray-800/20 transition-colors`}>
                    {/* Creator Name with Tooltip */}
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-[150px]">
                      <div className="relative group">
                        <span className="truncate block max-w-[120px]">
                          {creator.creatorName}
                        </span>
                        <div className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999]">
                          {creator.creatorName}
                        </div>
                      </div>
                    </td>
                    
                    {/* Video Stats */}
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-[80px]">
                      {creator.video.orders > 0 ? creator.video.orders : '0'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-[100px]">
                      {creator.video.revenue > 0 ? formatCurrency(creator.video.revenue) : '0'}
                    </td>
                    
                    {/* Display Stats */}
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-[80px]">
                      {creator.display.orders > 0 ? creator.display.orders : '0'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-[100px]">
                      {creator.display.revenue > 0 ? formatCurrency(creator.display.revenue) : '0'}
                    </td>
                    
                    {/* External Stats */}
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-[80px]">
                      {creator.external.orders > 0 ? creator.external.orders : '0'}
                    </td>
                    
                    {/* Total Stats */}
                    <td className="px-2 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 text-center border border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/20 w-[80px]">
                      {creator.totalOrders}
                    </td>
                    <td className="px-2 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 text-center border border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/20 w-[120px]">
                      {formatCurrency(creator.totalRevenue)}
                    </td>
                  </tr>
                ))}
                
                {/* Total Row */}
                <tr className="bg-gray-100 dark:bg-gray-800/50 font-semibold">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700/50">
                    Tổng cộng ({creatorStats.length} creators)
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20">
                    {creatorStats.reduce((sum, creator) => sum + creator.video.orders, 0)}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20">
                    {formatCurrency(creatorStats.reduce((sum, creator) => sum + creator.video.revenue, 0))}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20">
                    {creatorStats.reduce((sum, creator) => sum + creator.display.orders, 0)}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20">
                    {formatCurrency(creatorStats.reduce((sum, creator) => sum + creator.display.revenue, 0))}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20">
                    {creatorStats.reduce((sum, creator) => sum + creator.external.orders, 0)}
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 text-center border border-gray-200 dark:border-gray-700 bg-blue-100 dark:bg-blue-800/50">
                    {creatorStats.reduce((sum, creator) => sum + creator.totalOrders, 0)}
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 text-center border border-gray-200 dark:border-gray-700 bg-blue-100 dark:bg-blue-800/50">
                    {formatCurrency(creatorStats.reduce((sum, creator) => sum + creator.totalRevenue, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {sortedData.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, sortedData.length)} trong tổng số {sortedData.length} creators
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Trước
                  </button>
                  {Array.from({ length: Math.ceil(sortedData.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        page === currentPage
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(sortedData.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(sortedData.length / itemsPerPage)}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreatorAnalyticsNew;
