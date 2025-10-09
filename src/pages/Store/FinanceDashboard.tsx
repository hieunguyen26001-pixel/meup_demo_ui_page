import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";

const FinanceDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");

  // Sample financial data từ TikTok Shop API
  const financialData = {
    totalRevenue: 125000000,
    totalOrders: 3420,
    avgOrderValue: 36550,
    totalProfit: 45000000,
    profitMargin: 36.0,
    refundRate: 2.5,
    pendingPayments: 8500000,
    settledPayments: 116500000,
    commission: 18750000,
    shippingCosts: 8500000,
    marketingCosts: 12000000,
    platformFees: 6250000
  };

  const revenueData = [
    { date: "2024-01-01", revenue: 1200000, orders: 35 },
    { date: "2024-01-02", revenue: 1350000, orders: 42 },
    { date: "2024-01-03", revenue: 1100000, orders: 38 },
    { date: "2024-01-04", revenue: 1450000, orders: 45 },
    { date: "2024-01-05", revenue: 1600000, orders: 52 },
    { date: "2024-01-06", revenue: 1800000, orders: 58 },
    { date: "2024-01-07", revenue: 1750000, orders: 56 }
  ];

  const expenseBreakdown = [
    { category: "Chi phí sản phẩm", amount: 80000000, percentage: 64.0 },
    { category: "Phí nền tảng", amount: 6250000, percentage: 5.0 },
    { category: "Chi phí vận chuyển", amount: 8500000, percentage: 6.8 },
    { category: "Chi phí marketing", amount: 12000000, percentage: 9.6 },
    { category: "Chi phí khác", amount: 18250000, percentage: 14.6 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <>
      <PageMeta title="Tài chính - meup" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                💰 Dashboard Tài chính
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Theo dõi doanh thu, chi phí và lợi nhuận từ TikTok Shop
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
            </div>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Tổng Doanh Thu
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(financialData.totalRevenue)}
                </p>
                <p className="text-xs text-green-500 dark:text-green-300 mt-1">
                  {financialData.totalOrders.toLocaleString()} đơn hàng
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Lợi Nhuận Ròng
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(financialData.totalProfit)}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  Biên lợi nhuận {formatPercentage(financialData.profitMargin)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📈</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 p-4 dark:border-purple-800 dark:from-purple-900/20 dark:to-purple-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Đã Thanh Toán
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(financialData.settledPayments)}
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-300 mt-1">
                  Đã chuyển về tài khoản
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl dark:from-purple-900/20 dark:to-violet-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-4 dark:border-orange-800 dark:from-orange-900/20 dark:to-orange-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Chờ Thanh Toán
                </p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {formatCurrency(financialData.pendingPayments)}
                </p>
                <p className="text-xs text-orange-500 dark:text-orange-300 mt-1">
                  Đang xử lý
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 text-xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Financial Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 dark:border-cyan-800 dark:from-cyan-900/20 dark:to-cyan-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                  Giá Trị Đơn TB
                </p>
                <p className="text-xl font-bold text-cyan-900 dark:text-cyan-100">
                  {formatCurrency(financialData.avgOrderValue)}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg dark:from-cyan-900/20 dark:to-teal-900/20 flex items-center justify-center">
                <span className="text-cyan-600 dark:text-cyan-400 text-lg">📊</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 to-pink-100 p-4 dark:border-pink-800 dark:from-pink-900/20 dark:to-pink-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400">
                  Tỷ Lệ Hoàn Hàng
                </p>
                <p className="text-xl font-bold text-pink-900 dark:text-pink-100">
                  {formatPercentage(financialData.refundRate)}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg dark:from-pink-900/20 dark:to-rose-900/20 flex items-center justify-center">
                <span className="text-pink-600 dark:text-pink-400 text-lg">🔄</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 dark:border-indigo-800 dark:from-indigo-900/20 dark:to-indigo-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Phí Nền Tảng
                </p>
                <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
                  {formatCurrency(financialData.platformFees)}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg dark:from-indigo-900/20 dark:to-blue-900/20 flex items-center justify-center">
                <span className="text-indigo-600 dark:text-indigo-400 text-lg">🏢</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Doanh Thu Theo Ngày
              </h3>
            </div>
            <Chart
              options={{
                chart: { 
                  type: "area",
                  toolbar: { show: false }
                },
                xaxis: { 
                  categories: revenueData.map(d => new Date(d.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }))
                },
                colors: ["#10B981"],
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
                yaxis: {
                  labels: {
                    formatter: (val) => formatCurrency(val),
                  },
                },
                tooltip: {
                  y: {
                    formatter: (val) => formatCurrency(val),
                  },
                },
              }}
              series={[
                {
                  name: "Doanh thu",
                  data: revenueData.map(d => d.revenue),
                },
              ]}
              type="area"
              height={300}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Phân Bổ Chi Phí
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "donut" },
                labels: expenseBreakdown.map(e => e.category),
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
                          label: "Tổng Chi Phí",
                          formatter: () => formatCurrency(expenseBreakdown.reduce((sum, e) => sum + e.amount, 0)),
                        },
                      },
                    },
                  },
                },
                tooltip: {
                  y: {
                    formatter: (val) => formatCurrency(val),
                  },
                },
              }}
              series={expenseBreakdown.map(e => e.amount)}
              type="donut"
              height={300}
            />
          </div>
        </div>

        {/* Financial Summary Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Tóm Tắt Tài Chính Chi Tiết
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Danh Mục</th>
                    <th className="px-4 py-3 whitespace-nowrap">Số Tiền</th>
                    <th className="px-4 py-3 whitespace-nowrap">Tỷ Lệ</th>
                    <th className="px-4 py-3 whitespace-nowrap">Ghi Chú</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">Tổng Doanh Thu</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">
                      {formatCurrency(financialData.totalRevenue)}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-white/90">100%</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">Từ {financialData.totalOrders.toLocaleString()} đơn hàng</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">Chi phí sản phẩm</td>
                    <td className="px-4 py-3 text-red-600 dark:text-red-400">
                      -{formatCurrency(expenseBreakdown[0].amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-white/90">{formatPercentage(expenseBreakdown[0].percentage)}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">Giá vốn hàng bán</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">Phí nền tảng</td>
                    <td className="px-4 py-3 text-red-600 dark:text-red-400">
                      -{formatCurrency(financialData.platformFees)}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-white/90">5.0%</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">Phí TikTok Shop</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">Chi phí vận chuyển</td>
                    <td className="px-4 py-3 text-red-600 dark:text-red-400">
                      -{formatCurrency(financialData.shippingCosts)}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-white/90">6.8%</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">Phí ship & logistics</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">Chi phí marketing</td>
                    <td className="px-4 py-3 text-red-600 dark:text-red-400">
                      -{formatCurrency(financialData.marketingCosts)}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-white/90">9.6%</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">Quảng cáo & promotion</td>
                  </tr>
                  <tr className="bg-green-50 dark:bg-green-900/10 border-b dark:border-gray-700">
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-white/90">Lợi nhuận ròng</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-bold text-lg">
                      {formatCurrency(financialData.totalProfit)}
                    </td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-bold">
                      {formatPercentage(financialData.profitMargin)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">Sau tất cả chi phí</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinanceDashboard;
