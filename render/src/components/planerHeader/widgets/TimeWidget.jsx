import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const TimeWidget = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [time,setTime] = useState('');
  
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
    const intervalId = setInterval(fetchTime, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <h1 className={`font-poppins text-5xl ${theme.textTableValues}`}>
      {time}
    </h1>
  )

}