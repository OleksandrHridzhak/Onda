import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, X } from 'lucide-react';

const PomodoroWidget = ({ darkTheme = false }) => {
  const [time, setTime] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [initialMinutes, setInitialMinutes] = useState(null);
  // Control notification/audio - only when timer naturally ends
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  // Prepare alarm audio
  const alarmAudio = useRef(null);
  useEffect(() => {
    // Use public folder path for audio asset
    const src = `${process.env.PUBLIC_URL}/alert.mp3`;
    alarmAudio.current = new Audio(src);
    alarmAudio.current.loop = true;
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsEnded(true);
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  // Play looping alarm when timer ends
  useEffect(() => {
    if (isEnded && notifyEnabled && alarmAudio.current) {
      try {
        alarmAudio.current.play();
      } catch (err) {
        console.warn('Audio play failed:', err);
      }
      // Also show notification
      window.electronAPI.showNotification({
        title: 'Pomodoro Timer',
        body: `Your ${initialMinutes}-minute timer has ended!`
      });
    }
  }, [isEnded, notifyEnabled]);

  // Start a custom second-based timer (for testing)
  const handleStartSeconds = (seconds) => {
    setNotifyEnabled(true);
    setTime(seconds);
    setIsRunning(true);
    setIsEnded(false);
    setIsPaused(false);
    setInitialMinutes(`${seconds}s`);
  };

  const handleStart = (minutes) => {
    // Stop alarm if playing
    if (alarmAudio.current) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
    }
    setNotifyEnabled(true);
    setTime(minutes * 60);
    setIsRunning(true);
    setIsEnded(false);
    setIsPaused(false);
    setInitialMinutes(minutes);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleEnd = () => {
    // disable notification for manual end
    setNotifyEnabled(false);
    setIsRunning(false);
    setTime(0);
    setIsEnded(true);
    setIsPaused(false);
  };

  const handleClose = () => {
    // disable notification when closing
    setNotifyEnabled(false);
    // Stop alarm when closing
    if (alarmAudio.current) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
    }
    setTime(1500);
    setIsRunning(false);
    setIsEnded(false);
    setIsPaused(false);
    setInitialMinutes(null);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`w-[150px] h-[50px] ml-2 justify-center px-2 rounded-xl flex flex-col items-center space-y-2 border ${darkTheme ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}>
      {isEnded ? (
        <div className="flex flex-row items-center space-x-2">
          <div className="font-medium">{initialMinutes} ended!</div>
          <button
            className="h-8 w-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (isRunning || isPaused) ? (
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-lg pl-1 font-poppins">{formatTime(time)}</div>
          <div className="flex space-x-2">
                <button
              className={`h-8 w-8 flex items-center justify-center rounded-full ${isRunning ? (darkTheme ? 'bg-transparent hover:bg-blue-200 text-blue-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-600') : (darkTheme ? 'bg-transparent hover:bg-blue-200 text-blue-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-600')}`}
              onClick={isRunning ? handlePause : handleResume}
            >
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              className={`h-8 w-8 flex items-center justify-center rounded-full ${darkTheme ? 'bg-transparent hover:bg-blue-200 text-blue-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'}`}
              onClick={handleEnd}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <span className={`${darkTheme ? 'text-gray-200' : 'text-gray-600'} px-2 py-1`}>
            <Clock className="h-5 w-5" />
          </span>
          <button
            className={`px-2 py-1 rounded-md cursor-pointer ${darkTheme ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}
            onClick={() => handleStart(30)}
          >
            30
          </button>
          <button
            className={`px-2 py-1 rounded-md cursor-pointer ${darkTheme ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}
            onClick={() => handleStart(25)}
          >
            25
          </button>
          <button
            className={`px-2 py-1 rounded-md cursor-pointer ${darkTheme ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50'}`}
            onClick={() => handleStart(5)}
          >
            5
          </button>
        </div>
      )}
    </div>
  );
};

export default PomodoroWidget;
