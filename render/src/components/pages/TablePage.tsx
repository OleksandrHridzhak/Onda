import React, { useEffect, useState } from 'react';
import PlannerHeader from '../features/PlannerHeader';
import { LoadingScreen } from '../shared/LoadingScreen';
import { useTableLogic } from '../features/Table/TableLogic';
import { useSelector, useDispatch } from 'react-redux';
import { store } from '../../store';
import { loadColumnsFromDB } from '../../store/tableSlice/tableSlice';
import Table from '../features/Table/Table';
import { MobileTodayView } from '../features/Table/MobileTodayView';

// Type for the Redux dispatch inferred from the store
type AppDispatch = typeof store.dispatch;

const TableScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tableLogic = useTableLogic();

  const { themeMode } = useSelector((state: any) => state.newTheme);

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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Show loading screen while loading from IndexedDB
  const isLoading =
    tableLogic.loading || (!reduxLoaded && reduxStatus === 'loading');

  if (isLoading) {
    return <LoadingScreen darkMode={themeMode === 'dark'} />;
  }

  return (
    <div
      className={`font-poppins relative w-full max-w-6xl mx-auto bg-background`}
    >
      {!isMobile && (
        <div>
          <PlannerHeader />
        </div>
      )}

      {isMobile ? <MobileTodayView /> : <Table />}
    </div>
  );
};

export default TableScreen;
