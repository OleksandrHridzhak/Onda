import React, { useState } from 'react';
import { useColumns } from '../../../database';

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
 * Управляє UI-станом таблиці (loading state отримується з RxDB)
 */
export const useTableLogic = () => {
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Get loading state from RxDB
  const { status } = useColumns();
  const loading = status === 'loading';

  return {
    loading,
    showColumnSelector,
    setShowColumnSelector,
  };
};
export const getWidthStyle = (column: any): React.CSSProperties => {
  return { width: `${column.width}px`, minWidth: `${column.width}px` };
};
