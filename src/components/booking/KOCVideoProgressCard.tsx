import React, { useState, useEffect } from 'react';
import { VideoIcon } from '../../icons';

const KOCVideoProgressCard: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const currentValue = 28;
  const targetValue = 40;
  const percentage = Math.round((currentValue / targetValue) * 100);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Animate percentage counter
    const percentageTimer = setTimeout(() => {
      let current = 0;
      const increment = percentage / 20; // 20 steps for faster animation
      const interval = setInterval(() => {
        current += increment;
        if (current >= percentage) {
          setAnimatedPercentage(percentage);
          clearInterval(interval);
        } else {
          setAnimatedPercentage(Math.round(current));
        }
      }, 30);
    }, 200);

    return () => {
      clearTimeout(timer);
      clearTimeout(percentageTimer);
    };
  }, [percentage]);

  return (
    <div className={`rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 px-3 sm:px-4 py-3 dark:border-green-700 dark:from-green-900/20 dark:to-emerald-900/20 h-full transition-all duration-1000 ease-out ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
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
        <div className="text-4xl font-bold text-gray-800 mb-2 transition-all duration-1000 ease-out">
          {animatedPercentage}%
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
            style={{ width: `${animatedPercentage}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Progress percentage on bar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg transition-all duration-1000 ease-out">
            {animatedPercentage}%
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
