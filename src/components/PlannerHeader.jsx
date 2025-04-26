import React, { useState, useEffect } from 'react';
import PomodoroWidget from './widgets/PomodoroWidget';
import TimelineWidget from './widgets/TimelineWidget';

const PlannerHeader = ({ darkTheme, layout = 'withWidget', widgetChoice = 'pomodoro', onExport, showColumnSelector, setShowColumnSelector, headerLayout, setHeaderLayout }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const { time: isoTime } = await window.electronAPI.getTime();
        const date = new Date(isoTime);
        const formattedTime = date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        setTime(formattedTime);
      } catch (error) {
        console.error('Error fetching time:', error);
      }
    };

    fetchTime();
    const intervalId = setInterval(fetchTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const renderWidgets = () => {
    switch (widgetChoice) {
      case 'pomodoro':
        return <PomodoroWidget darkTheme={darkTheme} />;
      case 'timeline':
        return <TimelineWidget darkTheme={darkTheme} />;
      case 'both':
      default:
        return (
          <>
            <TimelineWidget darkTheme={darkTheme} />
            <PomodoroWidget darkTheme={darkTheme} />
          </>
        );
    }
  };

  const renderLayout = () => {
    switch (layout) {
      case 'default':
        return (
          <div className="flex justify-center items-center px-2 pt-10 pb-9">
            <h1 className={`font-poppins text-5xl ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>
              {time}
            </h1>
          </div>
        );
      case 'withWidget':
        return (
          <div className="flex justify-between items-center px-2 pt-10 pb-9">
            <h1 className={`font-poppins text-5xl ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>
              {time}
            </h1>
            <div className="flex items-center">
              {renderWidgets()}
            </div>
          </div>
        );
      case 'compact':
        return (
          <div className="flex flex-col items-center px-2 pt-5 pb-5">
            <h1 className={`font-poppins text-3xl ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>
              {time}
            </h1>
            <div className="flex items-center mt-2">
              {renderWidgets()}
            </div>
          </div>
        );
      case 'spacious':
        return (
          <div className="flex justify-between items-center px-10 pt-20 pb-20">
            <h1 className={`font-poppins text-6xl ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>
              {time}
            </h1>
            <div className="flex items-center">
              {renderWidgets()}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${darkTheme ? 'bg-gray-900' : 'bg-white'}`}>
      {renderLayout()}
    </div>
  );
};

export default PlannerHeader;