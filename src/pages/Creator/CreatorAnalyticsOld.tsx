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

// Interface cho dữ liệu Creator đã tổng hợp
interface CreatorStats {
  creatorName: string;
  totalOrders: number;
  totalRevenue: number;
  completionRate: number;
  cancelRate: number;
  returnRate: number;
  video: {
    orders: number;
    revenue: number;
    completionRate: number;
    cancelRate: number;
    returnRate: number;
  };
  display: {
    orders: number;
    revenue: number;
    completionRate: number;
    cancelRate: number;
    returnRate: number;
  };
  external: {
    orders: number;
    revenue: number;
    completionRate: number;
    cancelRate: number;
    returnRate: number;
  };
}

interface CreatorCommission {
  creatorName: string;
  totalOrders: number;
  totalRevenue: number;
  standardCommission: {
    estimated: number;
    actual: number;
    total: number;
  };
  advertisingCommission: {
    estimated: number;
    actual: number;
    total: number;
  };
  totalCommission: number;
  orders: OrderRecord[];
}

type SortField = 
  | 'creatorName' 
  | 'totalOrders' 
  | 'totalRevenue' 
  | 'completionRate' 
  | 'cancelRate'
  | 'video.orders'
  | 'video.revenue'
  | 'video.completionRate'
  | 'video.cancelRate'
  | 'display.orders'
  | 'display.revenue'
  | 'display.completionRate'
  | 'display.cancelRate'
  | 'external.orders';

type SortDirection = 'asc' | 'desc';

