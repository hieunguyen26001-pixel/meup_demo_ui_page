import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { 
  GridIcon, 
  ShootingStarIcon, 
  DollarLineIcon, 
  PieChartIcon,
  BoxCubeIcon,
  UserIcon,
  ChatIcon,
  VideoIcon,
  TableIcon,
  CalenderIcon,
  BoxIcon
} from "../../icons";

interface PlatformData {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'pending';
  campaigns: number;
  spend: number;
  revenue: number;
  roi: number;
  color: string;
}

const MultiPlatformAds: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const platforms: PlatformData[] = [
    {
      id: 'tiktok',
      name: 'TikTok Ads',
      icon: <VideoIcon />,
      status: 'connected',
      campaigns: 12,
      spend: 45000000,
      revenue: 135000000,
      roi: 3.0,
      color: 'bg-pink-500'
    },
    {
      id: 'shopee',
      name: 'Shopee Ads',
      icon: <BoxIcon />,
      status: 'connected',
      campaigns: 15,
      spend: 25000000,
      revenue: 75000000,
      roi: 3.0,
      color: 'bg-orange-500'
    }
  ];

  const totalSpend = platforms.reduce((sum, platform) => sum + platform.spend, 0);
  const totalRevenue = platforms.reduce((sum, platform) => sum + platform.revenue, 0);
  const totalROI = totalRevenue / totalSpend;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Đã kết nối</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Chờ xử lý</span>;
      case 'disconnected':
        return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Chưa kết nối</span>;
      default:
        return null;
    }
  };

  const filteredPlatforms = selectedPlatform === 'all' 
    ? platforms 
    : platforms.filter(platform => platform.id === selectedPlatform);

  return (
    <div className="space-y-6">
      <PageMeta title="Quảng cáo đa sàn" description="Quản lý và theo dõi quảng cáo trên tất cả các nền tảng" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GMV Max - Quảng cáo đa sàn</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý GMV Max trên TikTok và Shopee
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <ShootingStarIcon className="w-4 h-4 mr-2" />
            Tạo chiến dịch mới
          </button>
        </div>
      </div>

      {/* GMV Max Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarLineIcon className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng GMV</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PieChartIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Chiến dịch đang chạy</p>
              <p className="text-2xl font-semibold text-gray-900">
                {platforms.reduce((sum, platform) => sum + platform.campaigns, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShootingStarIcon className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">ROI trung bình</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalROI.toFixed(1)}x
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            selectedPlatform === 'all'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Tất cả
        </button>
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              selectedPlatform === platform.id
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {platform.name}
          </button>
        ))}
      </div>

      {/* GMV Max Platforms */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {filteredPlatforms.map((platform) => (
          <div key={platform.id} className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center`}>
                  <div className="text-white">
                    {platform.icon}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{platform.name}</h3>
                  {getStatusBadge(platform.status)}
                </div>
              </div>
            </div>

            {platform.status === 'connected' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">GMV Max</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(platform.revenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chiến dịch</p>
                    <p className="text-2xl font-semibold text-gray-900">{platform.campaigns}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Quản lý GMV Max
                  </button>
                </div>
              </div>
            )}

            {platform.status === 'pending' && (
              <div className="mt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Đang chờ kết nối...</p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                    Hướng dẫn kết nối
                  </button>
                </div>
              </div>
            )}

            {platform.status === 'disconnected' && (
              <div className="mt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Chưa được kết nối</p>
                  <button className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Kết nối ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* GMV Max Insights */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin GMV Max</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                TikTok GMV Max: Chiến dịch "Black Friday 2024" đạt 135M VNĐ
              </p>
              <p className="text-xs text-gray-500">2 giờ trước</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                Shopee GMV Max: 15 chiến dịch đang chạy, tổng GMV 75M VNĐ
              </p>
              <p className="text-xs text-gray-500">4 giờ trước</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                Gợi ý: Tăng ngân sách cho chiến dịch TikTok hiệu quả nhất
              </p>
              <p className="text-xs text-gray-500">6 giờ trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiPlatformAds;
