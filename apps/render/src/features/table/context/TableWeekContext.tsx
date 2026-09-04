import React from "react";
import {
  formatDateKey,
  getMonday,
  getWeekDates,
  getWeekNumber,
  getWeekStartKey,
} from "shared/lib/date";

export interface TableWeekContextValue {
  currentWeekStart: Date;
  currentWeekStartKey: string;
  weekDates: Date[];
  weekNumber: number;
  isCurrentWeek: boolean;
  canGoToNextWeek: boolean;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;
}

const TableWeekContext = React.createContext<TableWeekContextValue | null>(
  null,
);

export const TableWeekProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const todayWeekStart = React.useMemo(() => getMonday(new Date()), []);
  const [currentWeekStart, setCurrentWeekStart] =
    React.useState<Date>(todayWeekStart);

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
    setCurrentWeekStart(todayWeekStart);
  }, [todayWeekStart]);

  const canGoToNextWeek = currentWeekStart < todayWeekStart;
  const currentWeekStartKey = React.useMemo(
    () => getWeekStartKey(currentWeekStart),
    [currentWeekStart],
  );
  const weekDates = React.useMemo(
    () => getWeekDates(currentWeekStart),
    [currentWeekStart],
  );
  const weekNumber = React.useMemo(
    () => getWeekNumber(currentWeekStart),
    [currentWeekStart],
  );
  const isCurrentWeek =
    formatDateKey(currentWeekStart) === formatDateKey(todayWeekStart);

  const value = React.useMemo<TableWeekContextValue>(
    () => ({
      currentWeekStart,
      currentWeekStartKey,
      weekDates,
      weekNumber,
      isCurrentWeek,
      canGoToNextWeek,
      goToPreviousWeek,
      goToNextWeek,
      goToCurrentWeek,
    }),
    [
      currentWeekStart,
      currentWeekStartKey,
      weekDates,
      weekNumber,
      isCurrentWeek,
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
    throw new Error("useTableWeek must be used within a TableWeekProvider");
  }

  return context;
};
