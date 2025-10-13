import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const CreatorList: React.FC = () => {
  return (
    <>
      <PageMeta title="Danh sách Creator - meup" description="Quản lý danh sách các Creator" />
      
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Danh sách Creator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý và theo dõi thông tin các Creator
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
              Danh sách Creator
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Trang này đang được phát triển
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorList;

