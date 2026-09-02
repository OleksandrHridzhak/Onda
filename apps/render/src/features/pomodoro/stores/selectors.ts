import type { PomodoroState } from './pomodoroSlice';

interface PomodoroRootState {
    pomodoro: PomodoroState;
}

export const selectPomodoro = (state: PomodoroRootState): PomodoroState =>
    state.pomodoro;
