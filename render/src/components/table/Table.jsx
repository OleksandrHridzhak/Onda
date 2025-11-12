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
const Table = () => {
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
  const { theme, mode } = useSelector((state) => state.theme);
  const darkMode = false;

  const displayColumns = [
    ...columns,
    {
      id: 'filler',
      type: 'filler',
      description: '',
      emojiIcon: '',
      nameVisible: false,
    },
  ];

  if (loading) {
    return <LoadingScreen darkMode={mode === 'dark' ? true : false} />;
  }
  return (
    <div
      className={`font-poppins relative w-full max-w-6xl mx-auto bg-background`}
    >
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
          height: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: ${darkMode
            ? 'rgba(55, 65, 81, 0.5)'
            : 'rgba(241, 241, 241, 0.2)'};
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: ${darkMode
            ? 'rgba(51, 85, 144, 0.64)'
            : 'rgba(156, 163, 175, 0.5)'};
          border-radius: 4px;
          height: 1px;
          width: 1px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: ${darkMode
            ? 'rgba(107, 114, 128, 0.9)'
            : 'rgba(107, 114, 128, 0.7)'};
        }
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
                      column={column}
                      onRename={columnMenuLogic.handleRename}
                      onRemove={columnMenuLogic.handleDeleteColumn}
                      onClearColumn={columnMenuLogic.handleClearColumn}
                      onChangeIcon={columnMenuLogic.handleChangeIcon}
                      onChangeDescription={
                        columnMenuLogic.handleChangeDescription
                      }
                      onToggleTitleVisibility={
                        columnMenuLogic.handleToggleTitleVisibility
                      }
                      onChangeOptions={columnMenuLogic.handleChangeOptions}
                      onChangeCheckboxColor={
                        columnMenuLogic.handleChangeCheckboxColor
                      }
                      onMoveUp={() => handleMoveColumn(column.id, 'up')}
                      onMoveDown={() =>
                        handleMoveColumn(column.id, 'down')
                      }
                      canMoveUp={
                        column.id !== 'days' &&
                        columns.indexOf(column) > 1
                      }
                      canMoveDown={
                        column.id !== 'days' &&
                        columns.indexOf(column) < columns.length - 1
                      }
                      darkMode={mode === 'dark' ? true : false}
                      onChangeWidth={handleChangeWidth}
                      onAddTask={handleAddTask}
                      style={getWidthStyle(column)}
                    />
                  )
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
                      tableData={tableData}
                      darkMode={darkMode}
                      handleCellChange={handleCellChange}
                      handleChangeOptions={handleChangeOptions}
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
  );
};

export default Table;
