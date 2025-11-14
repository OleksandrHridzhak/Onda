import React, { useEffect, useRef } from 'react';
import { Clock, Play, Pause, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTime,
  setIsRunning,
  setIsEnded,
  setIsPaused,
  setInitialMinutes,
  setNotifyEnabled,
  resetTimer,
  updateTime,
} from '../../../store/slices/pomodoroSlice';

interface RootState {
  theme: {
    theme: unknown;
  };
  pomodoro: {
    time: number;
    isRunning: boolean;
    isEnded: boolean;
    isPaused: boolean;
    initialMinutes: number;
    notifyEnabled: boolean;
  };
}

const PomodoroWidget: React.FC = () => {
  const dispatch = useDispatch();
  const { time, isRunning, isEnded, isPaused, initialMinutes, notifyEnabled } =
    useSelector((state: RootState) => state.pomodoro);

  const alarmAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const src = `${process.env.PUBLIC_URL}/alert.mp3`;
    alarmAudio.current = new Audio(src);
    alarmAudio.current.loop = true;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => dispatch(updateTime()), 1000);
    return () => clearInterval(interval);
  }, [dispatch]);
  useEffect(() => {
    if (isEnded && notifyEnabled && alarmAudio.current) {
      try {
        alarmAudio.current.play();
      } catch (err) {
        console.warn('Audio play failed:', err);
      }
      window.electronAPI?.showNotification({
        title: 'Pomodoro Timer',
        body: `Your ${initialMinutes}-minute timer has ended!`,
      });
    }
  }, [isEnded, notifyEnabled, initialMinutes]);

  const handleStart = (minutes: number): void => {
    if (alarmAudio.current) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
    }
    dispatch(setNotifyEnabled(true));
    dispatch(setTime(minutes * 60));
    dispatch(setIsRunning(true));
    dispatch(setIsEnded(false));
    dispatch(setIsPaused(false));
    dispatch(setInitialMinutes(minutes));
  };

  const handlePause = (): void => {
    dispatch(setIsRunning(false));
  };
  const handleResume = (): void => {
    dispatch(setIsRunning(true));
  };
  const handleEnd = (): void => {
    dispatch(setNotifyEnabled(false));
    dispatch(setIsRunning(false));
    dispatch(setTime(0));
    dispatch(setIsEnded(true));
    dispatch(setIsPaused(false));
  };
  const handleClose = (): void => {
    dispatch(setNotifyEnabled(false));
    if (alarmAudio.current) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0;
    }
    dispatch(resetTimer());
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={`w-[150px] h-[50px] ml-2 justify-center px-2 rounded-xl flex flex-col items-center space-y-2 border bg-tableBodyBg border-border text-textTableValues`}
    >
      {isEnded ? (
        <div className="flex flex-row items-center space-x-2">
          <div className="font-medium">{initialMinutes} ended!</div>
          <button
            className={`h-8 w-8 flex items-center justify-center rounded-full hover:hoverBg text-red-600`}
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : isRunning || isPaused ? (
        <div className="flex flex-row items-center justify-between w-full">
          <div className={`text-lg pl-1 font-poppins text-textTableValues`}>
            {formatTime(time)}
          </div>
          <div className="flex space-x-2">
            <button
              className={`h-8 w-8 flex items-center justify-center rounded-full hover:hoverBg text-textTableValues`}
              onClick={isRunning ? handlePause : handleResume}
            >
              {isRunning ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <button
              className={`h-8 w-8 flex items-center justify-center rounded-full hover:hoverBg text-textTableValues`}
              onClick={handleEnd}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <span className={`text-textTableValues px-2 py-1`}>
            <Clock className="h-5 w-5" />
          </span>
          {[30, 25, 5].map((m) => (
            <button
              key={m}
              className={`px-2 py-1 rounded-md cursor-pointer text-textTableValues hover:hoverBg`}
              onClick={() => handleStart(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PomodoroWidget;
