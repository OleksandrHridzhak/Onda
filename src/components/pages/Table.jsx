import React from 'react';
import { Settings, Download, Plus, Edit2, X, Check, Calendar, Menu, Eye, EyeOff, Trash2, ChevronDown, ChevronUp, Sun, Moon, ArrowUp, ArrowDown } from 'lucide-react';
import PlannerHeader from '../PlannerHeader';
import ColumnTypeSelector from '../ColumnTypeSelector';
import ColumnHeader from '../ColumnHeader';
import { useTableLogic, DAYS, COLUMN_WIDTHS, getWidthStyle, calculateSummary, renderCell } from '../utils/TableLogic';
import { useColumnMenuLogic } from '../utils/ColumnMenuLogic';

const Table = ({ darkMode, setDarkMode }) => {
  const {
    columns,
    setColumns,
    tableData,
    showColumnSelector,
    setShowColumnSelector,
    loading,
    showSummaryRow,
    headerLayout,
    handleAddColumn,
    handleCellChange,
    handleAddTask,
    handleMoveColumn,
    handleChangeWidth,
    handleExport
  } = useTableLogic();

  const columnMenuLogic = useColumnMenuLogic(columns, setColumns);

  const displayColumns = [
    ...columns,
    { ColumnId: 'filler', Type: 'filler', Name: '', EmojiIcon: '', NameVisible: false }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="flex space-x-1 text-5xl font-bold text-blue-600 font-poppins">
          {['O', 'N', 'D', 'A'].map((ch, idx) => (
            <span key={idx} className="inline-block animate-bounce" style={{ animationDelay: `${idx * 0.2}s` }}>
              {ch}
            </span>
          ))}
        </div>
        <p className={`mt-4 text-lg ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>Loading data...</p>
      </div>
    );
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
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50">
            <ColumnTypeSelector
              onSelect={(type) => {
                handleAddColumn(type);
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
              <tr className={`${darkMode ? 'bg-gray-500 border-gray-600' : 'bg-gray-100 border-gray-200'} border-b`}>
                {displayColumns.map((column) => (
                  column.Type === 'filler' ? (
                    <th
                      key={column.ColumnId}
                      className={`${darkMode ? 'border-gray-600' : 'border-gray-200'} border-r border-b`}
                      style={getWidthStyle(column)}
                    />
                  ) : (
                    <ColumnHeader
                      key={column.ColumnId}
                      column={column}
                      onRename={columnMenuLogic.handleRename}
                      onRemove={columnMenuLogic.handleDeleteColumn}
                      onChangeIcon={columnMenuLogic.handleChangeIcon}
                      onChangeDescription={columnMenuLogic.handleChangeDescription}
                      onToggleTitleVisibility={columnMenuLogic.handleToggleTitleVisibility}
                      onChangeOptions={columnMenuLogic.handleChangeOptions}
                      onChangeCheckboxColor={columnMenuLogic.handleChangeCheckboxColor}
                      onMoveUp={() => handleMoveColumn(column.ColumnId, 'up')}
                      onMoveDown={() => handleMoveColumn(column.ColumnId, 'down')}
                      canMoveUp={column.ColumnId !== 'days' && columns.indexOf(column) > 1}
                      canMoveDown={column.ColumnId !== 'days' && columns.indexOf(column) < columns.length - 1}
                      darkMode={darkMode}
                      columnWidths={COLUMN_WIDTHS}
                      onChangeWidth={handleChangeWidth}
                      onAddTask={handleAddTask}
                      style={getWidthStyle(column)}
                    />
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, idx) => (
                <tr
                  key={day}
                  className={`
                    ${darkMode ? 'bg-gray-800' : 'bg-white'}
                    transition-colors duration-150
                    ${idx !== DAYS.length - 1 ? (darkMode ? 'border-gray-700 border-b' : 'border-gray-200 border-b') : ''}
                  `}
                >
                  {displayColumns.map((column, index) => (
                    renderCell(day, column, index, idx, tableData, darkMode, handleCellChange, columnMenuLogic.handleChangeOptions)
                  ))}
                </tr>
              ))}
            </tbody>
            {showSummaryRow && (
              <tfoot>
                <tr className={`${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
                  {displayColumns.map((column) => {
                    if (column.Type === 'filler') {
                      return (
                        <td
                          key={column.ColumnId}
                          className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-r`}
                          style={getWidthStyle(column)}
                        />
                      );
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