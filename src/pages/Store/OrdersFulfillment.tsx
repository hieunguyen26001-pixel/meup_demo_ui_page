import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";

const OrdersFulfillment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("7d");

  // Sample data dựa trên TikTok Shop Orders API
  const ordersData = [
    {
      id: "576461413038785752",
      buyerName: "David Kong",
      buyerEmail: "v2b2V5@chat.seller.tiktok.com",
      buyerPhone: "(+1)213-***-1234",
      address: "1199 Coleman Ave San Jose, CA 95110",
      status: "UNPAID",
      fulfillmentType: "FULFILLMENT_BY_SELLER",
      deliveryType: "HOME_DELIVERY",
      createTime: 1619611561,
      paidTime: 1619611563,
      updateTime: 1619621355,
      trackingNumber: "JX12345",
      shippingProvider: "TT Virtual express",
      paymentMethod: "CCDC",
      currency: "IDR",
      totalAmount: 5000,
      subTotal: 5000,
      shippingFee: 5000,
      sellerDiscount: 5000,
      platformDiscount: 5000,
      tax: 5000,
      smallOrderFee: 3000,
      buyerMessage: "Please ship asap!",
      sellerNote: "seller note",
      cancelReason: "Pricing error",
      isCod: false,
      isSampleOrder: false,
      isReplacementOrder: false,
      lineItems: [
        {
          id: "577086512123755123",
          productName: "Women's Winter Crochet Clothes",
          skuName: "Iphone",
          sellerSku: "red_iphone_256",
          salePrice: 0.01,
          originalPrice: 0.01,
          quantity: 1,
          skuImage: "https://p16-oec-va.itexeitg.com/tos-maliva-d-o5syd03w52-us/46123e87d14f40b69b839",
          displayStatus: "UNPAID",
          packageStatus: "TO_FULFILL",
          isGift: false,
          isDangerousGood: false
        }
      ],
      recipientAddress: {
        fullAddress: "1199 Coleman Ave San Jose, CA 95110",
        phoneNumber: "(+1)213-***-1234",
        name: "David Kong",
        postalCode: "95110",
        regionCode: "US"
      }
    },
    {
      id: "576461413038785753",
      buyerName: "Sarah Johnson",
      buyerEmail: "sarah.j@email.com",
      buyerPhone: "(+1)555-***-9876",
      address: "456 Main St, Los Angeles, CA 90210",
      status: "AWAITING_SHIPMENT",
      fulfillmentType: "FULFILLMENT_BY_SELLER",
      deliveryType: "HOME_DELIVERY",
      createTime: 1619611561,
      paidTime: 1619611563,
      updateTime: 1619621355,
      trackingNumber: null,
      shippingProvider: "TT Virtual express",
      paymentMethod: "PAYPAL",
      currency: "USD",
      totalAmount: 12500,
      subTotal: 10000,
      shippingFee: 2000,
      sellerDiscount: 500,
      platformDiscount: 0,
      tax: 1000,
      smallOrderFee: 0,
      buyerMessage: "Please handle with care",
      sellerNote: "",
      cancelReason: null,
      isCod: false,
      isSampleOrder: false,
      isReplacementOrder: false,
      lineItems: [
        {
          id: "577086512123755124",
          productName: "Men's Casual T-Shirt",
          skuName: "T-Shirt Blue M",
          sellerSku: "tshirt_blue_m",
          salePrice: 25.00,
          originalPrice: 30.00,
          quantity: 2,
          skuImage: "https://example.com/tshirt.jpg",
          displayStatus: "AWAITING_SHIPMENT",
          packageStatus: "TO_FULFILL",
          isGift: false,
          isDangerousGood: false
        }
      ],
      recipientAddress: {
        fullAddress: "456 Main St, Los Angeles, CA 90210",
        phoneNumber: "(+1)555-***-9876",
        name: "Sarah Johnson",
        postalCode: "90210",
        regionCode: "US"
      }
    },
    {
      id: "576461413038785754",
      buyerName: "Mike Chen",
      buyerEmail: "mike.chen@email.com",
      buyerPhone: "(+1)415-***-1234",
      address: "789 Oak Ave, San Francisco, CA 94102",
      status: "SHIPPED",
      fulfillmentType: "FULFILLMENT_BY_SELLER",
      deliveryType: "HOME_DELIVERY",
      createTime: 1619611561,
      paidTime: 1619611563,
      updateTime: 1619621355,
      trackingNumber: "SF789456123",
      shippingProvider: "TT Virtual express",
      paymentMethod: "CREDIT_CARD",
      currency: "USD",
      totalAmount: 8500,
      subTotal: 7500,
      shippingFee: 1000,
      sellerDiscount: 0,
      platformDiscount: 0,
      tax: 0,
      smallOrderFee: 0,
      buyerMessage: "",
      sellerNote: "Priority shipping",
      cancelReason: null,
      isCod: false,
      isSampleOrder: false,
      isReplacementOrder: false,
      lineItems: [
        {
          id: "577086512123755125",
          productName: "Wireless Headphones",
          skuName: "Headphones Black",
          sellerSku: "headphones_black",
          salePrice: 75.00,
          originalPrice: 75.00,
          quantity: 1,
          skuImage: "https://example.com/headphones.jpg",
          displayStatus: "SHIPPED",
          packageStatus: "SHIPPED",
          isGift: false,
          isDangerousGood: false
        }
      ],
      recipientAddress: {
        fullAddress: "789 Oak Ave, San Francisco, CA 94102",
        phoneNumber: "(+1)415-***-1234",
        name: "Mike Chen",
        postalCode: "94102",
        regionCode: "US"
      }
    }
  ];

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.buyerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesFulfillment = fulfillmentFilter === "all" || order.lineItems[0]?.packageStatus === fulfillmentFilter;
    return matchesSearch && matchesStatus && matchesFulfillment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UNPAID":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "AWAITING_SHIPMENT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "UNPAID":
        return "Chưa thanh toán";
      case "AWAITING_SHIPMENT":
        return "Chờ giao hàng";
      case "SHIPPED":
        return "Đã giao";
      case "DELIVERED":
        return "Đã nhận";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getFulfillmentBadge = (status: string) => {
    switch (status) {
      case "TO_FULFILL":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "FULFILLED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getFulfillmentLabel = (status: string) => {
    switch (status) {
      case "TO_FULFILL":
        return "Cần xử lý";
      case "FULFILLED":
        return "Đã xử lý";
      case "SHIPPED":
        return "Đã giao";
      case "DELIVERED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
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

  return (
    <>
      <PageMeta title="Đơn hàng & Fulfillment - meup" />
      
      <div className="mx-auto max-w-screen-2xl p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                🛒 Đơn hàng & Fulfillment
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Quản lí đơn hàng và xử lý fulfillment từ TikTok Shop
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                + Tạo đơn hàng
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                Export Excel
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
                <span className="text-blue-600 dark:text-blue-400 text-xl">📋</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Cần Xử Lý
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {ordersData.filter(o => o.lineItems[0]?.packageStatus === "TO_FULFILL").length}
                </p>
                <p className="text-xs text-yellow-500 dark:text-yellow-300 mt-1">
                  Đang fulfillment
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl dark:from-yellow-900/20 dark:to-orange-900/20 flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Đã Giao
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {ordersData.filter(o => o.lineItems[0]?.packageStatus === "SHIPPED").length}
                </p>
                <p className="text-xs text-green-500 dark:text-green-300 mt-1">
                  Hoàn thành
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
                  Tổng Giá Trị
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(ordersData.reduce((sum, o) => sum + o.totalAmount, 0), "USD")}
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
                Phân Bổ Trạng Thái Fulfillment
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "donut" },
                labels: ["Cần xử lý", "Đã xử lý", "Đã giao", "Hoàn thành", "Đã hủy"],
                colors: ["#3B82F6", "#F59E0B", "#8B5CF6", "#10B981", "#EF4444"],
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
                ordersData.filter(o => o.lineItems[0]?.packageStatus === "TO_FULFILL").length,
                ordersData.filter(o => o.lineItems[0]?.packageStatus === "FULFILLED").length,
                ordersData.filter(o => o.lineItems[0]?.packageStatus === "SHIPPED").length,
                ordersData.filter(o => o.lineItems[0]?.packageStatus === "DELIVERED").length,
                ordersData.filter(o => o.lineItems[0]?.packageStatus === "CANCELLED").length,
              ]}
              type="donut"
              height={300}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Đơn Hàng Theo Ngày
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
                  text: "Số đơn hàng theo ngày",
                  style: { fontSize: "14px" },
                },
              }}
              series={[
                {
                  name: "Đơn hàng",
                  data: [1, 2, 2, 0, 0],
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
                <option value="UNPAID">Chưa thanh toán</option>
                <option value="AWAITING_SHIPMENT">Chờ giao hàng</option>
                <option value="SHIPPED">Đã giao</option>
                <option value="DELIVERED">Đã nhận</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
              <select
                value={fulfillmentFilter}
                onChange={(e) => setFulfillmentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả fulfillment</option>
                <option value="TO_FULFILL">Cần xử lý</option>
                <option value="FULFILLED">Đã xử lý</option>
                <option value="SHIPPED">Đã giao</option>
                <option value="DELIVERED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
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
                    <th className="px-4 py-3 whitespace-nowrap">Fulfillment</th>
                    <th className="px-4 py-3 whitespace-nowrap">Tracking</th>
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
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(order.createTime)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800 dark:text-white/90">
                          {order.buyerName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {order.buyerPhone}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {order.address.substring(0, 30)}...
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800 dark:text-white/90">
                          {order.lineItems.map((item, index) => (
                            <div key={index} className="text-sm">
                              {item.productName} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {formatCurrency(order.totalAmount, order.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getFulfillmentBadge(order.lineItems[0]?.packageStatus || "TO_FULFILL")}`}
                        >
                          {getFulfillmentLabel(order.lineItems[0]?.packageStatus || "TO_FULFILL")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {order.trackingNumber ? (
                          <div className="text-blue-600 dark:text-blue-400 text-sm">
                            {order.trackingNumber}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            Chưa có
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            Xem
                          </button>
                          <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                            Xử lý
                          </button>
                          <button className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                            In nhãn
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

export default OrdersFulfillment;
