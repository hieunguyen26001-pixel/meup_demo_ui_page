import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";

const StaffList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Sample data for staff management
  const staffData = [
    {
      id: "EMP001",
      name: "Nguyễn Văn An",
      position: "Quay phim",
      department: "Sản xuất",
      email: "an.nguyen@meup.com",
      phone: "0123456789",
      status: "active",
      joinDate: "2023-01-15",
      salary: 15000000,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: "EMP002",
      name: "Trần Thị Bình",
      position: "Biên tập viên",
      department: "Hậu kỳ",
      email: "binh.tran@meup.com",
      phone: "0987654321",
      status: "active",
      joinDate: "2023-03-20",
      salary: 12000000,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: "EMP003",
      name: "Lê Văn Cường",
      position: "Đạo diễn",
      department: "Sản xuất",
      email: "cuong.le@meup.com",
      phone: "0369852147",
      status: "active",
      joinDate: "2022-11-10",
      salary: 20000000,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: "EMP004",
      name: "Phạm Thị Dung",
      position: "Marketing",
      department: "Marketing",
      email: "dung.pham@meup.com",
      phone: "0741258963",
      status: "inactive",
      joinDate: "2023-06-05",
      salary: 10000000,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: "EMP005",
      name: "Hoàng Văn Em",
      position: "Kỹ thuật viên",
      department: "IT",
      email: "em.hoang@meup.com",
      phone: "0852369741",
      status: "active",
      joinDate: "2023-08-12",
      salary: 18000000,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || staff.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Đang làm việc";
      case "inactive":
        return "Nghỉ việc";
      default:
        return "Không xác định";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const departments = [...new Set(staffData.map(staff => staff.department))];

  return (
    <>
      <PageMeta title="Danh sách nhân sự - meup" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Danh sách nhân sự
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lí thông tin nhân viên và theo dõi hoạt động
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Tổng Nhân Viên
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {staffData.length}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  Tất cả nhân viên
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Đang Làm Việc
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {staffData.filter(s => s.status === "active").length}
                </p>
                <p className="text-xs text-green-500 dark:text-green-300 mt-1">
                  Nhân viên hoạt động
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 p-4 dark:border-purple-800 dark:from-purple-900/20 dark:to-purple-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Phòng Ban
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {departments.length}
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-300 mt-1">
                  Các phòng ban
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl dark:from-purple-900/20 dark:to-violet-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">🏢</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-4 dark:border-orange-800 dark:from-orange-900/20 dark:to-orange-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Lương Trung Bình
                </p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {formatCurrency(staffData.reduce((sum, s) => sum + s.salary, 0) / staffData.length)}
                </p>
                <p className="text-xs text-orange-500 dark:text-orange-300 mt-1">
                  Mỗi nhân viên
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Phân Bổ Theo Phòng Ban
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "donut" },
                labels: departments,
                colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
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
                          label: "Tổng NV",
                          formatter: () => staffData.length.toString(),
                        },
                      },
                    },
                  },
                },
              }}
              series={departments.map(dept => 
                staffData.filter(s => s.department === dept).length
              )}
              type="donut"
              height={300}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Lương Theo Phòng Ban
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "bar" },
                xaxis: { 
                  categories: departments,
                  labels: { rotate: -45 }
                },
                colors: ["#8B5CF6"],
                dataLabels: { enabled: true },
                plotOptions: {
                  bar: {
                    borderRadius: 4,
                  },
                },
                title: {
                  text: "Lương trung bình theo phòng ban",
                  style: { fontSize: "14px" },
                },
                yaxis: {
                  labels: {
                    formatter: (val) => formatCurrency(val),
                  },
                },
              }}
              series={[
                {
                  name: "Lương TB",
                  data: departments.map(dept => {
                    const deptStaff = staffData.filter(s => s.department === dept);
                    return deptStaff.reduce((sum, s) => sum + s.salary, 0) / deptStaff.length;
                  }),
                },
              ]}
              type="bar"
              height={300}
            />
          </div>
        </div>

        {/* Staff Management Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Danh Sách Nhân Viên ({filteredStaff.length} mục)
              </h3>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả phòng ban</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Nhân viên</th>
                    <th className="px-4 py-3 whitespace-nowrap">Vị trí</th>
                    <th className="px-4 py-3 whitespace-nowrap">Phòng ban</th>
                    <th className="px-4 py-3 whitespace-nowrap">Liên hệ</th>
                    <th className="px-4 py-3 whitespace-nowrap">Ngày vào</th>
                    <th className="px-4 py-3 whitespace-nowrap">Lương</th>
                    <th className="px-4 py-3 whitespace-nowrap">Trạng thái</th>
                    <th className="px-4 py-3 whitespace-nowrap">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr
                      key={staff.id}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white/90">
                              {staff.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {staff.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {staff.position}
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {staff.department}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800 dark:text-white/90">
                          {staff.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {staff.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {new Date(staff.joinDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {formatCurrency(staff.salary)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(staff.status)}`}
                        >
                          {getStatusLabel(staff.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            Xem
                          </button>
                          <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
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

export default StaffList;
