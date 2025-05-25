import React, { useState, useEffect } from 'react';
import { Settings, Download, Plus, Edit2, X, Check, Calendar, Menu, Eye, EyeOff, Trash2, ChevronDown, ChevronUp, Sun, Moon, ArrowUp, ArrowDown } from 'lucide-react';
import PlannerHeader from '../PlannerHeader';
import ColumnTypeSelector from '../ColumnTypeSelector';
import Cells from '../Cellss';
import ColumnHeader from '../ColumnHeader';
const { CheckboxCell, NumberCell, TagsCell, NotesCell, TodoCell, MultiCheckboxCell } = Cells;

const columnWidths = {
  days: '120px', // Fixed width for days column
  checkbox: '48px',
  numberbox: '80px',
  'multi-select': '128px',
  text: '256px',
  multicheckbox: '80px', // Додано ширину для multicheckbox
  filler: 'auto' // Filler column to take remaining space
};

const Table = ({ darkMode, setDarkMode }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState({});
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSummaryRow, setShowSummaryRow] = useState(false);
  const [columnOrder, setColumnOrder] = useState([]);
  const [headerLayout, setHeaderLayout] = useState('withWidget');

  // Create a derived columns array with a filler column
  const displayColumns = [
    ...columns,
    { ColumnId: 'filler', Type: 'filler', Name: '', EmojiIcon: '', NameVisible: false }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [daysResult, settingsResult] = await Promise.all([
          window.electronAPI.getAllDays(),
          window.electronAPI.getSettings()
        ]);

        const dayColumn = { ColumnId: 'days', Type: 'days', Name: 'Day', EmojiIcon: '', NameVisible: true };
        let fetchedColumns = [dayColumn];

        if (daysResult.status === 'Data fetched' && Array.isArray(daysResult.data)) {
          fetchedColumns = [dayColumn, ...daysResult.data.map(col => ({
            ...col,
            Width: col.Width ? parseInt(col.Width) : null
          }))];
        }

        if (settingsResult.status === 'Settings fetched' && settingsResult.data.table?.columnOrder?.length > 0) {
          const orderedColumns = [];
          const savedOrder = settingsResult.data.table.columnOrder;
          
          savedOrder.forEach(columnId => {
            const column = fetchedColumns.find(col => col.ColumnId === columnId);
            if (column) orderedColumns.push(column);
          });
          
          fetchedColumns.forEach(column => {
            if (!orderedColumns.find(col => col.ColumnId === column.ColumnId)) {
              orderedColumns.push(column);
            }
          });
          
          fetchedColumns = orderedColumns;
        }

        setColumns(fetchedColumns);
        setColumnOrder(fetchedColumns.map(col => col.ColumnId));
        
        if (settingsResult.status === 'Settings fetched') {
          const newSettings = {
            ...settingsResult.data,
            table: {
              ...settingsResult.data.table,
              columnOrder: fetchedColumns.map(col => col.ColumnId)
            }
          };
          await window.electronAPI.updateSettings(newSettings);
        }

        const initialTableData = days.reduce((acc, day) => {
          acc[day] = fetchedColumns.reduce((dayData, col) => {
            if (col.ColumnId !== 'days') {
              if (col.Type === 'multi-select' || col.Type === 'multicheckbox') {
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

  useEffect(() => {
    window.electronAPI.getSettings().then(({ data }) => {
      if (data?.table && typeof data.table.showSummaryRow === 'boolean') {
        setShowSummaryRow(data.table.showSummaryRow);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    window.electronAPI.getSettings().then(({ data }) => {
      if (data?.header?.layout) {
        setHeaderLayout(data.header.layout);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const onHeaderChange = (e) => {
      const newHeader = e.detail;
      if (newHeader?.layout) setHeaderLayout(newHeader.layout);
    };
    window.addEventListener('header-settings-changed', onHeaderChange);
    return () => window.removeEventListener('header-settings-changed', onHeaderChange);
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
          const updatedChosen = col.Type === 'todo'
            ? { global: value }
            : {
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

  const handleChangeOptions = async (columnId, options, tagColors) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.ColumnId === columnId
          ? { ...col, Options: options, TagColors: tagColors }
          : col
      )
    );
    updateBackend(columnId, { Options: options, TagColors: tagColors });
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
    } else if (column.Type === 'multi-select' || column.Type === 'multicheckbox') {
      return days.reduce((sum, day) => {
        const tags = tableData[day][column.ColumnId];
        if (typeof tags === 'string' && tags.trim() !== '') {
          const tagArray = tags.split(', ').filter(tag => tag.trim() !== '');
          return sum + tagArray.length;
        }
        return sum;
      }, 0);
    } else if (column.Type === 'todo') {
      const todos = column.Chosen?.global || [];
      const completed = todos.filter(todo => todo.completed).length;
      return `${completed}/${todos.length}`;
    } else if (column.Type === 'days') {
      return '';
    }
    return '-';
  };


  const handleMoveColumn = async (columnId, direction) => {
    const currentIndex = columns.findIndex(col => col.ColumnId === columnId);
    if (
      (direction === 'up' && currentIndex <= 1) || // Don't move above days column
      (direction === 'down' && currentIndex === columns.length - 1)
    ) {
      return;
    }

    const newColumns = [...columns];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const [movedColumn] = newColumns.splice(currentIndex, 1);
    newColumns.splice(newIndex, 0, movedColumn);

    setColumns(newColumns);
    const newColumnOrder = newColumns.map(col => col.ColumnId);
    setColumnOrder(newColumnOrder);

    try {
      await window.electronAPI.updateColumnOrder(newColumnOrder);
    } catch (err) {
      console.error('Failed to update column order:', err);
    }
  };

  const handleChangeWidth = async (columnId, newWidth) => {
    try {
      const width = parseInt(newWidth);
      if (isNaN(width) || width < 50 || width > 1000) {
        console.error('Invalid width value');
        return;
      }

      const column = columns.find(col => col.ColumnId === columnId);
      if (!column) {
        console.error('Column not found');
        return;
      }

      const updatedColumn = {
        ColumnId: column.ColumnId,
        Type: column.Type,
        Name: column.Name,
        Description: column.Description || '',
        EmojiIcon: column.EmojiIcon || '',
        NameVisible: column.NameVisible !== false,
        Options: column.Options || [],
        TagColors: column.TagColors || {},
        Chosen: column.Chosen || {},
        Width: width
      };

      setColumns(prevColumns =>
        prevColumns.map(col =>
          col.ColumnId === columnId ? { ...col, Width: width } : col
        )
      );

      await window.electronAPI.changeColumn(updatedColumn);

      const columnElements = document.querySelectorAll(`[data-column-id="${columnId}"]`);
      columnElements.forEach(element => {
        element.style.width = `${width}px`;
      });
    } catch (error) {
      console.error('Error updating column width:', error);
      setColumns(prevColumns =>
        prevColumns.map(col =>
          col.ColumnId === columnId ? { ...col, Width: col.Width } : col
        )
      );
    }
  };

  const handleChangeCheckboxColor = async (columnId, color) => {
    setColumns((prev) =>
      prev.map((col) => (col.ColumnId === columnId ? { ...col, CheckboxColor: color } : col))
    );
    updateBackend(columnId, { CheckboxColor: color });
  };

  const getWidthStyle = (column) => {
    if (column.Type === 'days') {
      return { width: '120px', minWidth: '120px' };
    }
    if (column.Type === 'filler') {
      return { width: 'auto', minWidth: '0px' };
    }
    if (column.Width) {
      return { width: `${column.Width}px`, minWidth: `${column.Width}px` };
    }
    return { width: columnWidths[column.Type], minWidth: columnWidths[column.Type] };
  };

  const renderCell = (day, column, columnIndex) => {
    const style = getWidthStyle(column);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    if (column.Type === 'days') {
      return (
        <td
          data-column-id={column.ColumnId}
          className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-gray-200 border-gray-700' : 'text-gray-600 border-gray-200'} border-r whitespace-nowrap`}
          style={style}
        >
          {day}
          {day === today && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
        </td>
      );
    }
    if (column.Type === 'filler') {
      return (
        <td
          data-column-id={column.ColumnId}
          className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-r`}
          style={style}
        />
      );
    }
    if (column.Type === 'todo') {
      return (
        <td
          data-column-id={column.ColumnId}
          className={`px-2 py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r todo-cell`}
          style={{ ...style, verticalAlign: 'top' }}
          rowSpan={days.length}
        >
          <TodoCell
            value={column.Chosen?.global || []}
            column={column}
            onChange={(value) => handleCellChange('global', column.ColumnId, value)}
            darkMode={darkMode}
          />
        </td>
      );
    }
    switch (column.Type) {
      case 'checkbox':
        return (
          <td
            data-column-id={column.ColumnId}
            className={`py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r`}
            style={style}
          >
            <CheckboxCell
              checked={tableData[day][column.ColumnId] || false}
              onChange={() => handleCellChange(day, column.ColumnId, !tableData[day][column.ColumnId])}
              darkMode={darkMode}
              color={column.CheckboxColor || 'green'}
            />
          </td>
        );
      case 'numberbox':
        return (
          <td
            data-column-id={column.ColumnId}
            className={`px-2 py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r`}
            style={style}
          >
            <NumberCell
              value={tableData[day][column.ColumnId] || ''}
              onChange={(value) => handleCellChange(day, column.ColumnId, value)}
              darkMode={darkMode}
            />
          </td>
        );
      case 'multi-select':
        return (
          <td
            data-column-id={column.ColumnId}
            className={`px-2 py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r`}
            style={style}
          >
            <TagsCell
              value={tableData[day][column.ColumnId] || ''}
              options={column.Options || []}
              onChange={(value) => handleCellChange(day, column.ColumnId, value)}
              darkMode={darkMode}
              tagColors={column.TagColors || {}}
            />
          </td>
        );
      case 'text':
        return (
          <td
            data-column-id={column.ColumnId}
            className={`px-2 py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r`}
            style={style}
          >
            <NotesCell
              value={tableData[day][column.ColumnId] || ''}
              onChange={(value) => handleCellChange(day, column.ColumnId, value)}
              darkMode={darkMode}
            />
          </td>
        );
      case 'multicheckbox':
        return (
          <td
            data-column-id={column.ColumnId}
            className={`px-2 py-3 text-sm ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'} border-r`}
            style={style}
          >
            <MultiCheckboxCell
              value={tableData[day][column.ColumnId] || ''}
              options={column.Options || []}
              onChange={(value) => handleCellChange(day, column.ColumnId, value)}
              darkMode={darkMode}
              tagColors={column.TagColors || {}}
            />
          </td>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="flex space-x-1 text-5xl font-bold text-blue-500 font-poppins">
          {['O', 'N', 'D', 'A'].map((ch, idx) => (
            <span
              key={idx}
              className="inline-block animate-bounce"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
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
          background: ${darkMode ? 'rgba(156, 163, 175, 0.7)' : 'rgba(156, 163, 175, 0.5)'};
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
                {displayColumns.map((column, index) => (
                  column.Type === 'filler' ? (
                    <th
                      key={column.ColumnId}
                      className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-r border-b`}
                      style={getWidthStyle(column)}
                    />
                  ) : (
                    <ColumnHeader
                      key={column.ColumnId}
                      column={column}
                      onRemove={handleDeleteColumn}
                      onRename={handleRename}
                      onChangeIcon={handleChangeIcon}
                      onChangeDescription={handleChangeDescription}
                      onToggleTitleVisibility={handleToggleTitleVisibility}
                      onChangeOptions={handleChangeOptions}
                      onChangeCheckboxColor={handleChangeCheckboxColor}
                      
                      onMoveUp={() => handleMoveColumn(column.ColumnId, 'up')}
                      onMoveDown={() => handleMoveColumn(column.ColumnId, 'down')}
                      canMoveUp={column.ColumnId !== 'days' && columns.indexOf(column) > 1}
                      canMoveDown={column.ColumnId !== 'days' && columns.indexOf(column) < columns.length - 1}
                      darkMode={darkMode}
                      columnWidths={columnWidths}
                      onChangeWidth={handleChangeWidth}
                      style={getWidthStyle(column)}
                    />
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, idx) => (
                <tr
                  key={day}
                  className={`
                    ${darkMode ? 'bg-gray-800' : 'bg-white'}
                    transition-colors duration-150
                    ${idx !== days.length - 1 ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}
                  `}
                >
                  {displayColumns.map((column, index) => {
                    if (column.Type === 'todo' && idx > 0) return null;
                    return renderCell(day, column, index);
                  })}
                </tr>
              ))}
            </tbody>
            {showSummaryRow && (
              <tfoot>
                <tr className={`${darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
                  {displayColumns.map((column, index) => {
                    if (column.Type === 'filler') {
                      return (
                        <td
                          key={column.ColumnId}
                          className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-r`}
                          style={getWidthStyle(column)}
                        />
                      );
                    }
                    const summary = calculateSummary(column);
                    const style = getWidthStyle(column);
                    return (
                      <td
                        key={column.ColumnId}
                        className={`px-4 py-2 text-center text-sm font-medium ${darkMode ? 'text-gray-200 border-gray-700' : 'text-gray-700 border-gray-200'} border-r`}
                        style={style}
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