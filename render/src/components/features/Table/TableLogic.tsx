import React, { useState } from 'react';

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Основний хук логіки таблиці
 * Управляє UI-станом таблиці
 */
export const useTableLogic = () => {
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Loading state is now handled by useLiveQuery in components
  const loading = false;

  return {
    loading,
    showColumnSelector,
    setShowColumnSelector,
  };
};
export const getWidthStyle = (column: any): React.CSSProperties => {
  return { width: `${column.width}px`, minWidth: `${column.width}px` };
};
