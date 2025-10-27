import React, { useEffect, useState } from 'react';

export const TimeWidget = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date();
      const formattedTime = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setTime(formattedTime);
    }, 30000); // оновлюємо кожні 30 секунд

    // перший рендер
    const date = new Date();
    setTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    return () => clearInterval(intervalId);
  }, []);


  return (
    <h1 className={`font-poppins text-5xl text-text-secondary`}>{time}</h1>
  );
};
