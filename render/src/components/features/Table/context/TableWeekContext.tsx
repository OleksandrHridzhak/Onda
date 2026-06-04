import React from 'react';
import { getMonday } from '../../../../utils/date';

interface TableWeekContextValue {
    currentWeekStart: Date;
    canGoToNextWeek: boolean;
    goToPreviousWeek: () => void;
    goToNextWeek: () => void;
    goToCurrentWeek: () => void;
}

const TableWeekContext = React.createContext<TableWeekContextValue | null>(
    null,
);

export const TableWeekProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const todayWeekStart = React.useMemo(() => getMonday(new Date()), []);
    const [currentWeekStart, setCurrentWeekStart] = React.useState(() =>
        getMonday(new Date()),
    );

    const goToPreviousWeek = React.useCallback(() => {
        setCurrentWeekStart((prev) => {
            const next = new Date(prev);
            next.setDate(prev.getDate() - 7);
            return getMonday(next);
        });
    }, []);

    const goToNextWeek = React.useCallback(() => {
        setCurrentWeekStart((prev) => {
            const next = new Date(prev);
            next.setDate(prev.getDate() + 7);
            const normalizedNext = getMonday(next);

            return normalizedNext > todayWeekStart ? prev : normalizedNext;
        });
    }, [todayWeekStart]);

    const goToCurrentWeek = React.useCallback(() => {
        setCurrentWeekStart(getMonday(new Date()));
    }, []);

    const canGoToNextWeek = currentWeekStart < todayWeekStart;

    const value = React.useMemo(
        () => ({
            currentWeekStart,
            canGoToNextWeek,
            goToPreviousWeek,
            goToNextWeek,
            goToCurrentWeek,
        }),
        [
            currentWeekStart,
            canGoToNextWeek,
            goToPreviousWeek,
            goToNextWeek,
            goToCurrentWeek,
        ],
    );

    return (
        <TableWeekContext.Provider value={value}>
            {children}
        </TableWeekContext.Provider>
    );
};

export const useTableWeek = (): TableWeekContextValue => {
    const context = React.useContext(TableWeekContext);

    if (!context) {
        throw new Error('useTableWeek must be used within a TableWeekProvider');
    }

    return context;
};
