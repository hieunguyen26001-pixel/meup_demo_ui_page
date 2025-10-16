import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashBinIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon } from '../../icons';
import { Modal } from '../ui/modal';
import { useModal } from '../../hooks/useModal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';

const KOCVideoLinksTable: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  
  // Form state for new KOC video link
  const [newVideoLink, setNewVideoLink] = useState({
    channelId: "",
    videoLink: "",
    adsCode: "",
    responsiblePerson: "",
    shopName: "",
    creationDate: ""
  });

  const data = [
    {
      id: 1,
      channelId: "hongthethaone444",
      videoLink: "https://www.tiktok.com/@hongthethaone/video/75250961123703718583434",
      adsCode: "22uuuuqqqqaoozzdddd",
      responsiblePerson: "HieuNM",
      shopName: "LAFIT - Số 1 Gen Nịt Bụng",
      creationDate: "09/10/2025"
    },
    {
      id: 2,
      channelId: "hongthethaone",
      videoLink: "https://www.tiktok.com/@hongthethaone/video/7525096112370371858",
      adsCode: "22uuuuqqqqaoozzdddd",
      responsiblePerson: "LinhLV",
      shopName: "LAFIT - Số 1 Gen Nịt Bụng",
      creationDate: "03/10/2025"
    }
  ];

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewVideoLink(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!newVideoLink.channelId.trim()) {
      alert('Vui lòng nhập ID kênh');
      return;
    }
    if (!newVideoLink.videoLink.trim()) {
      alert('Vui lòng nhập link video');
      return;
    }
    if (!newVideoLink.adsCode.trim()) {
      alert('Vui lòng nhập mã code ads');
      return;
    }
    if (!newVideoLink.responsiblePerson.trim()) {
      alert('Vui lòng nhập tên người phụ trách');
      return;
    }
    if (!newVideoLink.shopName.trim()) {
      alert('Vui lòng nhập tên shop');
      return;
    }
    if (!newVideoLink.creationDate) {
      alert('Vui lòng chọn ngày tạo');
      return;
    }

    // Validate URL format
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(newVideoLink.videoLink.trim())) {
      alert('Link video không hợp lệ (phải bắt đầu bằng http:// hoặc https://)');
      return;
    }

    // Create new video link object
    const videoLink = {
      id: data.length + 1,
      channelId: newVideoLink.channelId.trim(),
      videoLink: newVideoLink.videoLink.trim(),
      adsCode: newVideoLink.adsCode.trim(),
      responsiblePerson: newVideoLink.responsiblePerson.trim(),
      shopName: newVideoLink.shopName.trim(),
      creationDate: newVideoLink.creationDate
    };

    // Here you would typically add the video link to your data source
    console.log('New KOC video link:', videoLink);
    alert('Thêm KOC video link thành công!');
    
    // Reset form and close modal
    setNewVideoLink({
      channelId: "",
      videoLink: "",
      adsCode: "",
      responsiblePerson: "",
      shopName: "",
      creationDate: ""
    });
    closeModal();
  };

  // Reset form when modal closes
  const handleCloseModal = () => {
    setNewVideoLink({
      channelId: "",
      videoLink: "",
      adsCode: "",
      responsiblePerson: "",
      shopName: "",
      creationDate: ""
    });
    closeModal();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách KOC Video Links
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
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ID Kênh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Link Video
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Mã Code Ads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Người phụ trách
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.channelId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  <a 
                    href={row.videoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline truncate block max-w-xs"
                  >
                    {row.videoLink}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2 relative">
                    <span className="font-mono">**********</span>
                    <button 
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative"
                      onClick={() => {
                        navigator.clipboard.writeText(row.adsCode);
                        setCopiedIndex(row.id);
                        setTimeout(() => setCopiedIndex(null), 2000);
                      }}
                      title="Sao chép mã code"
                    >
                      <CopyIcon className="w-4 h-4" />
                      {copiedIndex === row.id && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                          Đã sao chép!
                        </div>
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.responsiblePerson}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.creationDate}
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
            Hiển thị 1-2 của 2 kết quả
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

      {/* Add New KOC Video Link Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[800px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-8">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Thêm KOC Video Link Mới
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Nhập thông tin để thêm KOC video link mới.
            </p>
          </div>
          
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>ID Kênh *</Label>
                  <Input 
                    type="text" 
                    value={newVideoLink.channelId}
                    onChange={(e) => handleInputChange('channelId', e.target.value)}
                    placeholder="Nhập ID kênh"
                  />
                </div>

                <div>
                  <Label>Ngày tạo *</Label>
                  <Input 
                    type="date" 
                    value={newVideoLink.creationDate}
                    onChange={(e) => handleInputChange('creationDate', e.target.value)}
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label>Link Video *</Label>
                  <Input 
                    type="url" 
                    value={newVideoLink.videoLink}
                    onChange={(e) => handleInputChange('videoLink', e.target.value)}
                    placeholder="https://www.tiktok.com/@username/video/..."
                  />
                </div>

                <div>
                  <Label>Mã Code Ads *</Label>
                  <Input 
                    type="text" 
                    value={newVideoLink.adsCode}
                    onChange={(e) => handleInputChange('adsCode', e.target.value)}
                    placeholder="Nhập mã code ads"
                  />
                </div>

                <div>
                  <Label>Người phụ trách *</Label>
                  <Input 
                    type="text" 
                    value={newVideoLink.responsiblePerson}
                    onChange={(e) => handleInputChange('responsiblePerson', e.target.value)}
                    placeholder="Nhập tên người phụ trách"
                  />
                </div>

                <div>
                  <Label>Tên Shop *</Label>
                  <Input 
                    type="text" 
                    value={newVideoLink.shopName}
                    onChange={(e) => handleInputChange('shopName', e.target.value)}
                    placeholder="Nhập tên shop"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button size="sm" onClick={handleSubmit}>
                Thêm Video Link
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default KOCVideoLinksTable;
