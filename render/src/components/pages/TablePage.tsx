import React, { useEffect, useState } from 'react';
import PlannerHeader from '../features/PlannerHeader';
import { useTableLogic } from '../features/Table/TableLogic';
import { useSelector } from 'react-redux';
import Table from '../features/Table/Table';
import { MobileTodayView } from '../features/Table/mobile/MobileTodayView';
import { syncService } from '../../services/syncService';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { useLiveQuery } from 'dexie-react-hooks';
import { getAllColumns } from '../../db/helpers/columns';
import { getSettings } from '../../db/helpers/settings';
import {
    WeekNavigationProvider,
    useWeekNavigationContext,
} from '../features/WeekNavigation/WeekNavigationContext';
import { WeekNavigationHeader } from '../features/WeekNavigation/WeekNavigationHeader';

const TableContent: React.FC = () => {
    const tableLogic = useTableLogic();
    const [isMobile, setIsMobile] = useState(false);

    const { themeMode } = useSelector((state: any) => state.newTheme);

    // Week navigation from context
    const weekNavigation = useWeekNavigationContext();

    // Use dexie live queries to load columns and settings
    const columnsData = useLiveQuery(async () => {
        const res = await getAllColumns();
        if (!res.success) {
            console.error('Failed to load columns:', res.error);
            return [];
        }
        return res.data;
    });

    const settings = useLiveQuery(async () => {
        const res = await getSettings();
        if (!res.success) {
            console.error('Failed to load settings:', res.error);
            return null;
        }
        return res.data;
    });

    // Check if mobile
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Show loading screen while loading from dexie
    const isLoading =
        tableLogic.loading ||
        columnsData === undefined ||
        settings === undefined;

    // Handle refresh for pull-to-refresh hook
    const handlePullRefresh = async () => {
        try {
            await syncService.sync();
            // Dexie live queries will automatically refresh when data changes
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

    return (
        <div
            ref={containerRef}
            className={`font-poppins relative w-full max-w-6xl mx-auto bg-background overflow-y-auto`}
            style={{ height: isMobile ? '100vh' : 'auto' }}
        >
            {/* Pull-to-refresh indicator */}
            {isMobile && pullDistance > 0 && (
                <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-50 transition-all">
                    {pullDistance > 100
                        ? '↻ Release to refresh'
                        : '↓ Pull to refresh'}
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
                        {/* Week Navigation Header */}
                        <WeekNavigationHeader
                            weekRange={weekNavigation.formatWeekRange}
                            weekNumber={weekNavigation.weekNumber}
                            isCurrentWeek={weekNavigation.isCurrentWeek}
                            onPreviousWeek={weekNavigation.goToPreviousWeek}
                            onNextWeek={weekNavigation.goToNextWeek}
                            onCurrentWeek={weekNavigation.goToCurrentWeek}
                        />
                    </div>
                )}

                {isMobile ? (
                    <MobileTodayView />
                ) : (
                    <Table key={weekNavigation.weekId} />
                )}
            </div>
        </div>
    );
};

const TableScreen: React.FC = () => {
    return (
        <WeekNavigationProvider>
            <TableContent />
        </WeekNavigationProvider>
    );
};

export default TableScreen;
