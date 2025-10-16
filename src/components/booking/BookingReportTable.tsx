import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashBinIcon, ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { Modal } from '../ui/modal';
import { useModal } from '../../hooks/useModal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';

const BookingReportTable: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  
  // Form state for new booking report
  const [newReport, setNewReport] = useState({
    responsiblePerson: "",
    reportDate: "",
    searchCount: "",
    responseCount: "",
    agreedCount: "",
    videoCount: "",
    shopName: ""
  });

  const data = [
    {
      id: 1,
      responsiblePerson: "HieuNM",
      reportDate: "2025-10-08",
      searchCount: 50,
      responseCount: 30,
      agreedCount: 10,
      videoCount: 5,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    },
    {
      id: 2,
      responsiblePerson: "MinhTT",
      reportDate: "2025-10-23",
      searchCount: 3,
      responseCount: 3,
      agreedCount: 3,
      videoCount: 3,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    },
    {
      id: 3,
      responsiblePerson: "LinhLV",
      reportDate: "2025-10-04",
      searchCount: 30,
      responseCount: 21,
      agreedCount: 12,
      videoCount: 11,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    },
    {
      id: 4,
      responsiblePerson: "DungPT",
      reportDate: "2025-10-03",
      searchCount: 22,
      responseCount: 11,
      agreedCount: 6,
      videoCount: 6,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    },
    {
      id: 5,
      responsiblePerson: "HieuNM",
      reportDate: "2025-10-01",
      searchCount: 22,
      responseCount: 5,
      agreedCount: 2,
      videoCount: 2,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    },
    {
      id: 6,
      responsiblePerson: "MinhTT",
      reportDate: "2025-10-20",
      searchCount: 1,
      responseCount: 1,
      agreedCount: 1,
      videoCount: 1,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    }
  ];

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!newReport.responsiblePerson.trim()) {
      alert('Vui lòng nhập tên người phụ trách');
      return;
    }
    if (!newReport.reportDate) {
      alert('Vui lòng chọn ngày báo cáo');
      return;
    }
    if (!newReport.shopName.trim()) {
      alert('Vui lòng nhập tên shop');
      return;
    }
    if (!newReport.searchCount || parseInt(newReport.searchCount) < 0) {
      alert('Vui lòng nhập số lượng KOC tìm kiếm hợp lệ');
      return;
    }
    if (!newReport.responseCount || parseInt(newReport.responseCount) < 0) {
      alert('Vui lòng nhập số lượng KOC phản hồi hợp lệ');
      return;
    }
    if (!newReport.agreedCount || parseInt(newReport.agreedCount) < 0) {
      alert('Vui lòng nhập số lượng KOC đồng ý hợp lệ');
      return;
    }
    if (!newReport.videoCount || parseInt(newReport.videoCount) < 0) {
      alert('Vui lòng nhập số lượng KOC lên video hợp lệ');
      return;
    }

    // Create new report object
    const report = {
      id: data.length + 1,
      responsiblePerson: newReport.responsiblePerson.trim(),
      reportDate: newReport.reportDate,
      searchCount: parseInt(newReport.searchCount),
      responseCount: parseInt(newReport.responseCount),
      agreedCount: parseInt(newReport.agreedCount),
      videoCount: parseInt(newReport.videoCount),
      shopName: newReport.shopName.trim()
    };

    // Here you would typically add the report to your data source
    console.log('New booking report:', report);
    alert('Thêm báo cáo booking thành công!');
    
    // Reset form and close modal
    setNewReport({
      responsiblePerson: "",
      reportDate: "",
      searchCount: "",
      responseCount: "",
      agreedCount: "",
      videoCount: "",
      shopName: ""
    });
    closeModal();
  };

  // Reset form when modal closes
  const handleCloseModal = () => {
    setNewReport({
      responsiblePerson: "",
      reportDate: "",
      searchCount: "",
      responseCount: "",
      agreedCount: "",
      videoCount: "",
      shopName: ""
    });
    closeModal();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách Báo cáo Booking
          </h3>
          <button 
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Thêm mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                STT
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Người phụ trách
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ngày báo cáo
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                SL KOC Tìm kiếm
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                SL KOC Phản hồi
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                SL KOC Đồng ý
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                SL KOC Lên Video
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.id}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.responsiblePerson}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.reportDate}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.searchCount}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.responseCount}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.agreedCount}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.videoCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      <TrashBinIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Hiển thị 1-6 của 6 kết quả
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</span>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <select className="ml-4 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>10/ trang</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add New Booking Report Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[800px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-8">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Thêm Báo cáo Booking Mới
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Nhập thông tin để tạo báo cáo booking mới.
            </p>
          </div>
          
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Người phụ trách *</Label>
                  <Input 
                    type="text" 
                    value={newReport.responsiblePerson}
                    onChange={(e) => handleInputChange('responsiblePerson', e.target.value)}
                    placeholder="Nhập tên người phụ trách"
                  />
                </div>

                <div>
                  <Label>Ngày báo cáo *</Label>
                  <Input 
                    type="date" 
                    value={newReport.reportDate}
                    onChange={(e) => handleInputChange('reportDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Tên shop *</Label>
                  <Input 
                    type="text" 
                    value={newReport.shopName}
                    onChange={(e) => handleInputChange('shopName', e.target.value)}
                    placeholder="Nhập tên shop"
                  />
                </div>

                <div>
                  <Label>Số lượng KOC Tìm kiếm *</Label>
                  <Input 
                    type="number" 
                    value={newReport.searchCount}
                    onChange={(e) => handleInputChange('searchCount', e.target.value)}
                    placeholder="Nhập số lượng"
                    min="0"
                  />
                </div>

                <div>
                  <Label>Số lượng KOC Phản hồi *</Label>
                  <Input 
                    type="number" 
                    value={newReport.responseCount}
                    onChange={(e) => handleInputChange('responseCount', e.target.value)}
                    placeholder="Nhập số lượng"
                    min="0"
                  />
                </div>

                <div>
                  <Label>Số lượng KOC Đồng ý *</Label>
                  <Input 
                    type="number" 
                    value={newReport.agreedCount}
                    onChange={(e) => handleInputChange('agreedCount', e.target.value)}
                    placeholder="Nhập số lượng"
                    min="0"
                  />
                </div>

                <div>
                  <Label>Số lượng KOC Lên Video *</Label>
                  <Input 
                    type="number" 
                    value={newReport.videoCount}
                    onChange={(e) => handleInputChange('videoCount', e.target.value)}
                    placeholder="Nhập số lượng"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button size="sm" onClick={handleSubmit}>
                Thêm Báo cáo
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default BookingReportTable;
