import React, { useState, useEffect } from 'react';
import { Settings, Download, Plus, Edit2, X, Check, Calendar, Menu, Eye, EyeOff, Trash2, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';
import PlannerHeader from '../PlannerHeader';
import ColumnTypeSelector from '../ColumnTypeSelector';
import Cells from '../Cellss';
import ColumnHeader from '../ColumnHeader';
const { CheckboxCell, NumberCell, TagsCell, NotesCell } = Cells;

const columnWidths = {
  days: 'w-32',
  checkbox: 'w-12',
  numberbox: 'w-20',
  'multi-select': 'w-32',
  text: 'w-64'
};

const Table = ({darkMode, setDarkMode}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState({});
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSummaryRow, setShowSummaryRow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await window.electronAPI.getAllDays();
        const dayColumn = { ColumnId: 'days', Type: 'days', Name: 'Day', EmojiIcon: '', NameVisible: true };

        if (result.status === 'Data fetched' && Array.isArray(result.data)) {
          const fetchedColumns = [dayColumn, ...result.data];
          setColumns(fetchedColumns);
          const initialTableData = days.reduce((acc, day) => {
            acc[day] = fetchedColumns.reduce((dayData, col) => {
              if (col.ColumnId !== 'days') {
                if (col.Type === 'multi-select') {
                  const chosenValue = col.Chosen?.[day];
                  dayData[col.ColumnId] = typeof chosenValue === 'string' ? chosenValue : '';
                } else {
                  dayData[col.ColumnId] = col.Chosen?.[day] || '';
                }
              }
              return dayData;
            }, {});
            return acc;
          }, {});
          setTableData(initialTableData);
        } else {
          setColumns([dayColumn]);
          setTableData(days.reduce((acc, day) => ({ ...acc, [day]: {} }), {}));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setColumns([{ ColumnId: 'days', Type: 'days', Name: 'Day', EmojiIcon: '', NameVisible: true }]);
        setTableData(days.reduce((acc, day) => ({ ...acc, [day]: {} }), {}));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddColumn = async (type) => {
    try {
      const result = await window.electronAPI.createComponent(type);
      if (result.status) {
        setColumns((prev) => [...prev, result.data]);
        setTableData((prev) => {
          const newData = { ...prev };
          days.forEach((day) => {
            newData[day][result.data.ColumnId] = '';
          });
          return newData;
        });
      }
    } catch (err) {
      console.error('Failed to create column:', err);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      const result = await window.electronAPI.deleteComponent(columnId);
      if (result.status) {
        setColumns((prev) => prev.filter((col) => col.ColumnId !== columnId));
        setTableData((prev) => {
          const newData = { ...prev };
          days.forEach((day) => {
            delete newData[day][columnId];
          });
          return newData;
        });
      }
    } catch (err) {
      console.error('Failed to delete column:', err);
    }
  };

  const handleCellChange = async (day, columnId, value) => {
    setTableData((prev) => ({
      ...prev,
      [day]: { ...prev[day], [columnId]: value }
    }));

    setColumns((prevColumns) => {
      return prevColumns.map((col) => {
        if (col.ColumnId === columnId) {
          const updatedChosen = {
            ...(col.Chosen || {}),
            [day]: value
          };
          window.electronAPI.changeColumn({ ...col, Chosen: updatedChosen })
            .catch((err) => console.error('Update failed:', err));
          return { ...col, Chosen: updatedChosen };
        }
        return col;
      });
    });
  };

  const handleChangeIcon = async (columnId, newIcon) => {
    setColumns((prev) =>
      prev.map((col) => (col.ColumnId === columnId ? { ...col, EmojiIcon: newIcon } : col))
    );
    updateBackend(columnId, { EmojiIcon: newIcon });
  };

  const handleChangeDescription = async (columnId, newDescription) => {
    setColumns((prev) =>
      prev.map((col) => (col.ColumnId === columnId ? { ...col, Description: newDescription } : col))
    );
    updateBackend(columnId, { Description: newDescription });
  };

  const handleToggleTitleVisibility = async (columnId, showTitle) => {
    setColumns((prev) =>
      prev.map((col) => (col.ColumnId === columnId ? { ...col, NameVisible: showTitle } : col))
    );
    updateBackend(columnId, { NameVisible: showTitle });
  };

  const handleChangeOptions = async (columnId, newOptions) => {
    setColumns((prev) =>
      prev.map((col) => (col.ColumnId === columnId ? { ...col, Options: newOptions } : col))
    );
    updateBackend(columnId, { Options: newOptions });
  };

  const handleRename = async (columnId, newName) => {
    setColumns((prev) => prev.map((col) => (col.ColumnId === columnId ? { ...col, Name: newName } : col)));
    const column = columns.find((col) => col.ColumnId === columnId);
    if (!column) return;

    try {
      await window.electronAPI.changeColumn({ ...column, Name: newName });
    } catch (err) {
      console.error('Failed to save column name:', err);
      setColumns((prev) => prev.map((col) => (col.ColumnId === columnId ? { ...col, Name: column.Name } : col)));
    }
  };

  const updateBackend = async (columnId, updates) => {
    setColumns((prevColumns) => {
      const column = prevColumns.find((col) => col.ColumnId === columnId);
      if (column) {
        const updatedColumn = { ...column, ...updates };
        window.electronAPI.changeColumn(updatedColumn).catch((err) => {
          console.error('Update failed:', err);
          setColumns((prev) => prev.map((col) => (col.ColumnId === columnId ? column : col)));
        });
      }
      return prevColumns;
    });
  };

  const handleExport = () => {
    const exportData = columns.filter((col) => col.Type !== 'days').map((col) => ({
      ...col,
      Chosen: days.reduce((acc, day) => {
        acc[day] = tableData[day][col.ColumnId] || '';
        return acc;
      }, {})
    }));
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'planner-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const calculateSummary = (column) => {
    if (column.Type === 'checkbox') {
      return days.reduce((sum, day) => sum + (tableData[day][column.ColumnId] ? 1 : 0), 0);
    } else if (column.Type === 'numberbox') {
      return days.reduce((sum, day) => sum + (parseFloat(tableData[day][column.ColumnId]) || 0), 0);
    } else if (column.Type === 'multi-select') {
      return days.reduce((sum, day) => {
        const tags = tableData[day][column.ColumnId];
        if (typeof tags === 'string' && tags.trim() !== '') {
          const tagArray = tags.split(', ').filter(tag => tag.trim() !== '');
          return sum + tagArray.length;
        }
        return sum;
      }, 0);
    } else if (column.Type === 'days') {
      return '';
    }
    return '-';
  };

  const renderCell = (day, column) => {
    const widthClass = columnWidths[column.Type] || '';
    if (column.Type === 'days') {
      return (
        <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-gray-200 border-gray-700' : 'text-gray-600 border-gray-200'} border-r whitespace-nowrap ${widthClass}`}>
          {day}
        </td>
      );
    }
    switch (column.Type) {
      case 'checkbox':
        return (
          <td className={`py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r ${widthClass}`}>
            <CheckboxCell
              checked={tableData[day][column.ColumnId] || false}
              onChange={() => handleCellChange(day, column.ColumnId, !tableData[day][column.ColumnId])}
              darkMode={darkMode}
            />
          </td>
        );
      case 'numberbox':
        return (
          <td className={`px-2 py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r ${widthClass}`}>
            <NumberCell
              value={tableData[day][column.ColumnId] || ''}
              onChange={(value) => handleCellChange(day, column.ColumnId, value)}
              darkMode={darkMode}
            />
          </td>
        );
      case 'multi-select':
        return (
          <td className={`px-2 py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r ${widthClass}`}>
            <TagsCell
              value={tableData[day][column.ColumnId] || ''}
              onChange={(value) => handleCellChange(day, column.ColumnId, value)}
              options={column.Options || []}
              darkMode={darkMode}
            />
          </td>
        );
      case 'text':
        return (
          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r ${widthClass}`}>
            <NotesCell
              value={tableData[day][column.ColumnId] || ''}
              onChange={(value) => handleCellChange(day, column.ColumnId, value)}
              darkMode={darkMode}
            />
          </td>
        );
      default:
        return <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r ${widthClass}`}>-</td>;
    }
  };

  if (loading) {
    return <div className={`p-4 text-center ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>Loading...</div>;
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
          background: ${darkMode ? 'rgba(156, 163, 175, 0.7)' : 'rgba(156, 163, 175, 0.5)'};
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'rgba(107, 114, 128, 0.9)' : 'rgba(107, 114, 128, 0.7)'};
        }
      `}</style>
      <PlannerHeader darkTheme={darkMode} onExport={handleExport} />
      <div className={`overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl m-2 custom-scroll`}>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                {columns.map((column) => (
                  <ColumnHeader
                    key={column.ColumnId}
                    column={column}
                    onRemove={handleDeleteColumn}
                    onRename={handleRename}
                    onChangeIcon={handleChangeIcon}
                    onChangeDescription={handleChangeDescription}
                    onToggleTitleVisibility={handleToggleTitleVisibility}
                    onChangeOptions={handleChangeOptions}
                    darkMode={darkMode}
                    columnWidths={columnWidths}
                  />
                ))}
                <th className={`px-3 py-3 text-center ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b relative w-auto`}>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setShowColumnSelector(!showColumnSelector)}
                      className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'} flex items-center justify-center whitespace-nowrap`}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Column
                    </button>

                  </div>
                  {showColumnSelector && (
                    <ColumnTypeSelector
                      onSelect={(type) => {
                        handleAddColumn(type);
                        setShowColumnSelector(false);
                      }}
                      onCancel={() => setShowColumnSelector(false)}
                      darkMode={darkMode}
                    />
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {days.map((day, idx) => (
                <tr
                  key={day}
                  className={`
                    ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-blue-50'} 
                    transition-colors duration-150
                    ${idx !== days.length - 1 ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}
                  `}
                  onMouseEnter={() => setHighlightedRow(day)}
                  onMouseLeave={() => setHighlightedRow(null)}
                >
                  {columns.map((column) => renderCell(day, column))}
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} w-full`}></td>
                </tr>
              ))}
            </tbody>
            {showSummaryRow && (
              <tfoot>
                <tr className={`${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
                  {columns.map((column, index) => {
                    const summary = calculateSummary(column);
                    const widthClass = columnWidths[column.Type] || '';
                    return (
                      <td
                        key={column.ColumnId}
                        className={`px-4 py-2 text-center text-sm font-medium ${darkMode ? 'text-gray-200 border-gray-700' : 'text-gray-700 border-gray-200'} border-r ${widthClass}`}
                      >
                        {summary}
                      </td>
                    );
                  })}
                  <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} w-full`}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center">
        <button
          onClick={() => setShowSummaryRow(!showSummaryRow)}
          className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'} flex items-center`}
        >
          {showSummaryRow ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Hide Summary
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show Summary
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Table;