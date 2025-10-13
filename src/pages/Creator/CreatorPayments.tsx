import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const CreatorPayments: React.FC = () => {
  return (
    <>
      <PageMeta title="Thanh toán Creator - meup" description="Quản lý thanh toán và chi phí cho Creator" />
      
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Thanh toán Creator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý thanh toán và chi phí cho các Creator
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
              Thanh toán Creator
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

export default CreatorPayments;

