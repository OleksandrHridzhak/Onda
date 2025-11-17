import React from 'react';
import PlannerHeader from '../planerHeader/PlannerHeader';
import ColumnTypeSelector from '../planerHeader/ColumnTypeSelector';
import ColumnHeader from './ColumnHeader';
import { LoadingScreen } from './LoadingScreen';
import {
  useTableLogic,
  DAYS,
  getWidthStyle,
  calculateSummary,
  RenderCell,
} from './TableLogic';
import { useColumnMenuLogic } from './columnMenu/ColumnMenuLogic';
import { useSelector } from 'react-redux';
import { ColumnProvider } from './context/ColumnContext';

const Table: React.FC = () => {
  const {
    columns,
    setColumns,
    tableData,
    setTableData,
    showColumnSelector,
    setShowColumnSelector,
    loading,
    showSummaryRow,
    handleAddColumn,
    handleCellChange,
    handleAddTask,
    handleMoveColumn,
    handleChangeWidth,
    handleChangeOptions,
  } = useTableLogic();

  const columnMenuLogic = useColumnMenuLogic(columns, setColumns, setTableData);
  const { theme, mode } = useSelector((state: any) => state.theme);
  const darkMode = false;

  // Prepare operations object for context
  const columnOperations = {
    ...columnMenuLogic,
    handleMoveColumn,
    handleChangeWidth,
    handleCellChange,
    handleChangeOptions,
    columns,
    tableData,
  };

  const displayColumns = [
    ...columns,
    {
      id: 'filler',
      type: 'filler',
      name: '',
      description: '',
      emojiIcon: '',
      nameVisible: false,
      width: 0,
      setEmojiIcon: () => false,
      setWidth: () => false,
      setNameVisible: () => false,
      setName: () => false,
      setDescription: () => false,
      update: () => false,
      toJSON: () => ({}),
    } as any,
  ];

  if (loading) {
    return <LoadingScreen darkMode={mode === 'dark' ? true : false} />;
  }
  
  return (
    <ColumnProvider operations={columnOperations}>
      <div
        className={`font-poppins relative w-full max-w-6xl mx-auto bg-background`}
      >
      <style>{`
        .todo-cell {
          position: relative;
          z-index: 1;
          height: 100%;
        }
        .todo-cell > div {
          height: 100%;
        }
        table {
          table-layout: fixed;
        }
      `}</style>
      <div className="p-4 relative">
        <PlannerHeader
          setShowColumnSelector={setShowColumnSelector}
          showColumnSelector={showColumnSelector}
        />
        {showColumnSelector && (
          <div className="absolute right-0 z-50">
            <ColumnTypeSelector
              onSelect={(type) => {
                handleAddColumn(type);
                setShowColumnSelector(false);
              }}
              onCancel={() => setShowColumnSelector(false)}
              darkMode={mode === 'dark' ? true : false}
            />
          </div>
        )}
      </div>
      <div
        className={`overflow-x-auto border border-border rounded-xl m-2 custom-scroll`}
      >
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full">
            <thead>
              <tr className={`border-border bg-tableHeader border-b`}>
                {displayColumns.map((column) =>
                  column.type === 'filler' ? (
                    <th key={column.id} style={getWidthStyle(column)} />
                  ) : (
                    <ColumnHeader
                      key={column.id}
                      column={column as any}
                      canMoveUp={
                        column.id !== 'days' && columns.indexOf(column) > 1
                      }
                      canMoveDown={
                        column.id !== 'days' &&
                        columns.indexOf(column) < columns.length - 1
                      }
                    />
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, idx) => (
                <tr
                  key={day}
                  className={`
                    bg-tableBodyBg
                    ${idx !== DAYS.length - 1 ? `border-border border-b` : ''}
                  `}
                >
                  {displayColumns.map((column, index) => (
                    <RenderCell
                      key={column.id}
                      day={day}
                      column={column}
                      columnIndex={index}
                      rowIndex={idx}
                      darkMode={darkMode}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
            {showSummaryRow && (
              <tfoot>
                <tr className={`border-t bg-tableBodyBg border-border`}>
                  {displayColumns.map((column) => {
                    if (column.type === 'filler') {
                      return (
                        <td
                          key={column.id}
                          className={`border-border `}
                          style={getWidthStyle(column)}
                        />
                      );
                    }
                    const summary = calculateSummary(column, tableData);
                    return (
                      <td
                        key={column.id}
                        className={`px-4 py-2 text-center text-sm font-medium text-tableSummaryText border-border border-r`}
                        style={getWidthStyle(column)}
                      >
                        {summary}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
    </ColumnProvider>
  );
};

export default Table;
