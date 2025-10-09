import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample data for orders
  const ordersData = [
    {
      id: "ORD001",
      customerName: "Nguyễn Văn A",
      customerEmail: "nguyenvana@email.com",
      customerPhone: "0123456789",
      products: [
        { name: "Áo thun nam", quantity: 2, price: 250000 },
        { name: "Quần short", quantity: 1, price: 180000 }
      ],
      totalAmount: 680000,
      status: "completed",
      orderDate: "2024-01-20",
      shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
      paymentMethod: "Credit Card"
    },
    {
      id: "ORD002",
      customerName: "Trần Thị B",
      customerEmail: "tranthib@email.com",
      customerPhone: "0987654321",
      products: [
        { name: "Quần jean nữ", quantity: 1, price: 450000 }
      ],
      totalAmount: 450000,
      status: "processing",
      orderDate: "2024-01-20",
      shippingAddress: "456 Đường XYZ, Quận 2, TP.HCM",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "ORD003",
      customerName: "Lê Văn C",
      customerEmail: "levanc@email.com",
      customerPhone: "0369852147",
      products: [
        { name: "Giày thể thao", quantity: 1, price: 800000 },
        { name: "Tất thể thao", quantity: 3, price: 150000 }
      ],
      totalAmount: 950000,
      status: "shipped",
      orderDate: "2024-01-19",
      shippingAddress: "789 Đường DEF, Quận 3, TP.HCM",
      paymentMethod: "Cash on Delivery"
    },
    {
      id: "ORD004",
      customerName: "Phạm Thị D",
      customerEmail: "phamthid@email.com",
      customerPhone: "0741258963",
      products: [
        { name: "Túi xách", quantity: 1, price: 350000 }
      ],
      totalAmount: 350000,
      status: "pending",
      orderDate: "2024-01-19",
      shippingAddress: "321 Đường GHI, Quận 4, TP.HCM",
      paymentMethod: "E-Wallet"
    },
    {
      id: "ORD005",
      customerName: "Hoàng Văn E",
      customerEmail: "hoangvane@email.com",
      customerPhone: "0852369741",
      products: [
        { name: "Đồng hồ", quantity: 1, price: 1200000 }
      ],
      totalAmount: 1200000,
      status: "cancelled",
      orderDate: "2024-01-18",
      shippingAddress: "654 Đường JKL, Quận 5, TP.HCM",
      paymentMethod: "Credit Card"
    }
  ];

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đã giao";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
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

  return (
    <>
      <PageMeta title="Đơn hàng - meup" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Quản lí Đơn hàng
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Theo dõi và quản lí tất cả đơn hàng trong hệ thống
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Tổng Đơn Hàng
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {ordersData.length}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  Tất cả đơn hàng
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">🛒</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Đã Hoàn Thành
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {ordersData.filter(o => o.status === "completed").length}
                </p>
                <p className="text-xs text-green-500 dark:text-green-300 mt-1">
                  Đơn hàng thành công
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Đang Xử Lý
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {ordersData.filter(o => o.status === "processing" || o.status === "pending").length}
                </p>
                <p className="text-xs text-yellow-500 dark:text-yellow-300 mt-1">
                  Cần xử lý
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
                  Tổng Doanh Thu
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(ordersData.reduce((sum, o) => sum + o.totalAmount, 0))}
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-300 mt-1">
                  Tất cả đơn hàng
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl dark:from-purple-900/20 dark:to-violet-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Phân Bổ Trạng Thái Đơn Hàng
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "donut" },
                labels: ["Hoàn thành", "Đang xử lý", "Đã giao", "Chờ xử lý", "Đã hủy"],
                colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"],
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
                          label: "Tổng Đơn",
                          formatter: () => ordersData.length.toString(),
                        },
                      },
                    },
                  },
                },
              }}
              series={[
                ordersData.filter(o => o.status === "completed").length,
                ordersData.filter(o => o.status === "processing").length,
                ordersData.filter(o => o.status === "shipped").length,
                ordersData.filter(o => o.status === "pending").length,
                ordersData.filter(o => o.status === "cancelled").length,
              ]}
              type="donut"
              height={300}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Doanh Thu Theo Ngày
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "area" },
                xaxis: { 
                  categories: ["18/01", "19/01", "20/01", "21/01", "22/01"],
                },
                colors: ["#8B5CF6"],
                dataLabels: { enabled: false },
                stroke: {
                  curve: "smooth",
                  width: 2,
                },
                fill: {
                  type: "gradient",
                  gradient: {
                    opacityFrom: 0.3,
                    opacityTo: 0.1,
                  },
                },
                title: {
                  text: "Doanh thu hàng ngày",
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
                  name: "Doanh thu",
                  data: [1200000, 1300000, 2080000, 0, 0],
                },
              ]}
              type="area"
              height={300}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Danh Sách Đơn Hàng ({filteredOrders.length} mục)
              </h3>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
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
                <option value="completed">Hoàn thành</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đã giao</option>
                <option value="pending">Chờ xử lý</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Mã Đơn</th>
                    <th className="px-4 py-3 whitespace-nowrap">Khách Hàng</th>
                    <th className="px-4 py-3 whitespace-nowrap">Sản Phẩm</th>
                    <th className="px-4 py-3 whitespace-nowrap">Tổng Tiền</th>
                    <th className="px-4 py-3 whitespace-nowrap">Trạng Thái</th>
                    <th className="px-4 py-3 whitespace-nowrap">Ngày Đặt</th>
                    <th className="px-4 py-3 whitespace-nowrap">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {order.id}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800 dark:text-white/90">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {order.customerEmail}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {order.customerPhone}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800 dark:text-white/90">
                          {order.products.map((product, index) => (
                            <div key={index} className="text-sm">
                              {product.name} x{product.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
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
                            Hủy
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

export default Orders;
