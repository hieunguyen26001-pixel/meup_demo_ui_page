import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

// Lazy load ApexCharts only when needed
const ApexChart = lazy(() => import('react-apexcharts'));

interface LazyChartProps {
  options: any;
  series: any;
  type: string;
  height?: string | number;
  width?: string | number;
  className?: string;
}

const LazyChart: React.FC<LazyChartProps> = ({ 
  options, 
  series, 
  type, 
  height = 350, 
  width = '100%',
  className = ''
}) => {
  return (
    <Suspense fallback={
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <LoadingSpinner />
      </div>
    }>
      <ApexChart
        options={options}
        series={series}
        type={type}
        height={height}
        width={width}
        className={className}
      />
    </Suspense>
  );
};

export default LazyChart;
