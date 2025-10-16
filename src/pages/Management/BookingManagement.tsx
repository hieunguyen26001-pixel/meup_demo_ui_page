import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Chart from "react-apexcharts";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";

const BookingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { isOpen, openModal, closeModal } = useModal();
  
  // Form state for new booking
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    service: "",
    date: "",
    time: "",
    duration: "",
    amount: "",
    phone: "",
    status: "pending"
  });

  // Sample data for booking management
  const bookingData = [
    {
      id: "BK001",
      customerName: "Nguyễn Văn A",
      service: "Quay video quảng cáo",
      date: "2024-01-20",
      time: "09:00",
      duration: "2 giờ",
      status: "confirmed",
      amount: 5000000,
      phone: "0123456789"
    },
    {
      id: "BK002",
      customerName: "Trần Thị B",
      service: "Chụp ảnh sản phẩm",
      date: "2024-01-21",
      time: "14:00",
      duration: "1 giờ",
      status: "pending",
      amount: 2000000,
      phone: "0987654321"
    },
    {
      id: "BK003",
      customerName: "Lê Văn C",
      service: "Livestream bán hàng",
      date: "2024-01-22",
      time: "19:00",
      duration: "3 giờ",
      status: "completed",
      amount: 8000000,
      phone: "0369852147"
    },
    {
      id: "BK004",
      customerName: "Phạm Thị D",
      service: "Quay video hướng dẫn",
      date: "2024-01-23",
      time: "10:00",
      duration: "1.5 giờ",
      status: "cancelled",
      amount: 3000000,
      phone: "0741258963"
    }
  ];

  const filteredBookings = bookingData.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "completed":
        return "Hoàn thành";
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

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewBooking(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!newBooking.customerName.trim()) {
      alert('Vui lòng nhập tên khách hàng');
      return;
    }
    if (!newBooking.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }
    if (!newBooking.service) {
      alert('Vui lòng chọn dịch vụ');
      return;
    }
    if (!newBooking.date) {
      alert('Vui lòng chọn ngày');
      return;
    }
    if (!newBooking.time) {
      alert('Vui lòng chọn giờ');
      return;
    }
    if (!newBooking.duration.trim()) {
      alert('Vui lòng nhập thời lượng');
      return;
    }
    if (!newBooking.amount || parseInt(newBooking.amount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(newBooking.phone.replace(/\s/g, ''))) {
      alert('Số điện thoại không hợp lệ (10-11 chữ số)');
      return;
    }

    // Generate new booking ID
    const newId = `BK${String(bookingData.length + 1).padStart(3, '0')}`;
    
    // Create new booking object
    const booking = {
      id: newId,
      customerName: newBooking.customerName.trim(),
      service: newBooking.service,
      date: newBooking.date,
      time: newBooking.time,
      duration: newBooking.duration.trim(),
      status: newBooking.status,
      amount: parseInt(newBooking.amount),
      phone: newBooking.phone.trim()
    };

    // Here you would typically add the booking to your data source
    console.log('New booking:', booking);
    alert('Thêm booking thành công!');
    
    // Reset form and close modal
    setNewBooking({
      customerName: "",
      service: "",
      date: "",
      time: "",
      duration: "",
      amount: "",
      phone: "",
      status: "pending"
    });
    closeModal();
  };

  // Reset form when modal closes
  const handleCloseModal = () => {
    setNewBooking({
      customerName: "",
      service: "",
      date: "",
      time: "",
      duration: "",
      amount: "",
      phone: "",
      status: "pending"
    });
    closeModal();
  };

  return (
    <>
      <PageMeta title="Quản lí Booking - meup" />
      
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              Quản lí Booking
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lí và theo dõi tất cả đặt lịch dịch vụ
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Tổng Booking
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {bookingData.length}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  Tất cả đặt lịch
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📅</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Đã Xác Nhận
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {bookingData.filter(b => b.status === "confirmed").length}
                </p>
                <p className="text-xs text-green-500 dark:text-green-300 mt-1">
                  Sẵn sàng thực hiện
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
                  Chờ Xác Nhận
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {bookingData.filter(b => b.status === "pending").length}
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
                  Tổng Doanh Thu
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(bookingData.reduce((sum, b) => sum + b.amount, 0))}
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-300 mt-1">
                  Tất cả booking
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
                Phân Bổ Trạng Thái Booking
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "donut" },
                labels: ["Đã xác nhận", "Chờ xác nhận", "Hoàn thành", "Đã hủy"],
                colors: ["#10B981", "#F59E0B", "#3B82F6", "#EF4444"],
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
                          label: "Tổng Booking",
                          formatter: () => bookingData.length.toString(),
                        },
                      },
                    },
                  },
                },
              }}
              series={[
                bookingData.filter(b => b.status === "confirmed").length,
                bookingData.filter(b => b.status === "pending").length,
                bookingData.filter(b => b.status === "completed").length,
                bookingData.filter(b => b.status === "cancelled").length,
              ]}
              type="donut"
              height={300}
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Doanh Thu Theo Dịch Vụ
              </h3>
            </div>
            <Chart
              options={{
                chart: { type: "bar" },
                xaxis: { 
                  categories: ["Quay video quảng cáo", "Chụp ảnh sản phẩm", "Livestream bán hàng", "Quay video hướng dẫn"],
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
                  text: "Doanh thu từng loại dịch vụ",
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
                  data: [5000000, 2000000, 8000000, 3000000],
                },
              ]}
              type="bar"
              height={300}
            />
          </div>
        </div>

        {/* Booking Management Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Danh Sách Booking ({filteredBookings.length} mục)
              </h3>
              <Button 
                onClick={openModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                Thêm mới
              </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm booking..."
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
                <option value="confirmed">Đã xác nhận</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Mã Booking</th>
                    <th className="px-4 py-3 whitespace-nowrap">Khách hàng</th>
                    <th className="px-4 py-3 whitespace-nowrap">Dịch vụ</th>
                    <th className="px-4 py-3 whitespace-nowrap">Ngày & Giờ</th>
                    <th className="px-4 py-3 whitespace-nowrap">Thời lượng</th>
                    <th className="px-4 py-3 whitespace-nowrap">Số tiền</th>
                    <th className="px-4 py-3 whitespace-nowrap">Trạng thái</th>
                    <th className="px-4 py-3 whitespace-nowrap">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800 dark:text-white/90">
                          {booking.id}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800 dark:text-white/90">
                          {booking.customerName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {booking.service}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800 dark:text-white/90">
                          {new Date(booking.date).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.time}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {booking.duration}
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-white/90">
                        {formatCurrency(booking.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(booking.status)}`}
                        >
                          {getStatusLabel(booking.status)}
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

      {/* Add New Booking Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[800px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-8">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Thêm Booking Mới
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Nhập thông tin để tạo booking mới cho khách hàng.
            </p>
          </div>
          
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Tên khách hàng *</Label>
                  <Input 
                    type="text" 
                    value={newBooking.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Nhập tên khách hàng"
                  />
                </div>

                <div>
                  <Label>Số điện thoại *</Label>
                  <Input 
                    type="tel" 
                    value={newBooking.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <Label>Dịch vụ *</Label>
                  <select
                    value={newBooking.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn dịch vụ</option>
                    <option value="Quay video quảng cáo">Quay video quảng cáo</option>
                    <option value="Chụp ảnh sản phẩm">Chụp ảnh sản phẩm</option>
                    <option value="Livestream bán hàng">Livestream bán hàng</option>
                    <option value="Quay video hướng dẫn">Quay video hướng dẫn</option>
                  </select>
                </div>

                <div>
                  <Label>Số tiền (VNĐ) *</Label>
                  <Input 
                    type="number" 
                    value={newBooking.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="Nhập số tiền"
                  />
                </div>

                <div>
                  <Label>Ngày *</Label>
                  <Input 
                    type="date" 
                    value={newBooking.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Giờ *</Label>
                  <Input 
                    type="time" 
                    value={newBooking.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Thời lượng *</Label>
                  <Input 
                    type="text" 
                    value={newBooking.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="VD: 2 giờ, 1.5 giờ"
                  />
                </div>

                <div>
                  <Label>Trạng thái</Label>
                  <select
                    value={newBooking.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button size="sm" onClick={handleSubmit}>
                Thêm Booking
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default BookingManagement;
