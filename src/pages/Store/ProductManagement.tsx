import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";

const ProductManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample product data từ TikTok Shop API
  const productsData = [
    {
      id: "PROD001",
      name: "Áo thun nam cao cấp",
      sku: "ATN-001",
      category: "Thời trang nam",
      price: 250000,
      originalPrice: 350000,
      stock: 150,
      sold: 45,
      status: "active",
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop"],
      description: "Áo thun nam chất liệu cotton cao cấp",
      tags: ["thời trang", "nam", "cotton"],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20"
    },
    {
      id: "PROD002",
      name: "Quần jean nữ slim fit",
      sku: "QJN-002",
      category: "Thời trang nữ",
      price: 450000,
      originalPrice: 600000,
      stock: 80,
      sold: 32,
      status: "active",
      images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100&h=100&fit=crop"],
      description: "Quần jean nữ slim fit chất liệu denim cao cấp",
      tags: ["thời trang", "nữ", "jean"],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18"
    },
    {
      id: "PROD003",
      name: "Giày thể thao Nike",
      sku: "GTN-003",
      category: "Giày dép",
      price: 800000,
      originalPrice: 1200000,
      stock: 25,
      sold: 18,
      status: "low_stock",
      images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop"],
      description: "Giày thể thao Nike Air Max chất lượng cao",
      tags: ["giày", "thể thao", "nike"],
      createdAt: "2024-01-05",
      updatedAt: "2024-01-19"
    },
    {
      id: "PROD004",
      name: "Túi xách da thật",
      sku: "TXD-004",
      category: "Phụ kiện",
      price: 350000,
      originalPrice: 500000,
      stock: 0,
      sold: 12,
      status: "out_of_stock",
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop"],
      description: "Túi xách da thật handmade",
      tags: ["túi", "da", "handmade"],
      createdAt: "2024-01-08",
      updatedAt: "2024-01-17"
    }
  ];

  const categories = [...new Set(productsData.map(p => p.category))];

  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "out_of_stock":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Đang bán";
      case "low_stock":
        return "Sắp hết hàng";
      case "out_of_stock":
        return "Hết hàng";
      case "inactive":
        return "Ngừng bán";
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

  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <>
      <PageMeta title="Quản lí Sản phẩm - meup" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                📦 Quản lí Sản phẩm
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Quản lí danh mục sản phẩm trên TikTok Shop
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                + Thêm sản phẩm
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                Import Excel
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Tổng Sản Phẩm
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {productsData.length}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  Tất cả sản phẩm
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📦</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Đang Bán
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {productsData.filter(p => p.status === "active").length}
                </p>
                <p className="text-xs text-green-500 dark:text-green-300 mt-1">
                  Sản phẩm hoạt động
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
                  Sắp Hết Hàng
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {productsData.filter(p => p.status === "low_stock").length}
                </p>
                <p className="text-xs text-yellow-500 dark:text-yellow-300 mt-1">
                  Cần nhập thêm
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl dark:from-yellow-900/20 dark:to-orange-900/20 flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-4 dark:border-red-800 dark:from-red-900/20 dark:to-red-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Hết Hàng
                </p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {productsData.filter(p => p.status === "out_of_stock").length}
                </p>
                <p className="text-xs text-red-500 dark:text-red-300 mt-1">
                  Cần bổ sung
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-xl">❌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Phân Bổ Theo Danh Mục
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "donut" },
                labels: categories,
                colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
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
                          label: "Tổng SP",
                          formatter: () => productsData.length.toString(),
                        },
                      },
                    },
                  },
                },
              }}
              series={categories.map(cat => 
                productsData.filter(p => p.category === cat).length
              )}
              type="donut"
              height={300}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Top Sản Phẩm Bán Chạy
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "bar" },
                xaxis: { 
                  categories: productsData
                    .sort((a, b) => b.sold - a.sold)
                    .slice(0, 4)
                    .map(p => p.name.substring(0, 15) + "..."),
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
                  text: "Số lượng đã bán",
                  style: { fontSize: "14px" },
                },
              }}
              series={[
                {
                  name: "Đã bán",
                  data: productsData
                    .sort((a, b) => b.sold - a.sold)
                    .slice(0, 4)
                    .map(p => p.sold),
                },
              ]}
              type="bar"
              height={300}
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Danh Sách Sản Phẩm ({filteredProducts.length} mục)
              </h3>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="low_stock">Sắp hết hàng</option>
                <option value="out_of_stock">Hết hàng</option>
                <option value="inactive">Ngừng bán</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Sản Phẩm</th>
                    <th className="px-4 py-3 whitespace-nowrap">SKU</th>
                    <th className="px-4 py-3 whitespace-nowrap">Danh Mục</th>
                    <th className="px-4 py-3 whitespace-nowrap">Giá</th>
                    <th className="px-4 py-3 whitespace-nowrap">Tồn Kho</th>
                    <th className="px-4 py-3 whitespace-nowrap">Đã Bán</th>
                    <th className="px-4 py-3 whitespace-nowrap">Trạng Thái</th>
                    <th className="px-4 py-3 whitespace-nowrap">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white/90">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {product.category}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800 dark:text-white/90">
                          {formatCurrency(product.price)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="line-through">{formatCurrency(product.originalPrice)}</span>
                          <span className="text-red-500 ml-1">-{calculateDiscount(product.originalPrice, product.price)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {product.stock}
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {product.sold}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(product.status)}`}
                        >
                          {getStatusLabel(product.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            Chỉnh sửa
                          </button>
                          <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                            Nhập kho
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

export default ProductManagement;
