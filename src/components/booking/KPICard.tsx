import React from 'react';

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color }) => {
  const colorConfig = {
    blue: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      iconBg: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    orange: {
      iconBg: 'bg-orange-100 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    purple: {
      iconBg: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  };

  const config = colorConfig[color];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className={`flex items-center justify-center w-10 h-10 ${config.iconBg} rounded-xl mb-3`}>
        <Icon className={`${config.iconColor} size-5`} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-base text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
            {value.toLocaleString()}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
