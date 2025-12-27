import React, { useEffect, useState } from 'react';
import PlannerHeader from '../features/PlannerHeader';
import { LoadingScreen } from '../shared/LoadingScreen';
import { useTableLogic } from '../features/Table/TableLogic';
import { useSelector, useDispatch } from 'react-redux';
import { store } from '../../store';
import { loadColumnsFromDB } from '../../store/tableSlice/tableSlice';
import Table from '../features/Table/Table';
import { MobileTodayView } from '../features/Table/MobileTodayView';
import { syncService } from '../../services/syncService';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

// Type for the Redux dispatch inferred from the store
type AppDispatch = typeof store.dispatch;

const TableScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tableLogic = useTableLogic();
  const [isMobile, setIsMobile] = useState(false);

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

  // Check if mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Show loading screen while loading from IndexedDB
  const isLoading =
    tableLogic.loading || (!reduxLoaded && reduxStatus === 'loading');

  // Handle refresh for pull-to-refresh hook
  const handlePullRefresh = async () => {
    try {
      await syncService.sync();
      dispatch(loadColumnsFromDB());
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  // Use pull-to-refresh hook
  const { containerRef, pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: handlePullRefresh,
    enabled: isMobile,
    threshold: 100, // Потрібно тягнути на 100px
    maxDistance: 150,
    minDuration: 500, // Мінімум 500ms тягу
  });

  if (isLoading) {
    return <LoadingScreen darkMode={themeMode === 'dark'} />;
  }

  return (
    <div
      ref={containerRef}
      className={`font-poppins relative w-full max-w-6xl mx-auto bg-background overflow-y-auto`}
      style={{ height: isMobile ? '100vh' : 'auto' }}
    >
      {/* Pull-to-refresh indicator */}
      {isMobile && pullDistance > 0 && (
        <div
          className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-50 transition-all"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          {pullDistance > 100 ? '↻ Release to refresh' : '↓ Pull to refresh'}
        </div>
      )}

      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-50">
          ↻ Refreshing...
        </div>
      )}

      <div
        style={{
          transform: `translateY(${Math.min(pullDistance, 60)}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s' : 'none',
        }}
      >
        {!isMobile && (
          <div>
            <PlannerHeader />
          </div>
        )}

        {isMobile ? <MobileTodayView /> : <Table />}
      </div>
    </div>
  );
};

export default TableScreen;
