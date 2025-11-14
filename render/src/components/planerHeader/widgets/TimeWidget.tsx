import React, { useEffect, useState } from 'react';

export const TimeWidget: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    // перший рендер
    const updateTime = (): void => {
      const date = new Date();
      setTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 30000); // оновлюємо кожні 30 секунд

    return () => clearInterval(intervalId);
  }, []);

  return (
    <h1 className={`font-poppins text-5xl text-textTableValues`}>{time}</h1>
  );
};
