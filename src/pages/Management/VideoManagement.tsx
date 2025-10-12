import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";

const VideoManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample data for video management
  const videoData = [
    {
      id: "1",
      title: "Video quảng cáo sản phẩm A",
      creator: "Creator 1",
      duration: "00:30",
      status: "active",
      views: 15000,
      uploadDate: "2024-01-15",
      category: "Sản phẩm"
    },
    {
      id: "2", 
      title: "Video hướng dẫn sử dụng",
      creator: "Creator 2",
      duration: "02:15",
      status: "pending",
      views: 8500,
      uploadDate: "2024-01-14",
      category: "Hướng dẫn"
    },
    {
      id: "3",
      title: "Video review sản phẩm B",
      creator: "Creator 3", 
      duration: "01:45",
      status: "inactive",
      views: 22000,
      uploadDate: "2024-01-13",
      category: "Review"
    }
  ];

  const filteredVideos = videoData.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        video.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || video.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "pending":
        return "Chờ duyệt";
      case "inactive":
        return "Ngừng hoạt động";
      default:
        return "Không xác định";
    }
  };

  return (
    <>
      <PageMeta title="Quản lí Video - meup" />
      
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Quản lí Video
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lí và theo dõi tất cả video trong hệ thống
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Tổng Video
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {videoData.length}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  Tất cả video trong hệ thống
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">🎥</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Video Hoạt Động
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {videoData.filter(v => v.status === "active").length}
                </p>
                <p className="text-xs text-green-500 dark:text-green-300 mt-1">
                  Đang được phát sóng
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">▶️</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Chờ Duyệt
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {videoData.filter(v => v.status === "pending").length}
                </p>
                <p className="text-xs text-yellow-500 dark:text-yellow-300 mt-1">
                  Cần xem xét
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl dark:from-yellow-900/20 dark:to-orange-900/20 flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 p-4 dark:border-purple-800 dark:from-purple-900/20 dark:to-purple-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Tổng Lượt Xem
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {videoData.reduce((sum, v) => sum + v.views, 0).toLocaleString()}
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-300 mt-1">
                  Tất cả video
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl dark:from-purple-900/20 dark:to-violet-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">👁️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Phân Bổ Trạng Thái Video
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "donut" },
                labels: ["Hoạt động", "Chờ duyệt", "Ngừng hoạt động"],
                colors: ["#10B981", "#F59E0B", "#EF4444"],
                legend: { position: "bottom" },
                dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
                plotOptions: {
                  pie: {
                    donut: {
                      size: "70%",
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: "Tổng Video",
                          formatter: () => videoData.length.toString(),
                        },
                      },
                    },
                  },
                },
              }}
              series={[
                videoData.filter(v => v.status === "active").length,
                videoData.filter(v => v.status === "pending").length,
                videoData.filter(v => v.status === "inactive").length,
              ]}
              type="donut"
              height={300}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Top Video Nổi Bật
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "bar" },
                xaxis: { 
                  categories: videoData
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map(v => v.title.substring(0, 15) + "..."),
                  labels: { rotate: -45 }
                },
                colors: ["#3B82F6"],
                dataLabels: { enabled: true },
                plotOptions: {
                  bar: {
                    borderRadius: 4,
                  },
                },
                title: {
                  text: "Video có lượt xem cao nhất",
                  style: { fontSize: "14px" },
                },
              }}
              series={[
                {
                  name: "Lượt xem",
                  data: videoData
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map(v => v.views),
                },
              ]}
              type="bar"
              height={300}
            />
          </div>
        </div>

        {/* Video Management Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Danh Sách Video ({filteredVideos.length} mục)
              </h3>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm video..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="pending">Chờ duyệt</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Tên Video</th>
                    <th className="px-4 py-3 whitespace-nowrap">Creator</th>
                    <th className="px-4 py-3 whitespace-nowrap">Thời lượng</th>
                    <th className="px-4 py-3 whitespace-nowrap">Lượt xem</th>
                    <th className="px-4 py-3 whitespace-nowrap">Trạng thái</th>
                    <th className="px-4 py-3 whitespace-nowrap">Ngày upload</th>
                    <th className="px-4 py-3 whitespace-nowrap">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVideos.map((video) => (
                    <tr
                      key={video.id}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {video.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {video.category}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {video.creator}
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {video.duration}
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {video.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(video.status)}`}
                        >
                          {getStatusLabel(video.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {new Date(video.uploadDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            Chỉnh sửa
                          </button>
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoManagement;
