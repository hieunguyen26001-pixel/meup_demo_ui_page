import React from 'react';
import { VideoIcon } from '../../icons';

const KOCVideoProgressCard: React.FC = () => {
  const currentValue = 28;
  const targetValue = 40;
  const percentage = Math.round((currentValue / targetValue) * 100);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] row-span-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl dark:bg-green-900/20">
          <VideoIcon className="text-green-600 size-5 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            TIẾN ĐỘ KOC LÀM VIDEO
          </h3>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
          {percentage}%
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hiện tại {currentValue} | Mục tiêu {targetValue}
        </p>
      </div>

      {/* Animated Progress Bar */}
      <div className="relative mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-2000 ease-out relative"
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
        
        {/* Progress percentage on bar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Additional info */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 border border-green-200 dark:border-green-700">
        <div className="text-center">
          <div className="text-sm font-semibold text-green-800 dark:text-green-200">
            Còn lại: <span className="text-lg font-bold">{targetValue - currentValue} Video</span> để đạt mục tiêu
          </div>
        </div>
      </div>
    </div>
  );
};

export default KOCVideoProgressCard;
