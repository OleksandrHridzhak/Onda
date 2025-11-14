import React, { useEffect, useState } from 'react';

export const TimeWidget: React.FC = () => {
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
    // Disable the rule because the original logic uses setState in useEffect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    );

    return () => clearInterval(intervalId);
  }, []);

  return (
    <h1 className={`font-poppins text-5xl text-textTableValues`}>{time}</h1>
  );
};
