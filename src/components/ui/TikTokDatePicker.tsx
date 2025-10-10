import React, { useState, useRef, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, subDays, subWeeks } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeftIcon, ArrowRightIcon, CalenderIcon } from '../../icons';

interface TikTokDatePickerProps {
  value?: Date | Date[];
  onChange?: (date: Date | Date[]) => void;
  placeholder?: string;
  className?: string;
  selectsRange?: boolean;
  startDate?: Date;
  endDate?: Date;
  disabled?: boolean;
}

const TikTokDatePicker: React.FC<TikTokDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Chọn ngày",
  className = "",
  selectsRange = false,
  startDate,
  endDate,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | Date[] | null>(value || null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [selectedQuickOption, setSelectedQuickOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Quick date options
  const quickOptions = [
    { key: 'today', label: 'Hôm nay' },
    { key: 'yesterday', label: 'Hôm qua' },
    { key: 'last7days', label: '7 ngày qua' },
    { key: 'last30days', label: '30 ngày qua' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync with props
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      if (Array.isArray(value) && value.length > 0) {
        setCurrentMonth(startOfMonth(value[0]));
      } else if (value instanceof Date) {
        setCurrentMonth(startOfMonth(value));
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const getDaysInMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const handleQuickOptionClick = (option: string) => {
    const today = new Date();
    let start: Date, end: Date;

    switch (option) {
      case 'today':
        start = end = today;
        break;
      case 'yesterday':
        start = end = subDays(today, 1);
        break;
      case 'last7days':
        start = subDays(today, 6);
        end = today;
        break;
      case 'last30days':
        start = subDays(today, 29);
        end = today;
        break;
      default:
        return;
    }

    if (selectsRange) {
      setSelectedDate([start, end]);
      if (onChange) onChange([start, end]);
    } else {
      setSelectedDate(start);
      if (onChange) onChange(start);
    }
    
    setSelectedQuickOption(option);
    setIsOpen(false);
  };

  const handleDateClick = (date: Date) => {
    if (selectsRange) {
      if (Array.isArray(selectedDate)) {
        if (selectedDate.length === 0) {
          setSelectedDate([date]);
        } else if (selectedDate.length === 1) {
          const [start] = selectedDate;
          if (date < start) {
            setSelectedDate([date, start]);
          } else {
            setSelectedDate([start, date]);
          }
          setIsOpen(false);
        } else {
          setSelectedDate([date]);
        }
      } else {
        setSelectedDate([date]);
      }
    } else {
      setSelectedDate(date);
      setIsOpen(false);
    }
    
    if (onChange) {
      onChange(selectsRange ? (Array.isArray(selectedDate) ? [...selectedDate, date] : [date]) : date);
    }
  };

  const formatDisplayValue = () => {
    if (!selectedDate) return placeholder;
    
    if (selectsRange && Array.isArray(selectedDate)) {
      if (selectedDate.length === 0) return placeholder;
      if (selectedDate.length === 1) {
        return format(selectedDate[0], 'dd/MM/yyyy', { locale: vi });
      }
      if (selectedDate.length === 2) {
        return `${format(selectedDate[0], 'dd/MM/yyyy', { locale: vi })} - ${format(selectedDate[1], 'dd/MM/yyyy', { locale: vi })}`;
      }
    }
    
    return format(selectedDate as Date, 'dd/MM/yyyy', { locale: vi });
  };

  const isDateInRange = (date: Date) => {
    if (!selectsRange || !Array.isArray(selectedDate) || selectedDate.length !== 2) return false;
    return date >= selectedDate[0] && date <= selectedDate[1];
  };

  const isDateSelected = (date: Date) => {
    if (selectsRange && Array.isArray(selectedDate)) {
      return selectedDate.some(d => isSameDay(d, date));
    }
    return selectedDate && isSameDay(selectedDate as Date, date);
  };

  const isDateHovered = (date: Date) => {
    if (!hoveredDate || !Array.isArray(selectedDate) || selectedDate.length !== 1) return false;
    const [start] = selectedDate;
    return (date >= start && date <= hoveredDate) || (date >= hoveredDate && date <= start);
  };

  const renderCalendar = (month: Date) => {
    const days = getDaysInMonth(month);
    
    return (
      <div className="flex-1">
        {/* Month Header */}
        <div className="text-center mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {format(month, 'yyyy - MM', { locale: vi })}
          </h3>
        </div>

        {/* Week days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date) => {
            const isCurrentMonth = isSameMonth(date, month);
            const isSelected = isDateSelected(date);
            const inRange = isDateInRange(date);
            const isHovered = isDateHovered(date);
            const isToday = isSameDay(date, new Date());

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`
                  relative h-8 w-8 text-xs font-medium rounded-lg
                  transition-all duration-150 flex items-center justify-center
                  ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : ''}
                  ${isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : ''}
                  ${isToday ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''}
                  ${isSelected ? 'bg-teal-500 text-white hover:bg-teal-600' : ''}
                  ${inRange && !isSelected ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''}
                  ${isHovered && !isSelected ? 'bg-gray-100 dark:bg-gray-700' : ''}
                  ${!isSelected && !inRange && !isHovered && isCurrentMonth ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                `}
                style={{
                  borderRadius: isSelected && Array.isArray(selectedDate) && selectedDate.length === 2 ? 
                    (isSameDay(date, selectedDate[0]) ? '8px 0 0 8px' : 
                     isSameDay(date, selectedDate[1]) ? '0 8px 8px 0' : '0') : '8px'
                }}
              >
                {format(date, 'd')}
                {isToday && !isSelected && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input */}
      <div
        className={`
          flex items-center justify-between h-10 px-3 py-2 
          bg-white dark:bg-gray-800 
          border border-teal-200 dark:border-teal-600 
          rounded-lg cursor-pointer
          hover:border-teal-300 dark:hover:border-teal-500
          focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`text-sm ${selectedDate ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          {formatDisplayValue()}
        </span>
        <CalenderIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden min-w-[600px]">
          <div className="flex">
            {/* Left Sidebar - Quick Options */}
            <div className="w-48 bg-gray-50 dark:bg-gray-700 p-4 border-r border-gray-200 dark:border-gray-600">
              <div className="space-y-2">
                {quickOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleQuickOptionClick(option.key)}
                    className={`
                      w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
                      ${selectedQuickOption === option.key 
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Calendar */}
            <div className="flex-1 p-4">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                  >
                    <ChevronLeftIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 12))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                  >
                    <ChevronLeftIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    <ChevronLeftIcon className="w-3 h-3 text-gray-600 dark:text-gray-400 -ml-1" />
                  </button>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 12))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                  >
                    <ArrowRightIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    <ArrowRightIcon className="w-3 h-3 text-gray-600 dark:text-gray-400 -ml-1" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                  >
                    <ArrowRightIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Dual Calendar */}
              <div className="flex gap-6">
                {renderCalendar(currentMonth)}
                {renderCalendar(addMonths(currentMonth, 1))}
              </div>

              {/* Footer */}
              <div className="flex justify-end mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokDatePicker;