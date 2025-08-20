import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PlannerHeader from '../PlannerHeader';
import ColumnTypeSelector from '../ColumnTypeSelector';
import ColumnHeader from '../ColumnHeader';
import { LoadingScreen } from '../LoadingScreen';
import { DAYS, getWidthStyle, calculateSummary, renderCell } from '../../hooks/TableLogic';
import { fetchTable, addColumn, moveColumn, updateColumn } from '../../store/table/tableSlice';
import { useTableLogic } from '../../hooks/TableLogic';

const Table = ({ darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  const { columns, loading } = useSelector((state) => state.table);
  const {
    tableData,
    showColumnSelector,
    setShowColumnSelector,
    showSummaryRow,
    headerLayout,
    handleCellChange,
    handleExport,
  } = useTableLogic();

  useEffect(() => {
    dispatch(fetchTable());
  }, [dispatch]);

  const displayColumns = useMemo(() => [
    ...columns,
    { ColumnId: 'filler', Type: 'filler', Name: '', EmojiIcon: '', NameVisible: false },
  ], [columns]);

  if (loading) {
    return <LoadingScreen darkMode={darkMode} />;
  }

  return (
    <div className={`font-poppins relative w-full max-w-6xl mx-auto ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: ${darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(241, 241, 241, 0.2)'};
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'rgba(51, 85, 144, 0.64)' : 'rgba(156, 163, 175, 0.5)'};
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'rgba(107, 114, 128, 0.9)' : 'rgba(107, 114, 128, 0.7)'};
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
        .add-column-tab {
          transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
        }
        .add-column-tab:hover {
          transform: translateY(-2px);
        }
      `}</style>
      <div className="p-4 relative">
        <PlannerHeader
          darkTheme={darkMode}
          layout={headerLayout}
          onExport={handleExport}
          setShowColumnSelector={setShowColumnSelector}
          showColumnSelector={showColumnSelector}
        />
        {showColumnSelector && (
          <div className="absolute right-0 z-50">
            <ColumnTypeSelector
              onSelect={(type) => {
                dispatch(addColumn(type));
                setShowColumnSelector(false);
              }}
              onCancel={() => setShowColumnSelector(false)}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>
      <div className={`overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl m-2 custom-scroll`}>
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b`}>
                {displayColumns.map((column) => (
                  column.Type === 'filler' ? (
                    <th key={column.ColumnId} className={`${darkMode ? 'border-gray-600' : 'border-gray-200'} border-r border-b`} style={getWidthStyle(column)} />
                  ) : (
                    <ColumnHeader
                      key={column.ColumnId}
                      id={column.ColumnId}
                      column={column}
                      onMoveUp={() => dispatch(moveColumn({ columnId: column.ColumnId, direction: 'up' }))}
                      onMoveDown={() => dispatch(moveColumn({ columnId: column.ColumnId, direction: 'down' }))}
                      canMoveUp={column.ColumnId !== 'days' && columns.indexOf(column) > 1}
                      canMoveDown={column.ColumnId !== 'days' && columns.indexOf(column) < columns.length - 1}
                      darkMode={darkMode}
                    />
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, idx) => (
                <tr
                  key={day}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-150 ${idx !== DAYS.length - 1 ? (darkMode ? 'border-gray-700 border-b' : 'border-gray-200 border-b') : ''}`}
                >
                  {displayColumns.map((column, index) => renderCell(day, column, index, idx, tableData, darkMode, handleCellChange, (options, tagColors, doneTags) => dispatch(updateColumn({ ...column, Options: options, TagColors: tagColors, DoneTags: doneTags })))}
                </tr>
              ))}
            </tbody>
            {showSummaryRow && (
              <tfoot>
                <tr className={`${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
                  {displayColumns.map((column) => {
                    if (column.Type === 'filler') {
                      return <td key={column.ColumnId} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-r`} style={getWidthStyle(column)} />;
                    }
                    const summary = calculateSummary(column, tableData);
                    return (
                      <td
                        key={column.ColumnId}
                        className={`px-4 py-2 text-center text-sm font-medium ${darkMode ? 'text-gray-200 border-gray-700' : 'text-gray-700 border-gray-200'} border-r`}
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