import { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsDB';
import { useColumnsData, DAYS } from './hooks/useColumnsData';
import React from 'react';

const handleError = (message: string, error: any): void => {
  console.error(message, error);
};

/**
 * Основний хук логіки таблиці
 * Комбінує хуки для даних та обробників
 */
export const useTableLogic = () => {
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [showSummaryRow, setShowSummaryRow] = useState(false);
  const [headerLayout, setHeaderLayout] = useState('withWidget');

  // Завантаження даних колонок
  const {
    columns,
    setColumns,
    tableData,
    setTableData,
    loading,
    columnOrder,
    setColumnOrder,
  } = useColumnsData();

  // Завантаження налаштувань
  useEffect(() => {
    settingsService
      .getSettings()
      .then((response: { status: string; data?: any; error?: any }) => {
        if (response.status === 'success' && response.data) {
          const { data } = response;
          if (typeof data?.table?.showSummaryRow === 'boolean') {
            setShowSummaryRow(data.table.showSummaryRow);
          }
          if (data?.header?.layout) {
            setHeaderLayout(data.header.layout);
          }
        }
      })
      .catch((err: any) => handleError('Error fetching settings:', err));
  }, []);

  // Слухач змін header layout
  useEffect(() => {
    const onHeaderChange = (e: any) => {
      if (e.detail?.layout) setHeaderLayout(e.detail.layout);
    };
    window.addEventListener('header-settings-changed', onHeaderChange);
    return () =>
      window.removeEventListener('header-settings-changed', onHeaderChange);
  }, []);

  return {
    columns,
    setColumns,
    tableData,
    setTableData,
    showColumnSelector,
    setShowColumnSelector,
    highlightedRow,
    setHighlightedRow,
    loading,
    showSummaryRow,
    columnOrder,
    headerLayout,
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

/**
 * Обчислює сумарні значення для колонки
 */
export const calculateSummary = (
  column: any,
  tableData: any,
): string | number => {
  if (column.type === 'checkbox') {
    return DAYS.reduce(
      (sum, day) => sum + (tableData[day]?.[column.id] ? 1 : 0),
      0,
    );
  } else if (column.type === 'numberbox') {
    return DAYS.reduce(
      (sum, day) => sum + (parseFloat(tableData[day]?.[column.id]) || 0),
      0,
    );
  } else if (column.type === 'multiselect' || column.type === 'multicheckbox') {
    return DAYS.reduce((sum, day) => {
      const tags = tableData[day]?.[column.id];
      if (typeof tags === 'string' && tags.trim() !== '') {
        return sum + tags.split(', ').filter((tag) => tag.trim() !== '').length;
      }
      return sum;
    }, 0);
  } else if (column.type === 'todo') {
    const todos = column.tasks || [];
    const completed = todos.filter((todo) => todo.completed).length;
    return `${completed}/${todos.length}`;
  } else if (column.type === 'tasktable') {
    return `${column.doneTags?.length || 0}/${(column.options?.length || 0) + (column.doneTags?.length || 0)}`;
  }
  return column.type === 'days' ? '' : '-';
};

export { DAYS };
