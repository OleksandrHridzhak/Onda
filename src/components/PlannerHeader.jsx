import React, { useState, useEffect } from 'react';

const PlannerHeader = ({ darkTheme }) => {
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

  return (
    <div className={`flex justify-center pt-10 pb-9 ${darkTheme ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`font-poppins text-5xl ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>
        {time}
      </h1>
    </div>
  );
};

export default PlannerHeader;