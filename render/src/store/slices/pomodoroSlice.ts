import { createSlice } from '@reduxjs/toolkit';

interface PomodoroState {
  time: number;
  isRunning: boolean;
  isEnded: boolean;
  isPaused: boolean;
  initialMinutes: number | null;
  notifyEnabled: boolean;
  lastUpdateTime: number | null; // Timestamp of the last update
}

const initialState: PomodoroState = {
  time: 1500, // 25 minutes in seconds
  isRunning: false,
  isEnded: false,
  isPaused: false,
  initialMinutes: null,
  notifyEnabled: false,
  lastUpdateTime: null, // Add timestamp of last update
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    setTime: (state, action) => {
      state.time = action.payload;
      state.lastUpdateTime = Date.now();
    },
    setIsRunning: (state, action) => {
      state.isRunning = action.payload;
      state.lastUpdateTime = Date.now();
    },
    setIsEnded: (state, action) => {
      state.isEnded = action.payload;
    },
    setIsPaused: (state, action) => {
      state.isPaused = action.payload;
    },
    setInitialMinutes: (state, action) => {
      state.initialMinutes = action.payload;
    },
    setNotifyEnabled: (state, action) => {
      state.notifyEnabled = action.payload;
    },
    resetTimer: (state) => {
      return initialState;
    },
    updateTime: (state) => {
      if (state.isRunning && state.time > 0) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - state.lastUpdateTime) / 1000);
        if (elapsedSeconds > 0) {
          state.time = Math.max(0, state.time - elapsedSeconds);
          state.lastUpdateTime = now;

          if (state.time === 0) {
            state.isEnded = true;
            state.isRunning = false;
          }
        }
      }
    },
  },
});

export const {
  setTime,
  setIsRunning,
  setIsEnded,
  setIsPaused,
  setInitialMinutes,
  setNotifyEnabled,
  resetTimer,
  updateTime,
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
