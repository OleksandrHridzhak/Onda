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
  if (column.type === 'days') return { width: '120px', minWidth: '120px' };
  if (column.type === 'filler') return { width: 'auto', minWidth: '0px' };
  return { width: `${column.width}px`, minWidth: `${column.width}px` };
};
