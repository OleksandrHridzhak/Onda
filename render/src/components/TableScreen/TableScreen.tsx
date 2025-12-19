import React, { useEffect } from 'react';
import PlannerHeader from './planerHeader/PlannerHeader';
import ColumnTypeSelector from './planerHeader/ColumnTypeSelector';
import { LoadingScreen } from '../screens/LoadingScreen';
import { useTableLogic } from './TableLogic';
import { useSelector, useDispatch } from 'react-redux';
import type { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import {
  createNewColumn,
  loadColumnsFromDB,
} from '../../store/tableSlice/tableSlice';
import {
  CheckboxColumnWrapper,
  DaysColumnWrapper,
  FillerColumnWrapper,
  NumberColumnWrapper,
  TagsColumnWrapper,
  NotesColumnWrapper,
  MultiCheckboxColumnWrapper,
  TodoColumnWrapper,
  TaskTableColumnWrapper,
} from './columnWrappers';
import TableItemWrapper from './TableItemWrapper';
import Table from './Table';
import './Table.css';

// Type for the Redux dispatch that supports thunks
type AppDispatch = ThunkDispatch<Record<string, unknown>, unknown, AnyAction>;

const TableScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    columns,
    showColumnSelector,
    setShowColumnSelector,
    loading: tableLogicLoading,
  } = useTableLogic();

  const columnOrder: string[] = useSelector(
    (state: Record<string, any>) => state.tableData?.columnOrder ?? [],
  );
  const columnsData = useSelector(
    (state: Record<string, any>) => state.tableData?.columns ?? {},
  );
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

  console.log('columnOrder:', columnOrder);
  console.log('columnsData:', columnsData);

  // Show loading screen while loading from IndexedDB
  const isLoading =
    tableLogicLoading || (!reduxLoaded && reduxStatus === 'loading');

  if (isLoading) {
    return <LoadingScreen darkMode={mode === 'dark' ? true : false} />;
  }

  const componentsMap: Record<string, React.FC<any>> = {
    days: DaysColumnWrapper,
    checkbox: CheckboxColumnWrapper,
    numberbox: NumberColumnWrapper,
    'multi-select': TagsColumnWrapper,
    text: NotesColumnWrapper,
    multicheckbox: MultiCheckboxColumnWrapper,
    todo: TodoColumnWrapper,
    tasktable: TaskTableColumnWrapper,
  };

  return (
    <div
      className={`font-poppins relative w-full max-w-6xl mx-auto bg-background`}
    >
      {/*==================PlanerHeader==================*/}
      <div className="p-4 relative">
        <PlannerHeader
          setShowColumnSelector={setShowColumnSelector}
          showColumnSelector={showColumnSelector}
          handleAddColumn={handleAddColumn}
        />
      </div>
      {/*==================Main table section (extracted)==================*/}
      <Table />
    </div>
  );
};

export default TableScreen;
