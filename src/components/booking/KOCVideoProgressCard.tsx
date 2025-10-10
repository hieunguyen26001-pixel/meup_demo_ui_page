import React from 'react';
import { VideoIcon } from '../../icons';

const KOCVideoProgressCard: React.FC = () => {
  const currentValue = 28;
  const targetValue = 40;
  const percentage = Math.round((currentValue / targetValue) * 100);

  return (
    <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 px-4 sm:px-6 py-4 dark:border-green-700 dark:from-green-900/20 dark:to-emerald-900/20 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-white/80 rounded-xl shadow-sm">
          <VideoIcon className="text-blue-600 size-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            TIẾN ĐỘ KOC LÀM VIDEO
          </h3>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gray-800 mb-2">
          {percentage}%
        </div>
        <p className="text-sm text-gray-600">
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
      <div className="bg-white/60 rounded-xl p-3 border border-white/40">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-700">
            Còn lại: <span className="text-lg font-bold text-blue-600">{targetValue - currentValue} Video</span> để đạt mục tiêu
          </div>
        </div>
      </div>
    </div>
  );
};

export default KOCVideoProgressCard;
