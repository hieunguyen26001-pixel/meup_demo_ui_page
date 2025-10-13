import React, { useState, useEffect } from 'react';

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
}

const CreatorCommission: React.FC = () => {
  const [rawData, setRawData] = useState<OrderRecord[]>([]);
  const [creatorCommissions, setCreatorCommissions] = useState<CreatorCommission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof CreatorCommission>('totalOrders');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Load data from JSON file
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/creator_order.json');
        const data = await response.json();
        setRawData(data);
        processCommissionData(data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const parseNumber = (value: any): number => {
    if (value === null || value === undefined || value === '') return 0;
    const parsed = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const processCommissionData = (data: OrderRecord[]) => {
    const creatorMap = new Map<string, CreatorCommission>();

    data.forEach(record => {
      const creatorName = record["Tên người dùng nhà sáng tạo"];
      
      if (!creatorMap.has(creatorName)) {
        creatorMap.set(creatorName, {
          creatorName,
          totalOrders: 0,
          totalRevenue: 0,
          standardCommission: {
            estimated: 0,
            actual: 0,
            total: 0
          },
          advertisingCommission: {
            estimated: 0,
            actual: 0,
            total: 0
          },
          totalCommission: 0
        });
      }

      const creator = creatorMap.get(creatorName)!;
      
      // Update basic stats
      creator.totalOrders++;
      creator.totalRevenue += record["Payment Amount"] || 0;

      // Process standard commission
      const standardEstimated = parseNumber(record["Thanh toán hoa hồng tiêu chuẩn ước tính"]);
      const standardActual = parseNumber(record["Thanh toán hoa hồng thực tế"]);
      
      // Always add standard commission values (even if 0)
      creator.standardCommission.estimated += standardEstimated;
      creator.standardCommission.actual += standardActual;
      creator.standardCommission.total += standardActual || standardEstimated;

      // Process advertising commission
      const advertisingEstimated = parseNumber(record["Thanh toán hoa hồng Quảng cáo cửa hàng ước tính"]);
      const advertisingActual = parseNumber(record["Thanh toán hoa hồng Quảng cáo cửa hàng thực tế"]);
      
      // Always add advertising commission values (even if 0)
      creator.advertisingCommission.estimated += advertisingEstimated;
      creator.advertisingCommission.actual += advertisingActual;
      creator.advertisingCommission.total += advertisingActual || advertisingEstimated;
    });

    // Calculate total commission for each creator
    const commissions = Array.from(creatorMap.values()).map(creator => {
      creator.totalCommission = creator.standardCommission.total + creator.advertisingCommission.total;
      return creator;
    });

    // Sort by creator name
    commissions.sort((a, b) => a.creatorName.localeCompare(b.creatorName));
    setCreatorCommissions(commissions);
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toFixed(0);
  };

  const handleSort = (field: keyof CreatorCommission) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getNestedValue = (obj: CreatorCommission, field: keyof CreatorCommission): number => {
    if (field === 'standardCommission') {
      return obj.standardCommission.total;
    }
    if (field === 'advertisingCommission') {
      return obj.advertisingCommission.total;
    }
    return obj[field] as number;
  };

  const filteredData = creatorCommissions.filter(creator =>
    creator.creatorName.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);
    
    if (sortField === 'creatorName') {
      return sortDirection === 'asc' 
        ? a.creatorName.localeCompare(b.creatorName)
        : b.creatorName.localeCompare(a.creatorName);
    }
    
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const currentData = sortedData.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, validCurrentPage - 3);
      const end = Math.min(totalPages, validCurrentPage + 3);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Hiển thị {Math.min((validCurrentPage - 1) * itemsPerPage + 1, sortedData.length)} - {Math.min(validCurrentPage * itemsPerPage, sortedData.length)} trong tổng số {sortedData.length} creator
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, validCurrentPage - 1))}
            disabled={validCurrentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={page === '...'}
              className={`px-3 py-1 text-sm border rounded-md ${
                page === validCurrentPage
                  ? 'bg-blue-500 text-white border-blue-500'
                  : page === '...'
                  ? 'border-transparent cursor-default'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, validCurrentPage + 1))}
            disabled={validCurrentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Đang tải dữ liệu hoa hồng...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Thống kê hoa hồng ADS và Tự Nhiên
        </h3>
        <p className="text-gray-600">
          Phân tích hoa hồng tiêu chuẩn và quảng cáo của các Creator
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên Creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Commission Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {/* Main Header Row */}
              <tr className="bg-gray-50">
                <th 
                  rowSpan={2}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border border-gray-200 dark:border-gray-700"
                  onClick={() => handleSort('creatorName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Creator</span>
                    {sortField === 'creatorName' && (
                      <span className="text-blue-500 text-sm">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  rowSpan={2}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border border-gray-200 dark:border-gray-700"
                  onClick={() => handleSort('totalOrders')}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Số đơn</span>
                    {sortField === 'totalOrders' && (
                      <span className="text-blue-500 text-sm">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  rowSpan={2}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 border border-gray-200 dark:border-gray-700"
                  onClick={() => handleSort('totalRevenue')}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Tổng giá trị</span>
                    {sortField === 'totalRevenue' && (
                      <span className="text-blue-500 text-sm">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  colSpan={2}
                  className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border border-blue-300 dark:border-blue-600 bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Hoa hồng tiêu chuẩn</span>
                  </div>
                </th>
                <th 
                  colSpan={2}
                  className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border border-green-300 dark:border-green-600 bg-gradient-to-r from-green-500 to-green-600"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Hoa hồng quảng cáo</span>
                  </div>
                </th>
              </tr>
              {/* Sub Header Row */}
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-center text-xs font-medium text-blue-600 uppercase tracking-wider bg-blue-50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Ước tính</span>
                  </div>
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-blue-700 uppercase tracking-wider bg-blue-50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Thực tế</span>
                  </div>
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-green-600 uppercase tracking-wider bg-green-50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Ước tính</span>
                  </div>
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-green-700 uppercase tracking-wider bg-green-50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Thực tế</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Không có dữ liệu hoa hồng
                  </td>
                </tr>
              ) : (
                currentData.map((creator, index) => (
                  <tr key={creator.creatorName} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap border border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-900">{creator.creatorName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-semibold text-purple-600">{creator.totalOrders}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-semibold text-green-600">{formatCurrency(creator.totalRevenue)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-semibold text-blue-600">{formatCurrency(creator.standardCommission.estimated)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-semibold text-blue-700">{formatCurrency(creator.standardCommission.actual)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-semibold text-green-600">{formatCurrency(creator.advertisingCommission.estimated)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center border border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-semibold text-green-700">{formatCurrency(creator.advertisingCommission.actual)}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {renderPagination()}
    </div>
  );
};

export default CreatorCommission;
