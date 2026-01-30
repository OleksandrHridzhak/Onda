import React, { createContext, useContext, ReactNode } from 'react';
import { useWeekNavigation } from '../../../hooks/useWeekNavigation';

interface WeekNavigationContextType {
    currentWeekStart: Date;
    weekDays: Date[];
    weekId: string;
    weekNumber: number;
    goToPreviousWeek: () => void;
    goToNextWeek: () => void;
    goToCurrentWeek: () => void;
    isCurrentWeek: boolean;
    formatWeekRange: string;
}

const WeekNavigationContext = createContext<
    WeekNavigationContextType | undefined
>(undefined);

export const WeekNavigationProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const weekNavigation = useWeekNavigation();

    return (
        <WeekNavigationContext.Provider value={weekNavigation}>
            {children}
        </WeekNavigationContext.Provider>
    );
};

export const useWeekNavigationContext = (): WeekNavigationContextType => {
    const context = useContext(WeekNavigationContext);
    if (!context) {
        throw new Error(
            'useWeekNavigationContext must be used within WeekNavigationProvider',
        );
    }
    return context;
};
