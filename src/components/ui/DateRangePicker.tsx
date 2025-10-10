import React, { useState, useRef, useEffect } from 'react';
import { CalenderIcon } from '../../icons';

interface DateRangePickerProps {
  value?: Date[];
  onChange?: (dates: Date[]) => void;
  placeholder?: string;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value = [],
  onChange,
  placeholder = "Chọn khoảng thời gian",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>(value);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [previewDates, setPreviewDates] = useState<Date[]>([]);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Update selectedDates when value prop changes
  useEffect(() => {
    setSelectedDates(value);
  }, [value]);

  // Quick selection options
  const quickOptions = [
    { label: 'Hôm nay', getDates: () => [new Date()] },
    { label: 'Hôm qua', getDates: () => [new Date(Date.now() - 24 * 60 * 60 * 1000)] },
    { label: '7 ngày qua', getDates: () => [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()] },
    { label: '30 ngày qua', getDates: () => [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()] },
  ];

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle open with animation
  const handleOpen = () => {
    setIsAnimating(true);
    setIsOpen(true);
  };

  // Handle close with animation
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 200); // Match animation duration
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get display text
  const getDisplayText = () => {
    if (selectedDates.length === 0) return placeholder;
    if (selectedDates.length === 1) return formatDate(selectedDates[0]);
    if (selectedDates.length === 2) {
      return `${formatDate(selectedDates[0])} - ${formatDate(selectedDates[1])}`;
    }
    return placeholder;
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    let newDates: Date[];
    
    if (selectedDates.length === 0) {
      newDates = [date];
    } else if (selectedDates.length === 1) {
      const firstDate = selectedDates[0];
      if (date < firstDate) {
        newDates = [date, firstDate];
      } else {
        newDates = [firstDate, date];
      }
    } else {
      newDates = [date];
    }
    
    setSelectedDates(newDates);
    onChange?.(newDates);
  };

  // Handle quick selection
  const handleQuickSelect = (getDates: () => Date[]) => {
    const dates = getDates();
    setSelectedDates(dates);
    onChange?.(dates);
    handleClose();
  };

  // Handle quick option hover
  const handleQuickOptionHover = (getDates: () => Date[]) => {
    const dates = getDates();
    setPreviewDates(dates);
  };

  // Handle quick option leave
  const handleQuickOptionLeave = () => {
    setPreviewDates([]);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedDates([]);
    onChange?.([]);
  };

  // Check if date is in range
  const isDateInRange = (date: Date) => {
    if (selectedDates.length < 2) return false;
    return date >= selectedDates[0] && date <= selectedDates[1];
  };

  // Check if date is in preview range
  const isDateInPreviewRange = (date: Date) => {
    if (previewDates.length === 0) return false;
    if (previewDates.length === 1) {
      return date.toDateString() === previewDates[0].toDateString();
    }
    return date >= previewDates[0] && date <= previewDates[1];
  };

  // Check if date is in hover range
  const isDateInHoverRange = (date: Date) => {
    if (selectedDates.length !== 1 || !hoveredDate) return false;
    const startDate = selectedDates[0];
    const endDate = hoveredDate;
    const minDate = startDate < endDate ? startDate : endDate;
    const maxDate = startDate < endDate ? endDate : startDate;
    return date >= minDate && date <= maxDate;
  };

  // Check if date is selected
  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => d.toDateString() === date.toDateString());
  };

  // Check if date is start or end of range
  const isRangeStart = (date: Date) => {
    return selectedDates.length >= 1 && selectedDates[0].toDateString() === date.toDateString();
  };

  const isRangeEnd = (date: Date) => {
    return selectedDates.length >= 2 && selectedDates[1].toDateString() === date.toDateString();
  };

  // Check if date is preview start or end
  const isPreviewStart = (date: Date) => {
    return previewDates.length >= 1 && previewDates[0].toDateString() === date.toDateString();
  };

  const isPreviewEnd = (date: Date) => {
    return previewDates.length >= 2 && previewDates[1].toDateString() === date.toDateString();
  };

  // Generate calendar days
  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Get next month
  const getNextMonth = (date: Date) => {
    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  const days1 = generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth());
  const nextMonth = getNextMonth(currentMonth);
  const days2 = generateCalendarDays(nextMonth.getFullYear(), nextMonth.getMonth());
  
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Render calendar
  const renderCalendar = (days: Date[], month: Date) => {
    return (
      <div className="flex flex-col py-4" style={{ minWidth: '280px' }}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h3 className="text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap">
            {month.getFullYear()}-{String(month.getMonth() + 1).padStart(2, '0')}
          </h3>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-3 px-2" style={{ gap: '8px' }}>
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 px-2" style={{ gap: '8px' }}>
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = isDateSelected(date);
            const isInRange = isDateInRange(date);
            const isInPreviewRange = isDateInPreviewRange(date);
            const isInHoverRange = isDateInHoverRange(date);
            const isStart = isRangeStart(date);
            const isEnd = isRangeEnd(date);
            const isPreviewStartDate = isPreviewStart(date);
            const isPreviewEndDate = isPreviewEnd(date);
            const isHovered = hoveredDate && hoveredDate.toDateString() === date.toDateString();

            return (
              <button
                key={index}
                className={`
                  relative text-sm rounded-lg transition-all duration-200 font-medium flex items-center justify-center
                  ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'}
                  ${isToday ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : ''}
                  ${isSelected ? 'bg-blue-500 text-white shadow-md' : ''}
                  ${isInRange && !isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                  ${isInPreviewRange && !isSelected && !isPreviewStartDate && !isPreviewEndDate ? 'bg-green-100 dark:bg-green-900/30' : ''}
                  ${isPreviewStartDate && !isSelected ? 'bg-green-500 text-white shadow-md' : ''}
                  ${isPreviewEndDate && !isSelected ? 'bg-green-500 text-white shadow-md' : ''}
                  ${isInHoverRange && !isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  ${isStart ? 'bg-blue-500 text-white shadow-md' : ''}
                  ${isEnd ? 'bg-blue-500 text-white shadow-md' : ''}
                  ${isHovered ? 'bg-blue-400 text-white shadow-lg' : ''}
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  ${!isCurrentMonth ? 'hover:bg-transparent' : ''}
                `}
                style={{ 
                  width: '36px', 
                  height: '36px',
                  minWidth: '36px',
                  minHeight: '36px'
                }}
                onClick={() => isCurrentMonth && handleDateClick(date)}
                onMouseEnter={() => isCurrentMonth && setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={!isCurrentMonth}
              >
                {date.getDate()}
                {isEnd && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
                {isHovered && selectedDates.length === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Input Field */}
      <div
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all duration-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white select-none"
        onClick={() => isOpen ? handleClose() : handleOpen()}
      >
        <CalenderIcon className="h-4 w-4 text-gray-400" />
        <span className={`flex-1 text-sm ${selectedDates.length === 0 ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-1">
          {selectedDates.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="p-0.5 hover:bg-gray-100 rounded transition-colors dark:hover:bg-gray-700"
            >
              <svg className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="text-gray-400 text-xs">
            {isOpen ? '▲' : '▼'}
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {(isOpen || isAnimating) && (
        <div className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700 overflow-hidden transition-all duration-200 ease-out transform ${
          isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'
        }`}>
          <div className="flex">
            {/* Quick Selection Sidebar */}
            <div className="w-48 py-4 px-3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="space-y-1">
                {quickOptions.map((option, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-2 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-white hover:text-blue-600 rounded-lg transition-all duration-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                    onClick={() => handleQuickSelect(option.getDates)}
                    onMouseEnter={() => handleQuickOptionHover(option.getDates)}
                    onMouseLeave={handleQuickOptionLeave}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              {/* Clear Button */}
              {selectedDates.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={clearSelection}
                    className="w-full px-2 py-1.5 text-sm font-medium text-red-600 bg-gray-100 hover:bg-red-50 rounded-lg transition-all duration-200 dark:text-red-400 dark:bg-gray-700 dark:hover:bg-red-900/20"
                  >
                    Xóa lựa chọn
                  </button>
                </div>
              )}
            </div>

            {/* Dual Calendar */}
            <div className="flex">
              {renderCalendar(days1, currentMonth)}
              <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
              {renderCalendar(days2, nextMonth)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;