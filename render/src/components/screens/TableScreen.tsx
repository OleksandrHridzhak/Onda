import React, { useEffect } from 'react';
import PlannerHeader from '../TableScreen/planerHeader/PlannerHeader';
import { LoadingScreen } from './LoadingScreen';
import { useTableLogic } from '../TableScreen/TableLogic';
import { useSelector, useDispatch } from 'react-redux';
import { store } from '../../store';
import { loadColumnsFromDB } from '../../store/tableSlice/tableSlice';
import Table from '../TableScreen/Table';

// Type for the Redux dispatch inferred from the store
type AppDispatch = typeof store.dispatch;

const TableScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tableLogic = useTableLogic();

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

  // Show loading screen while loading from IndexedDB
  const isLoading =
    tableLogic.loading || (!reduxLoaded && reduxStatus === 'loading');

  if (isLoading) {
    return <LoadingScreen darkMode={mode === 'dark'} />;
  }

  return (
    <div
      className={`font-poppins relative w-full max-w-6xl mx-auto bg-background`}
    >
      <PlannerHeader
        setShowColumnSelector={tableLogic.setShowColumnSelector}
        showColumnSelector={tableLogic.showColumnSelector}
      />
      <Table />
    </div>
  );
};

export default TableScreen;
