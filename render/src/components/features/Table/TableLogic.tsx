/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

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
 * Управляє UI-станом таблиці (loading state отримується з Redux)
 */
export const useTableLogic = () => {
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Get loading state from Redux
  const loading = useSelector(
    (state: Record<string, any>) => state.tableData?.status === 'loading',
  );

  return {
    loading,
    showColumnSelector,
    setShowColumnSelector,
  };
};

/**
 * Повертає стилі ширини для колонки
 */
export const getWidthStyle = (column: any): React.CSSProperties => {
  return { width: `${column.width}px`, minWidth: `${column.width}px` };
};
