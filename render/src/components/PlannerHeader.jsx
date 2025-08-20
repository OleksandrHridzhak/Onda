import React, { useState, useEffect } from 'react';
import PomodoroWidget from './widgets/PomodoroWidget';
import TimelineWidget from './widgets/TimelineWidget';
import { Plus } from 'lucide-react';

const PlannerHeader = ({ darkTheme, layout = 'withWidget', widgetChoice = 'pomodoro', showColumnSelector, setShowColumnSelector, headerLayout, setHeaderLayout }) => {
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
              <div className=" flex justify-center">
                <button
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className={`
                    
                    add-column-tab
                    relative w-12 h-12 ml-2 flex items-center justify-center
                    rounded-lg  z-10
                    ${darkTheme
                      ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 border-gray-700' 
                      : 'bg-white text-blue-500 hover:bg-gray-100 hover:text-blue-600 border-gray-200'}
                    border-t border-l border-r border-b
                  `}
                  title="Add Column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'bothWidgets':
        return (
          <div className="flex justify-between items-center px-2 pt-10 pb-9">
            <h1 className={`font-poppins text-5xl ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>
              {time}
            </h1>
            <div className="flex items-center">
              <TimelineWidget darkTheme={darkTheme} />
              <PomodoroWidget darkTheme={darkTheme} />
              <div className=" flex justify-center">
                <button
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className={`
                    
                    add-column-tab
                    relative w-12 h-12 ml-2 flex items-center justify-center
                    rounded-lg  z-10
                    ${darkTheme
                      ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300 border-gray-700' 
                      : 'bg-white text-blue-500 hover:bg-gray-100 hover:text-blue-600 border-gray-200'}
                    border-t border-l border-r border-b
                  `}
                  title="Add Column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
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