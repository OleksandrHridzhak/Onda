import React, { useEffect } from 'react';
import PlannerHeader from '../TableScreen/planerHeader/PlannerHeader';
import { LoadingScreen } from './LoadingScreen';
import { useTableLogic } from '../TableScreen/TableLogic';
import { useSelector, useDispatch } from 'react-redux';
import type { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import {
  createNewColumn,
  loadColumnsFromDB,
} from '../../store/tableSlice/tableSlice';
import Table from '../TableScreen/Table';

// Type for the Redux dispatch that supports thunks
type AppDispatch = ThunkDispatch<Record<string, unknown>, unknown, AnyAction>;

const TableScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    showColumnSelector,
    setShowColumnSelector,
    loading: tableLogicLoading,
  } = useTableLogic();

  const { mode } = useSelector((state: any) => state.theme);
  const reduxLoaded = useSelector(
    (state: Record<string, any>) => state.tableData?.loaded ?? false,
  );
  const reduxStatus = useSelector(
    (state: Record<string, any>) => state.tableData?.status ?? 'idle',
  );

  // Load columns from IndexedDB when component mounts
  useEffect(() => {
    if (!reduxLoaded && reduxStatus === 'idle') {
      dispatch(loadColumnsFromDB());
    }
  }, [dispatch, reduxLoaded, reduxStatus]);

  const handleAddColumn = (columnType: string) => {
    dispatch(createNewColumn({ columnType }));
    setShowColumnSelector(false);
  };

  // Show loading screen while loading from IndexedDB
  const isLoading =
    tableLogicLoading || (!reduxLoaded && reduxStatus === 'loading');

  if (isLoading) {
    return <LoadingScreen darkMode={mode === 'dark' ? true : false} />;
  }

  return (
    <div
      className={`font-poppins relative w-full max-w-6xl mx-auto bg-background`}
    >
      <PlannerHeader
        setShowColumnSelector={setShowColumnSelector}
        showColumnSelector={showColumnSelector}
        handleAddColumn={handleAddColumn}
      />
      <Table />
    </div>
  );
};

export default TableScreen;
