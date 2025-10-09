import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";

const AftersalesAnalytics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");

  // Sample data dựa trên TikTok Shop Aftersales API
  const aftersalesData = [
    {
      id: "AFS001",
      orderId: "576461413038785752",
      type: "CANCEL", // CANCEL, RETURN, REFUND
      status: "APPROVED", // PENDING, APPROVED, REJECTED, COMPLETED
      initiator: "BUYER", // BUYER, SELLER
      buyerName: "David Kong",
      buyerEmail: "v2b2V5@chat.seller.tiktok.com",
      reason: "Changed mind",
      reasonCode: "BUYER_CHANGED_MIND",
      requestTime: 1619611561,
      processTime: 1619611563,
      completionTime: 1619611565,
      amount: 5000,
      currency: "IDR",
      refundAmount: 5000,
      items: [
        {
          productName: "Women's Winter Crochet Clothes",
          skuName: "Iphone",
          quantity: 1,
          price: 5000,
          refundPrice: 5000
        }
      ],
      evidence: ["https://example.com/evidence1.jpg"],
      notes: "Customer changed mind before shipping",
      slaDeadline: 1619611561 + (24 * 60 * 60), // 24 hours SLA
      isPartial: false,
      returnTrackingNumber: null,
      refundMethod: "ORIGINAL_PAYMENT"
    },
    {
      id: "AFS002",
      orderId: "576461413038785753",
      type: "RETURN",
      status: "PENDING",
      initiator: "BUYER",
      buyerName: "Sarah Johnson",
      buyerEmail: "sarah.j@email.com",
      reason: "Product defect",
      reasonCode: "PRODUCT_DEFECT",
      requestTime: 1619611561,
      processTime: null,
      completionTime: null,
      amount: 12500,
      currency: "USD",
      refundAmount: 0,
      items: [
        {
          productName: "Men's Casual T-Shirt",
          skuName: "T-Shirt Blue M",
          quantity: 1,
          price: 2500,
          refundPrice: 2500
        }
      ],
      evidence: ["https://example.com/defect1.jpg", "https://example.com/defect2.jpg"],
      notes: "Customer reported defect in product",
      slaDeadline: 1619611561 + (72 * 60 * 60), // 72 hours SLA
      isPartial: true,
      returnTrackingNumber: "RT789456123",
      refundMethod: "ORIGINAL_PAYMENT"
    },
    {
      id: "AFS003",
      orderId: "576461413038785754",
      type: "REFUND",
      status: "COMPLETED",
      initiator: "SELLER",
      buyerName: "Mike Chen",
      buyerEmail: "mike.chen@email.com",
      reason: "Shipping delay",
      reasonCode: "SHIPPING_DELAY",
      requestTime: 1619611561,
      processTime: 1619611563,
      completionTime: 1619611565,
      amount: 8500,
      currency: "USD",
      refundAmount: 8500,
      items: [
        {
          productName: "Wireless Headphones",
          skuName: "Headphones Black",
          quantity: 1,
          price: 8500,
          refundPrice: 8500
        }
      ],
      evidence: [],
      notes: "Compensation for shipping delay",
      slaDeadline: 1619611561 + (48 * 60 * 60), // 48 hours SLA
      isPartial: false,
      returnTrackingNumber: null,
      refundMethod: "ORIGINAL_PAYMENT"
    },
    {
      id: "AFS004",
      orderId: "576461413038785755",
      type: "CANCEL",
      status: "REJECTED",
      initiator: "BUYER",
      buyerName: "John Smith",
      buyerEmail: "john.smith@email.com",
      reason: "Found cheaper elsewhere",
      reasonCode: "FOUND_CHEAPER",
      requestTime: 1619611561,
      processTime: 1619611563,
      completionTime: 1619611563,
      amount: 12000,
      currency: "USD",
      refundAmount: 0,
      items: [
        {
          productName: "Gaming Mouse",
          skuName: "Mouse RGB",
          quantity: 1,
          price: 12000,
          refundPrice: 0
        }
      ],
      evidence: [],
      notes: "Rejected - order already shipped",
      slaDeadline: 1619611561 + (24 * 60 * 60),
      isPartial: false,
      returnTrackingNumber: null,
      refundMethod: "ORIGINAL_PAYMENT"
    },
    {
      id: "AFS005",
      orderId: "576461413038785756",
      type: "RETURN",
      status: "COMPLETED",
      initiator: "BUYER",
      buyerName: "Lisa Wang",
      buyerEmail: "lisa.wang@email.com",
      reason: "Wrong size",
      reasonCode: "WRONG_SIZE",
      requestTime: 1619611561,
      processTime: 1619611563,
      completionTime: 1619611565,
      amount: 3000,
      currency: "USD",
      refundAmount: 3000,
      items: [
        {
          productName: "Running Shoes",
          skuName: "Shoes Size 8",
          quantity: 1,
          price: 3000,
          refundPrice: 3000
        }
      ],
      evidence: ["https://example.com/size1.jpg"],
      notes: "Customer received wrong size",
      slaDeadline: 1619611561 + (72 * 60 * 60),
      isPartial: false,
      returnTrackingNumber: "RT123456789",
      refundMethod: "ORIGINAL_PAYMENT"
    }
  ];

  const filteredData = aftersalesData.filter(item => {
    const matchesSearch = item.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "CANCEL":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "RETURN":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "REFUND":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "CANCEL":
        return "Hủy đơn";
      case "RETURN":
        return "Trả hàng";
      case "REFUND":
        return "Hoàn tiền";
      default:
        return "Không xác định";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Đã từ chối";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return "Không xác định";
    }
  };

  const getInitiatorBadge = (initiator: string) => {
    switch (initiator) {
      case "BUYER":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "SELLER":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getInitiatorLabel = (initiator: string) => {
    switch (initiator) {
      case "BUYER":
        return "Khách hàng";
      case "SELLER":
        return "Người bán";
      default:
        return "Không xác định";
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSlaStatus = (deadline: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = deadline - now;
    if (remaining < 0) {
      return { status: "overdue", text: "Quá hạn", color: "text-red-600 dark:text-red-400" };
    } else if (remaining < 3600) { // Less than 1 hour
      return { status: "urgent", text: "Sắp hết hạn", color: "text-orange-600 dark:text-orange-400" };
    } else {
      return { status: "normal", text: "Bình thường", color: "text-green-600 dark:text-green-400" };
    }
  };

  return (
    <>
      <PageMeta title="Phân tích Hủy/Trả/Hoàn tiền - meup" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                Phân tích Hủy/Trả/Hoàn tiền
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Quản lí và phân tích các yêu cầu hủy đơn, trả hàng và hoàn tiền từ TikTok Shop
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">7 ngày qua</option>
                <option value="30d">30 ngày qua</option>
                <option value="90d">90 ngày qua</option>
                <option value="1y">1 năm qua</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                + Tạo yêu cầu
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-4 dark:border-red-800 dark:from-red-900/20 dark:to-red-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Tổng Hủy Đơn
                </p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {aftersalesData.filter(item => item.type === "CANCEL").length}
                </p>
                <p className="text-xs text-red-500 dark:text-red-300 mt-1">
                  {formatCurrency(aftersalesData.filter(item => item.type === "CANCEL").reduce((sum, item) => sum + item.amount, 0), "USD")}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-xl">❌</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Tổng Trả Hàng
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {aftersalesData.filter(item => item.type === "RETURN").length}
                </p>
                <p className="text-xs text-yellow-500 dark:text-yellow-300 mt-1">
                  {formatCurrency(aftersalesData.filter(item => item.type === "RETURN").reduce((sum, item) => sum + item.amount, 0), "USD")}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl dark:from-yellow-900/20 dark:to-orange-900/20 flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">🔄</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Tổng Hoàn Tiền
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(aftersalesData.reduce((sum, item) => sum + item.refundAmount, 0), "USD")}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  {aftersalesData.filter(item => item.refundAmount > 0).length} giao dịch
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Tỷ Lệ Xử Lý
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {Math.round((aftersalesData.filter(item => item.status === "COMPLETED" || item.status === "APPROVED").length / aftersalesData.length) * 100)}%
                </p>
                <p className="text-xs text-green-500 dark:text-green-300 mt-1">
                  Trong SLA
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 p-4 dark:border-purple-800 dark:from-purple-900/20 dark:to-purple-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Chờ Xử Lý
                </p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {aftersalesData.filter(item => item.status === "PENDING").length}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg dark:from-purple-900/20 dark:to-violet-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-lg">⏳</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-4 dark:border-orange-800 dark:from-orange-900/20 dark:to-orange-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Từ Chối
                </p>
                <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  {aftersalesData.filter(item => item.status === "REJECTED").length}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 text-lg">🚫</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 dark:border-cyan-800 dark:from-cyan-900/20 dark:to-cyan-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                  Trung Bình SLA
                </p>
                <p className="text-xl font-bold text-cyan-900 dark:text-cyan-100">
                  2.4h
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg dark:from-cyan-900/20 dark:to-teal-900/20 flex items-center justify-center">
                <span className="text-cyan-600 dark:text-cyan-400 text-lg">⏱️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Phân Bổ Loại Yêu Cầu
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "donut" },
                labels: ["Hủy đơn", "Trả hàng", "Hoàn tiền"],
                colors: ["#EF4444", "#F59E0B", "#3B82F6"],
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
                          label: "Tổng Yêu Cầu",
                          formatter: () => aftersalesData.length.toString(),
                        },
                      },
                    },
                  },
                },
              }}
              series={[
                aftersalesData.filter(item => item.type === "CANCEL").length,
                aftersalesData.filter(item => item.type === "RETURN").length,
                aftersalesData.filter(item => item.type === "REFUND").length,
              ]}
              type="donut"
              height={300}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Trạng Thái Xử Lý
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "bar" },
                xaxis: { 
                  categories: ["Chờ xử lý", "Đã duyệt", "Đã từ chối", "Hoàn thành"],
                  labels: { rotate: -45 }
                },
                colors: ["#F59E0B", "#10B981", "#EF4444", "#3B82F6"],
                dataLabels: { enabled: true },
                plotOptions: {
                  bar: {
                    borderRadius: 4,
                  },
                },
                title: {
                  text: "Số lượng theo trạng thái",
                  style: { fontSize: "14px" },
                },
              }}
              series={[
                {
                  name: "Số lượng",
                  data: [
                    aftersalesData.filter(item => item.status === "PENDING").length,
                    aftersalesData.filter(item => item.status === "APPROVED").length,
                    aftersalesData.filter(item => item.status === "REJECTED").length,
                    aftersalesData.filter(item => item.status === "COMPLETED").length,
                  ],
                },
              ]}
              type="bar"
              height={300}
            />
          </div>
        </div>

        {/* Aftersales Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Danh Sách Yêu Cầu ({filteredData.length} mục)
              </h3>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm yêu cầu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="CANCEL">Hủy đơn</option>
                <option value="RETURN">Trả hàng</option>
                <option value="REFUND">Hoàn tiền</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Đã từ chối</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">ID</th>
                    <th className="px-4 py-3 whitespace-nowrap">Loại</th>
                    <th className="px-4 py-3 whitespace-nowrap">Khách Hàng</th>
                    <th className="px-4 py-3 whitespace-nowrap">Lý Do</th>
                    <th className="px-4 py-3 whitespace-nowrap">Số Tiền</th>
                    <th className="px-4 py-3 whitespace-nowrap">Trạng Thái</th>
                    <th className="px-4 py-3 whitespace-nowrap">SLA</th>
                    <th className="px-4 py-3 whitespace-nowrap">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => {
                    const slaStatus = getSlaStatus(item.slaDeadline);
                    return (
                      <tr
                        key={item.id}
                        className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800 dark:text-white/90">
                            {item.id}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Order: {item.orderId}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(item.type)}`}
                            >
                              {getTypeLabel(item.type)}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getInitiatorBadge(item.initiator)}`}
                            >
                              {getInitiatorLabel(item.initiator)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-800 dark:text-white/90">
                            {item.buyerName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.buyerEmail}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-800 dark:text-white/90">
                            {item.reason}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.reasonCode}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-800 dark:text-white/90">
                            {formatCurrency(item.amount, item.currency)}
                          </div>
                          {item.refundAmount > 0 && (
                            <div className="text-xs text-green-600 dark:text-green-400">
                              Hoàn: {formatCurrency(item.refundAmount, item.currency)}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`text-xs ${slaStatus.color}`}>
                            {slaStatus.text}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(item.slaDeadline)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              Xem
                            </button>
                            {item.status === "PENDING" && (
                              <>
                                <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                  Duyệt
                                </button>
                                <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                  Từ chối
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AftersalesAnalytics;
