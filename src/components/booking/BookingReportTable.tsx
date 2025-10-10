import React from 'react';
import { PlusIcon, PencilIcon, TrashBinIcon, ChevronLeftIcon, ChevronRightIcon } from '../../icons';

const BookingReportTable: React.FC = () => {
  const data = [
    {
      id: 1,
      responsiblePerson: "User Name",
      reportDate: "2025-10-08",
      searchCount: 50,
      responseCount: 30,
      agreedCount: 10,
      videoCount: 5,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    },
    {
      id: 2,
      responsiblePerson: "User Name",
      reportDate: "2025-10-23",
      searchCount: 3,
      responseCount: 3,
      agreedCount: 3,
      videoCount: 3,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    },
    {
      id: 3,
      responsiblePerson: "User Name",
      reportDate: "2025-10-20",
      searchCount: 1,
      responseCount: 1,
      agreedCount: 1,
      videoCount: 1,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    },
    {
      id: 4,
      responsiblePerson: "User Name",
      reportDate: "2025-10-08",
      searchCount: 30,
      responseCount: 10,
      agreedCount: 5,
      videoCount: 2,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    },
    {
      id: 5,
      responsiblePerson: "User Name",
      reportDate: "2025-10-04",
      searchCount: 21,
      responseCount: 12,
      agreedCount: 11,
      videoCount: 8,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    },
    {
      id: 6,
      responsiblePerson: "User Name",
      reportDate: "2025-10-03",
      searchCount: 11,
      responseCount: 6,
      agreedCount: 6,
      videoCount: 4,
      shopName: "LAFIT - Số 1 Gen Nịt Bụng"
    }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách Báo cáo Booking
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                Người phụ trách
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ngày báo cáo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                SL KOC Tìm kiếm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                SL KOC Phản hồi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                SL KOC Đồng ý
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                SL KOC Lên Video
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tên Shop
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
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
                  {row.responsiblePerson}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.reportDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.searchCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.responseCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.agreedCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.videoCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {row.shopName}
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
    </div>
  );
};

export default BookingReportTable;