const CreatorAnalytics: React.FC = () => {
  const [rawData, setRawData] = useState<OrderRecord[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedOrder[]>([]);
  const [creatorStats, setCreatorStats] = useState<CreatorStats[]>([]);
  const [creatorCommissions, setCreatorCommissions] = useState<CreatorCommission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommissionLoading, setIsCommissionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('creatorName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Fixed theme colors (blue)
  const themeColors = {
    primary: 'blue',
    primary50: 'blue-50',
    primary100: 'blue-100',
    primary200: 'blue-200',
    primary300: 'blue-300',
    primary400: 'blue-400',
    primary500: 'blue-500',
    primary600: 'blue-600',
    primary700: 'blue-700',
    primary800: 'blue-800',
    primary900: 'blue-900',
  };

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

  // Process Commission data - Optimized version
  const processCommissionData = (data: OrderRecord[]): CreatorCommission[] => {
    console.log('Starting commission data processing with', data.length, 'records');
    const creatorMap = new Map<string, {
      orders: OrderRecord[];
      totalRevenue: number;
      standardCommission: {
        estimated: number;
        actual: number;
      };
      advertisingCommission: {
        estimated: number;
        actual: number;
      };
    }>();

    // Helper function to safely parse number
    const parseNumber = (value: any): number => {
      if (value === null || value === undefined || value === '') return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    // Process data in batches for better performance
    const batchSize = 1000;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      batch.forEach(order => {
        const creatorName = order['Tên người dùng nhà sáng tạo'];
        if (!creatorName) return;

        if (!creatorMap.has(creatorName)) {
          creatorMap.set(creatorName, {
            orders: [],
            totalRevenue: 0,
            standardCommission: {
              estimated: 0,
              actual: 0,
            },
            advertisingCommission: {
              estimated: 0,
              actual: 0,
            },
          });
        }

        const creator = creatorMap.get(creatorName)!;
        creator.orders.push(order);
        creator.totalRevenue += parseNumber(order['Giá']);
        
        // Tính hoa hồng tiêu chuẩn
        const standardEstimated = parseNumber(order['Thanh toán hoa hồng tiêu chuẩn ước tính']);
        const standardActual = parseNumber(order['Thanh toán hoa hồng thực tế']);
        creator.standardCommission.estimated += standardEstimated;
        creator.standardCommission.actual += standardActual;
        
        // Tính hoa hồng quảng cáo
        const advertisingEstimated = parseNumber(order['Thanh toán hoa hồng Quảng cáo cửa hàng ước tính']);
        const advertisingActual = parseNumber(order['Thanh toán hoa hồng Quảng cáo cửa hàng thực tế']);
        creator.advertisingCommission.estimated += advertisingEstimated;
        creator.advertisingCommission.actual += advertisingActual;
        
        // Debug log for first few orders
        if (creator.orders.length <= 3) {
          console.log(`Order ${creator.orders.length} for ${creatorName}:`, {
            standardEstimated,
            standardActual,
            advertisingEstimated,
            advertisingActual,
            rawData: {
              standardEstimatedRaw: order['Thanh toán hoa hồng tiêu chuẩn ước tính'],
              standardActualRaw: order['Thanh toán hoa hồng thực tế'],
              advertisingEstimatedRaw: order['Thanh toán hoa hồng Quảng cáo cửa hàng ước tính'],
              advertisingActualRaw: order['Thanh toán hoa hồng Quảng cáo cửa hàng thực tế']
            }
          });
        }
      });
    }

    const result = Array.from(creatorMap.entries()).map(([creatorName, data]) => ({
      creatorName,
      totalOrders: data.orders.length,
      totalRevenue: data.totalRevenue,
      standardCommission: {
        estimated: data.standardCommission.estimated,
        actual: data.standardCommission.actual,
        total: data.standardCommission.estimated + data.standardCommission.actual,
      },
      advertisingCommission: {
        estimated: data.advertisingCommission.estimated,
        actual: data.advertisingCommission.actual,
        total: data.advertisingCommission.estimated + data.advertisingCommission.actual,
      },
      totalCommission: (data.standardCommission.estimated + data.standardCommission.actual) + 
                      (data.advertisingCommission.estimated + data.advertisingCommission.actual),
      orders: data.orders,
    }));
    
    console.log('Commission processing completed. Found', result.length, 'creators');
    console.log('Sample creator data:', result[0]);
    return result;
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
    
    // Process commission data asynchronously
    setIsCommissionLoading(true);
    setTimeout(() => {
      try {
        console.log('Processing commission data for', data.length, 'records');
        console.log('Sample data record:', data[0]);
        const commissionData = processCommissionData(data);
        console.log('Commission data result:', commissionData.length, 'creators');
        console.log('First few creators:', commissionData.slice(0, 3));
        commissionData.sort((a, b) => a.creatorName.localeCompare(b.creatorName));
        setCreatorCommissions(commissionData);
      } catch (error) {
        console.error('Error processing commission data:', error);
        setCreatorCommissions([]);
      } finally {
        setIsCommissionLoading(false);
      }
    }, 100);
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
      
      // Debug log for first few creators
      if (creator.creatorName === creatorOrders[0]?.creatorUsername) {
        console.log(`Debug ${creator.creatorName}:`, {
          totalOrders: creator.totalOrders,
          completedOrders: completedOrders.length,
          cancelledOrders: cancelledOrders.length,
          returnedOrders: returnedOrders.length,
          completionRate: creator.completionRate,
          cancelRate: creator.cancelRate,
          returnRate: creator.returnRate,
          sampleOrder: creatorOrders[0]
        });
      }

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
    }
    return amount.toLocaleString('vi-VN');
  };

  // Sort function
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
    if (field === 'completionRate') return obj.completionRate;
    if (field === 'cancelRate') return obj.cancelRate;
    
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

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Calculate totals
  const totalStats = {
    totalCreators: creatorStats.length,
    totalOrders: creatorStats.reduce((sum, creator) => sum + creator.totalOrders, 0),
    totalRevenue: creatorStats.reduce((sum, creator) => sum + creator.totalRevenue, 0),
    videoOrders: creatorStats.reduce((sum, creator) => sum + creator.video.orders, 0),
    videoRevenue: creatorStats.reduce((sum, creator) => sum + creator.video.revenue, 0),
    displayOrders: creatorStats.reduce((sum, creator) => sum + creator.display.orders, 0),
    displayRevenue: creatorStats.reduce((sum, creator) => sum + creator.display.revenue, 0),
    externalOrders: creatorStats.reduce((sum, creator) => sum + creator.external.orders, 0),
    externalRevenue: creatorStats.reduce((sum, creator) => sum + creator.external.revenue, 0),
  };

  if (isLoading) {
    return (
      <>
        <PageMeta title="Phân tích Creator - meup" description="Phân tích hiệu suất và thống kê Creator" />
        <div className="w-full px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center text-brand-600 dark:text-brand-400">
              <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title="Phân tích Creator - meup" description="Phân tích hiệu suất và thống kê Creator" />
      
      <div className="w-full px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
            Phân tích Creator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Phân tích hiệu suất Creator theo loại nội dung và thống kê đơn hàng
          </p>
        </div>


        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Total Creators Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Tổng Creators
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalStats.totalCreators}
                </p>
              </div>
              <div className="p-3 bg-brand-100 dark:bg-brand-900/20 rounded-xl">
                <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Active creators</span>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Tổng đơn hàng
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalStats.totalOrders.toLocaleString('vi-VN')}
                </p>
              </div>
              <div className="p-3 bg-success-100 dark:bg-success-900/20 rounded-xl">
                <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>All time orders</span>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Tổng doanh thu
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalStats.totalRevenue)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>VND currency</span>
            </div>
          </div>

          {/* Data Records Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Bản ghi dữ liệu
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {processedData.length.toLocaleString('vi-VN')}
                </p>
              </div>
              <div className="p-3 bg-blue-light-100 dark:bg-blue-light-900/20 rounded-xl">
                <svg className="w-6 h-6 text-blue-light-600 dark:text-blue-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>Raw data entries</span>
            </div>
          </div>
        </div>

        {/* Creator Performance Table */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl border border-${themeColors.primary200} dark:border-${themeColors.primary800} overflow-hidden shadow-sm`}>
          <div className={`p-6 border-b border-${themeColors.primary200} dark:border-${themeColors.primary800} bg-${themeColors.primary50}/30 dark:bg-${themeColors.primary900}/10`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className={`text-lg font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100}`}>
                  Báo cáo hiệu suất Creator
                </h3>
                <p className={`text-sm text-${themeColors.primary600} dark:text-${themeColors.primary300} mt-1`}>
                  Phân tích theo loại nội dung: Video, Trưng bày, Phát trực tiếp
                </p>
              </div>
              
              {/* Search Input */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-${themeColors.primary400}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm Creator..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    className={`pl-10 pr-4 py-2 w-64 text-sm border border-${themeColors.primary200} dark:border-${themeColors.primary700} rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-${themeColors.primary400} dark:placeholder-${themeColors.primary500} focus:ring-2 focus:ring-${themeColors.primary500} focus:border-${themeColors.primary500}`}
                  />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-2 text-sm text-${themeColors.primary500} hover:text-${themeColors.primary700} dark:text-${themeColors.primary400} dark:hover:text-${themeColors.primary200}`}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse table-fixed">
              <thead>
                {/* Main Header Row */}
                <tr className={`bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20`}>
                  <th rowSpan={2} className={`px-4 py-3 text-left text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} border border-${themeColors.primary200} dark:border-${themeColors.primary700} w-[150px] bg-${themeColors.primary100} dark:bg-${themeColors.primary800}/30`}>
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
                  <th colSpan={3} className="px-4 py-3 text-center text-sm font-semibold text-white border border-orange-300 dark:border-orange-600 bg-gradient-to-r from-orange-500 to-orange-600">
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
                  {/* Tỷ lệ hoàn - Ẩn tạm thời */}
                  {/* <th 
                    className="px-2 py-2 text-center text-xs font-medium text-blue-800 border border-blue-200 w-[80px] bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors select-none"
                    onClick={() => handleSort('video.completionRate')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tỷ lệ hoàn
                      {sortField === 'video.completionRate' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {sortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th> */}
                  <th 
                    className="px-2 py-2 text-center text-xs font-medium text-blue-800 border border-blue-200 w-[80px] bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors select-none"
                    onClick={() => handleSort('video.cancelRate')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tỷ lệ hủy
                      {sortField === 'video.cancelRate' && (
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
                  {/* Trưng bày columns */}
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
                  {/* Tỷ lệ hoàn - Ẩn tạm thời */}
                  {/* <th 
                    className="px-2 py-2 text-center text-xs font-medium text-green-800 border border-green-200 w-[80px] bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors select-none"
                    onClick={() => handleSort('display.completionRate')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tỷ lệ hoàn
                      {sortField === 'display.completionRate' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {sortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th> */}
                  <th 
                    className="px-2 py-2 text-center text-xs font-medium text-green-800 border border-green-200 w-[80px] bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors select-none"
                    onClick={() => handleSort('display.cancelRate')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tỷ lệ hủy
                      {sortField === 'display.cancelRate' && (
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
                  {/* Phát trực tiếp column */}
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
                    className="px-2 py-2 text-center text-xs font-medium text-orange-800 border border-orange-200 w-[100px] bg-orange-50 dark:bg-orange-900/20 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors select-none"
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
                  {/* Tỷ lệ hoàn - Ẩn tạm thời */}
                  {/* <th 
                    className="px-2 py-2 text-center text-xs font-medium text-orange-800 border border-orange-200 w-[80px] bg-orange-50 dark:bg-orange-900/20 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors select-none"
                    onClick={() => handleSort('completionRate')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tỷ lệ hoàn
                      {sortField === 'completionRate' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          {sortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th> */}
                  <th 
                    className="px-2 py-2 text-center text-xs font-medium text-orange-800 border border-orange-200 w-[80px] bg-orange-50 dark:bg-orange-900/20 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors select-none"
                    onClick={() => handleSort('cancelRate')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tỷ lệ hủy
                      {sortField === 'cancelRate' && (
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
              <tbody className="bg-white dark:bg-gray-800">
                {currentData.map((creator, index) => (
                  <tr key={index} className={`hover:bg-${themeColors.primary50} dark:hover:bg-${themeColors.primary900}/10 border-b border-${themeColors.primary100} dark:border-${themeColors.primary800} transition-all duration-200`}>
                    {/* Creator Name */}
                    <td className={`px-4 py-3 text-sm font-medium text-${themeColors.primary900} dark:text-${themeColors.primary100} border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50}/50 dark:bg-${themeColors.primary900}/20 w-[150px]`}>
                      <div className="relative group">
                        <div className="font-semibold truncate cursor-pointer">
                          {creator.creatorName}
                        </div>
                        {/* Custom Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] whitespace-nowrap">
                          {creator.creatorName}
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Video Stats */}
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[80px]">
                      {creator.video.orders > 0 ? creator.video.orders : '0'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[100px]">
                      {creator.video.revenue > 0 ? formatCurrency(creator.video.revenue) : '0'}
                    </td>
                    {/* Tỷ lệ hoàn - Ẩn tạm thời */}
                    {/* <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[80px]">
                      {creator.video.orders > 0 ? creator.video.completionRate.toFixed(1) + '%' : '0%'}
                    </td> */}
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[80px]">
                      {creator.video.orders > 0 ? creator.video.cancelRate.toFixed(1) + '%' : '0%'}
                    </td>
                    
                    {/* Display Stats */}
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[80px]">
                      {creator.display.orders > 0 ? creator.display.orders : '0'}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[100px]">
                      {creator.display.revenue > 0 ? formatCurrency(creator.display.revenue) : '0'}
                    </td>
                    {/* Tỷ lệ hoàn - Ẩn tạm thời */}
                    {/* <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[80px]">
                      {creator.display.orders > 0 ? creator.display.completionRate.toFixed(1) + '%' : '0%'}
                    </td> */}
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[80px]">
                      {creator.display.orders > 0 ? creator.display.cancelRate.toFixed(1) + '%' : '0%'}
                    </td>
                    
                    {/* External Stats */}
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[80px]">
                      {creator.external.orders > 0 ? creator.external.orders : '0'}
                    </td>
                    
                    {/* Total Stats */}
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[80px]">
                      {creator.totalOrders}
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[100px]">
                      {formatCurrency(creator.totalRevenue)}
                    </td>
                    {/* Tỷ lệ hoàn - Ẩn tạm thời */}
                    {/* <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[80px]">
                      {creator.completionRate.toFixed(1)}%
                    </td> */}
                    <td className="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800 w-[80px]">
                      {creator.cancelRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
                
                {/* Total Row */}
                <tr className={`bg-${themeColors.primary100} dark:bg-${themeColors.primary900}/30 font-semibold`}>
                  <td className={`px-4 py-3 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary200} dark:bg-${themeColors.primary800}/40`}>
                    Tổng cộng ({totalStats.totalCreators} creators)
                  </td>
                  {/* Video totals */}
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[80px]">
                    {totalStats.videoOrders}
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[100px]">
                    {formatCurrency(totalStats.videoRevenue)}
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[80px]">
                    -
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[80px]">
                    -
                  </td>
                  {/* Display totals */}
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[80px]">
                    {totalStats.displayOrders}
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[100px]">
                    {formatCurrency(totalStats.displayRevenue)}
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[80px]">
                    -
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[80px]">
                    -
                  </td>
                  {/* External totals */}
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[80px]">
                    {totalStats.externalOrders}
                  </td>
                  {/* Overall totals */}
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[80px]">
                    {totalStats.totalOrders}
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[100px]">
                    {formatCurrency(totalStats.totalRevenue)}
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[80px]">
                    -
                  </td>
                  <td className="px-2 py-2 text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} text-center border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20 w-[80px]">
                    -
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-between px-6 py-4 bg-${themeColors.primary50}/30 dark:bg-${themeColors.primary900}/10 border-t border-${themeColors.primary100} dark:border-${themeColors.primary800}`}>
              <div className={`flex items-center text-sm text-${themeColors.primary700} dark:text-${themeColors.primary300}`}>
                <span>
                  Hiển thị {startIndex + 1} đến {Math.min(endIndex, sortedData.length)} trong tổng số {sortedData.length} creators
                  {searchTerm && (
                    <span className={`ml-2 text-${themeColors.primary600} dark:text-${themeColors.primary400}`}>
                      (tìm kiếm: "{searchTerm}")
                    </span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm font-medium text-${themeColors.primary600} bg-white border border-${themeColors.primary200} rounded-md hover:bg-${themeColors.primary50} disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-${themeColors.primary700} dark:text-${themeColors.primary300} dark:hover:bg-${themeColors.primary900}/20`}
                >
                  Trước
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          currentPage === pageNumber
                            ? `bg-${themeColors.primary600} text-white`
                            : `text-${themeColors.primary600} bg-white border border-${themeColors.primary200} hover:bg-${themeColors.primary50} dark:bg-gray-800 dark:border-${themeColors.primary700} dark:text-${themeColors.primary300} dark:hover:bg-${themeColors.primary900}/20`
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm font-medium text-${themeColors.primary600} bg-white border border-${themeColors.primary200} rounded-md hover:bg-${themeColors.primary50} disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-${themeColors.primary700} dark:text-${themeColors.primary300} dark:hover:bg-${themeColors.primary900}/20`}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Creator Commission Table - Ẩn tạm thời */}
        {false && (
        <div className={`bg-white dark:bg-gray-800 rounded-xl border border-${themeColors.primary200} dark:border-${themeColors.primary800} overflow-hidden shadow-sm mt-8`}>
          <div className={`p-6 border-b border-${themeColors.primary200} dark:border-${themeColors.primary800} bg-${themeColors.primary50}/30 dark:bg-${themeColors.primary900}/10`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className={`text-lg font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100}`}>
                  Báo cáo hoa hồng Creator
                </h3>
                <p className={`text-sm text-${themeColors.primary600} dark:text-${themeColors.primary300} mt-1`}>
                  Thống kê hoa hồng tiêu chuẩn và hoa hồng quảng cáo theo Creator
                </p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className={`bg-${themeColors.primary50} dark:bg-${themeColors.primary900}/20`}>
                  <th className={`px-4 py-3 text-left text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} border border-${themeColors.primary200} dark:border-${themeColors.primary700} w-[200px] bg-${themeColors.primary100} dark:bg-${themeColors.primary800}/30`}>
                    Creator
                  </th>
                  <th className={`px-4 py-3 text-center text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary100} dark:bg-${themeColors.primary800}/30`}>
                    Tổng đơn hàng
                  </th>
                  <th className={`px-4 py-3 text-center text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary100} dark:bg-${themeColors.primary800}/30`}>
                    Tổng doanh thu
                  </th>
                  <th colSpan={2} className={`px-4 py-3 text-center text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary100} dark:bg-${themeColors.primary800}/30`}>
                    Hoa hồng tiêu chuẩn
                  </th>
                  <th colSpan={2} className={`px-4 py-3 text-center text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary100} dark:bg-${themeColors.primary800}/30`}>
                    Hoa hồng quảng cáo
                  </th>
                  <th className={`px-4 py-3 text-center text-sm font-semibold text-${themeColors.primary900} dark:text-${themeColors.primary100} border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary100} dark:bg-${themeColors.primary800}/30`}>
                    Tổng hoa hồng
                  </th>
                </tr>
                {/* Sub Header Row */}
                <tr className={`bg-${themeColors.primary100}/50 dark:bg-${themeColors.primary800}/20`}>
                  <th className={`px-4 py-2 text-center text-xs font-medium text-${themeColors.primary800} border border-${themeColors.primary200} w-[200px] bg-white dark:bg-gray-800`}>
                    Creator
                  </th>
                  <th className={`px-4 py-2 text-center text-xs font-medium text-${themeColors.primary800} border border-${themeColors.primary200} w-[100px] bg-white dark:bg-gray-800`}>
                    Tổng đơn hàng
                  </th>
                  <th className={`px-4 py-2 text-center text-xs font-medium text-${themeColors.primary800} border border-${themeColors.primary200} w-[120px] bg-white dark:bg-gray-800`}>
                    Tổng doanh thu
                  </th>
                  <th className={`px-4 py-2 text-center text-xs font-medium text-${themeColors.primary800} border border-${themeColors.primary200} w-[100px] bg-white dark:bg-gray-800`}>
                    Ước tính
                  </th>
                  <th className={`px-4 py-2 text-center text-xs font-medium text-${themeColors.primary800} border border-${themeColors.primary200} w-[100px] bg-white dark:bg-gray-800`}>
                    Thực tế
                  </th>
                  <th className={`px-4 py-2 text-center text-xs font-medium text-${themeColors.primary800} border border-${themeColors.primary200} w-[100px] bg-white dark:bg-gray-800`}>
                    Ước tính
                  </th>
                  <th className={`px-4 py-2 text-center text-xs font-medium text-${themeColors.primary800} border border-${themeColors.primary200} w-[100px] bg-white dark:bg-gray-800`}>
                    Thực tế
                  </th>
                  <th className={`px-4 py-2 text-center text-xs font-medium text-${themeColors.primary800} border border-${themeColors.primary200} w-[120px] bg-white dark:bg-gray-800`}>
                    Tổng hoa hồng
                  </th>
                </tr>
              </thead>
              <tbody>
                {isCommissionLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Đang xử lý dữ liệu hoa hồng...</span>
                      </div>
                    </td>
                  </tr>
                ) : creatorCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span>Không có dữ liệu hoa hồng</span>
                        <span className="text-xs text-gray-400">
                          Debug: isCommissionLoading = {isCommissionLoading.toString()}, 
                          creatorCommissions.length = {creatorCommissions.length},
                          rawData.length = {rawData.length}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  creatorCommissions.map((creator, index) => (
                  <tr key={creator.creatorName} className={`${index % 2 === 0 ? `bg-${themeColors.primary50}/30 dark:bg-${themeColors.primary900}/10` : 'bg-white dark:bg-gray-800'} hover:bg-${themeColors.primary100}/50 dark:hover:bg-${themeColors.primary900}/20 transition-colors`}>
                    <td className={`px-4 py-3 text-sm font-medium text-${themeColors.primary900} dark:text-${themeColors.primary100} border border-${themeColors.primary200} dark:border-${themeColors.primary700} bg-${themeColors.primary50}/50 dark:bg-${themeColors.primary900}/20 w-[200px]`}>
                      <div className="relative group">
                        <div className="font-semibold truncate cursor-pointer">
                          {creator.creatorName}
                        </div>
                        {/* Custom Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999] whitespace-nowrap">
                          {creator.creatorName}
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800`}>
                      {creator.totalOrders.toLocaleString('vi-VN')}
                    </td>
                    <td className={`px-4 py-3 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800`}>
                      {formatCurrency(creator.totalRevenue)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800`}>
                      {formatCurrency(creator.standardCommission.estimated)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800`}>
                      {formatCurrency(creator.standardCommission.actual)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800`}>
                      {formatCurrency(creator.advertisingCommission.estimated)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-gray-800 dark:text-gray-200 text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-white dark:bg-gray-800`}>
                      {formatCurrency(creator.advertisingCommission.actual)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold text-${themeColors.primary700} dark:text-${themeColors.primary300} text-center border border-${themeColors.primary100} dark:border-${themeColors.primary800} bg-${themeColors.primary50}/50 dark:bg-${themeColors.primary900}/20`}>
                      {formatCurrency(creator.totalCommission)}
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

      </div>
    </>
  );
};

export default CreatorAnalytics;