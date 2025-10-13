import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const CreatorContracts: React.FC = () => {
  return (
    <>
      <PageMeta title="Quản lí Hợp đồng Creator - meup" description="Quản lý hợp đồng và thỏa thuận với Creator" />
      
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Quản lí Hợp đồng Creator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý hợp đồng và thỏa thuận với các Creator
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
              Quản lí Hợp đồng Creator
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

export default CreatorContracts;

