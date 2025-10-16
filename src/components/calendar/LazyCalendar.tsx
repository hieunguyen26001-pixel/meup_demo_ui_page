import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import LazyCSSLoader from '../common/LazyCSSLoader';

// Lazy load FullCalendar components
const FullCalendar = lazy(() => import('@fullcalendar/react'));
const dayGridPlugin = lazy(() => import('@fullcalendar/daygrid'));
const timeGridPlugin = lazy(() => import('@fullcalendar/timegrid'));
const interactionPlugin = lazy(() => import('@fullcalendar/interaction'));
const listPlugin = lazy(() => import('@fullcalendar/list'));

interface LazyCalendarProps {
  events?: any[];
  height?: string | number;
  className?: string;
}

const LazyCalendar: React.FC<LazyCalendarProps> = ({ 
  events = [], 
  height = 600,
  className = ''
}) => {
  const [plugins, setPlugins] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Load plugins asynchronously
    Promise.all([
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin,
      listPlugin
    ]).then((loadedPlugins) => {
      setPlugins(loadedPlugins);
    });
  }, []);

  return (
    <div className={className}>
      <LazyCSSLoader 
        href="https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.15/main.min.css"
        id="fullcalendar-core-css"
      />
      <LazyCSSLoader 
        href="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.15/main.min.css"
        id="fullcalendar-daygrid-css"
      />
      <LazyCSSLoader 
        href="https://cdn.jsdelivr.net/npm/@fullcalendar/timegrid@6.1.15/main.min.css"
        id="fullcalendar-timegrid-css"
      />
      <LazyCSSLoader 
        href="https://cdn.jsdelivr.net/npm/@fullcalendar/list@6.1.15/main.min.css"
        id="fullcalendar-list-css"
      />
      
      <Suspense fallback={
        <div className="flex items-center justify-center" style={{ height }}>
          <LoadingSpinner />
        </div>
      }>
        {plugins.length > 0 && (
          <FullCalendar
            plugins={plugins}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            events={events}
            height={height}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
          />
        )}
      </Suspense>
    </div>
  );
};

export default LazyCalendar;
