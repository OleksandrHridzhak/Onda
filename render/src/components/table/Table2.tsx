import React, { useState } from 'react';
import PlannerHeader from '../planerHeader/PlannerHeader';
import ColumnTypeSelector from '../planerHeader/ColumnTypeSelector';
import ColumnMenu from './columnMenu/ColumnMenu';
import { getIconComponent } from '../utils/icons';
import { LoadingScreen } from './LoadingScreen';
import { CheckboxCell } from './cells/CheckboxCell';
import { NumberCell } from './cells/NumberCell';
import { TagsCell } from './cells/TagsCell';
import { NotesCell } from './cells/NotesCell';
import { MultiCheckboxCell } from './cells/MultiCheckboxCell';
import { TodoCell } from './cells/TodoCell';
import { TaskTableCell } from './cells/TaskTableCell';
import {
  useTableLogic,
  DAYS,
  getWidthStyle,
  calculateSummary,
} from './TableLogic';
import { useColumnMenuLogic } from './columnMenu/ColumnMenuLogic';
import { useSelector } from 'react-redux';

// Компонент для рендеру вмісту заголовка колонки (без <th> обгортки)
const ColumnHeaderContent: React.FC<{
  column: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}> = ({ column, columnMenuLogic, handleMoveColumn, handleChangeWidth, columns }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isEmptyHeader =
    !column.emojiIcon && (column.nameVisible === false || !column.name);

  const handleClose = (): void => {
    setShowMenu(false);
  };

  return (
    <div
      className={`flex items-center justify-between group cursor-pointer px-3 py-3 ${column.nameVisible === false || isEmptyHeader ? 'justify-center' : ''}`}
      onClick={() => column.id !== 'days' && setShowMenu(true)}
    >
      <div
        className={`flex items-center ${column.nameVisible === false || isEmptyHeader ? 'justify-center w-full' : ''}`}
      >
        {column.emojiIcon && (
          <span className={column.nameVisible !== false ? 'mr-1' : ''}>
            {getIconComponent(column.emojiIcon, 16)}
          </span>
        )}
        {column.nameVisible !== false && column.name && (
          <span className={`truncate block text-textTableValues max-w-full`}>
            {column.name}
          </span>
        )}
        {isEmptyHeader && <span className="opacity-0">∅</span>}
      </div>
      {showMenu && (
        <ColumnMenu
          column={column}
          onClose={handleClose}
          handleDeleteColumn={columnMenuLogic.handleDeleteColumn}
          handleClearColumn={columnMenuLogic.handleClearColumn}
          onRename={columnMenuLogic.handleRename}
          onChangeIcon={columnMenuLogic.handleChangeIcon}
          onChangeDescription={columnMenuLogic.handleChangeDescription}
          onToggleTitleVisibility={(id: string, visible: boolean) =>
            columnMenuLogic.handleToggleTitleVisibility(id, visible)
          }
          onChangeOptions={(
            id: string,
            options: string[],
            tagColors: Record<string, string>,
            doneTags?: string[],
          ) =>
            columnMenuLogic.handleChangeOptions(
              id,
              options,
              tagColors,
              doneTags,
            )
          }
          onChangeCheckboxColor={columnMenuLogic.handleChangeCheckboxColor}
          onMoveUp={(id: string) => handleMoveColumn(id, 'up')}
          onMoveDown={(id: string) => handleMoveColumn(id, 'down')}
          canMoveUp={column.id !== 'days' && columns.indexOf(column) > 1}
          canMoveDown={
            column.id !== 'days' &&
            columns.indexOf(column) < columns.length - 1
          }
          onChangeWidth={handleChangeWidth}
        />
      )}
    </div>
  );
};

// Wrapper компонент для чекбокс колонки
const CheckboxColumnWrapper: React.FC<{
  column: any;
  tableData: any;
  columnIndex: number;
  darkMode: boolean;
  handleCellChange: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}> = ({
  column,
  tableData,
  columnIndex,
  darkMode,
  handleCellChange,
  columnMenuLogic,
  handleMoveColumn,
  handleChangeWidth,
  columns,
}) => {
  return (
    <table className="checkbox-nested-table">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={column}
              columnMenuLogic={columnMenuLogic}
              handleMoveColumn={handleMoveColumn}
              handleChangeWidth={handleChangeWidth}
              columns={columns}
            />
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        {DAYS.map((day, idx) => (
          <tr
            key={day}
            className={idx !== DAYS.length - 1 ? 'border-b border-border' : ''}
          >
            <td>
              <CheckboxCell
                checked={tableData[day]?.[column.id] || false}
                onChange={(newValue) =>
                  handleCellChange(day, column.id, newValue)
                }
                color={column.CheckboxColor || '#3b82f6'}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Wrapper компонент для days колонки
const DaysColumnWrapper: React.FC<{
  column: any;
}> = ({ column }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <table className="checkbox-nested-table">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <div className="px-4 py-3 text-sm font-medium">
              {column.name || 'Days'}
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        {DAYS.map((day, idx) => (
          <tr
            key={day}
            className={idx !== DAYS.length - 1 ? 'border-b border-border' : ''}
          >
            <td className="px-4 py-3 text-sm font-medium text-textTableValues whitespace-nowrap">
              {day}
              {day === today && (
                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Wrapper компонент для filler колонки
const FillerColumnWrapper: React.FC = () => {
  return (
    <table className="checkbox-nested-table">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <div style={{ height: '52px' }} />
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        {DAYS.map((day, idx) => (
          <tr
            key={day}
            className={idx !== DAYS.length - 1 ? 'border-b border-border' : ''}
          >
            <td style={{ height: '60px' }} />
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Wrapper компонент для numberbox колонки
const NumberColumnWrapper: React.FC<{
  column: any;
  tableData: any;
  columnIndex: number;
  darkMode: boolean;
  handleCellChange: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}> = ({
  column,
  tableData,
  columnIndex,
  darkMode,
  handleCellChange,
  columnMenuLogic,
  handleMoveColumn,
  handleChangeWidth,
  columns,
}) => {
  return (
    <table className="checkbox-nested-table">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={column}
              columnMenuLogic={columnMenuLogic}
              handleMoveColumn={handleMoveColumn}
              handleChangeWidth={handleChangeWidth}
              columns={columns}
            />
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        {DAYS.map((day, idx) => (
          <tr
            key={day}
            className={idx !== DAYS.length - 1 ? 'border-b border-border' : ''}
          >
            <td>
              <NumberCell
                value={tableData[day]?.[column.id] || ''}
                onChange={(newValue) =>
                  handleCellChange(day, column.id, newValue)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Wrapper компонент для multi-select (tags) колонки
const TagsColumnWrapper: React.FC<{
  column: any;
  tableData: any;
  columnIndex: number;
  darkMode: boolean;
  handleCellChange: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}> = ({
  column,
  tableData,
  columnIndex,
  darkMode,
  handleCellChange,
  columnMenuLogic,
  handleMoveColumn,
  handleChangeWidth,
  columns,
}) => {
  return (
    <table className="checkbox-nested-table">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={column}
              columnMenuLogic={columnMenuLogic}
              handleMoveColumn={handleMoveColumn}
              handleChangeWidth={handleChangeWidth}
              columns={columns}
            />
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        {DAYS.map((day, idx) => (
          <tr
            key={day}
            className={idx !== DAYS.length - 1 ? 'border-b border-border' : ''}
          >
            <td>
              <TagsCell
                value={tableData[day]?.[column.id] || ''}
                onChange={(newValue) =>
                  handleCellChange(day, column.id, newValue)
                }
                options={column.options || []}
                tagColors={column.tagColors || {}}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Wrapper компонент для text (notes) колонки
const NotesColumnWrapper: React.FC<{
  column: any;
  tableData: any;
  columnIndex: number;
  darkMode: boolean;
  handleCellChange: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}> = ({
  column,
  tableData,
  columnIndex,
  darkMode,
  handleCellChange,
  columnMenuLogic,
  handleMoveColumn,
  handleChangeWidth,
  columns,
}) => {
  return (
    <table className="checkbox-nested-table">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={column}
              columnMenuLogic={columnMenuLogic}
              handleMoveColumn={handleMoveColumn}
              handleChangeWidth={handleChangeWidth}
              columns={columns}
            />
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        {DAYS.map((day, idx) => (
          <tr
            key={day}
            className={idx !== DAYS.length - 1 ? 'border-b border-border' : ''}
          >
            <td>
              <NotesCell
                value={tableData[day]?.[column.id] || ''}
                onChange={(newValue) =>
                  handleCellChange(day, column.id, newValue)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Wrapper компонент для multicheckbox колонки
const MultiCheckboxColumnWrapper: React.FC<{
  column: any;
  tableData: any;
  columnIndex: number;
  darkMode: boolean;
  handleCellChange: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}> = ({
  column,
  tableData,
  columnIndex,
  darkMode,
  handleCellChange,
  columnMenuLogic,
  handleMoveColumn,
  handleChangeWidth,
  columns,
}) => {
  return (
    <table className="checkbox-nested-table">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={column}
              columnMenuLogic={columnMenuLogic}
              handleMoveColumn={handleMoveColumn}
              handleChangeWidth={handleChangeWidth}
              columns={columns}
            />
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        {DAYS.map((day, idx) => (
          <tr
            key={day}
            className={idx !== DAYS.length - 1 ? 'border-b border-border' : ''}
          >
            <td>
              <MultiCheckboxCell
                value={tableData[day]?.[column.id] || ''}
                onChange={(newValue) =>
                  handleCellChange(day, column.id, newValue)
                }
                options={column.options || []}
                tagColors={column.tagColors || {}}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Wrapper компонент для todo колонки
const TodoColumnWrapper: React.FC<{
  column: any;
  tableData: any;
  columnIndex: number;
  darkMode: boolean;
  handleCellChange: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}> = ({
  column,
  tableData,
  columnIndex,
  darkMode,
  handleCellChange,
  columnMenuLogic,
  handleMoveColumn,
  handleChangeWidth,
  columns,
}) => {
  return (
    <table className="checkbox-nested-table">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={column}
              columnMenuLogic={columnMenuLogic}
              handleMoveColumn={handleMoveColumn}
              handleChangeWidth={handleChangeWidth}
              columns={columns}
            />
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        <tr>
          <td className="todo-cell" rowSpan={DAYS.length}>
            <TodoCell
              value={column.tasks || []}
              onChange={(newValue) =>
                handleCellChange('global', column.id, newValue)
              }
              column={column}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

// Wrapper компонент для tasktable колонки
const TaskTableColumnWrapper: React.FC<{
  column: any;
  tableData: any;
  columnIndex: number;
  darkMode: boolean;
  handleCellChange: any;
  handleChangeOptions: any;
  columnMenuLogic: any;
  handleMoveColumn: any;
  handleChangeWidth: any;
  columns: any[];
}> = ({
  column,
  tableData,
  columnIndex,
  darkMode,
  handleCellChange,
  handleChangeOptions,
  columnMenuLogic,
  handleMoveColumn,
  handleChangeWidth,
  columns,
}) => {
  return (
    <table className="checkbox-nested-table">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={column}
              columnMenuLogic={columnMenuLogic}
              handleMoveColumn={handleMoveColumn}
              handleChangeWidth={handleChangeWidth}
              columns={columns}
            />
          </th>
        </tr>
      </thead>
      <tbody className="bg-tableBodyBg">
        <tr>
          <td className="todo-cell" rowSpan={DAYS.length}>
            <TaskTableCell
              column={column}
              onChangeOptions={handleChangeOptions}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const Table2: React.FC = () => {
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
        
        /* Стилі для вкладеної таблиці чекбоксів */
        .checkbox-nested-table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
        }
        .checkbox-nested-table thead th {
          height: 52px;
          padding: 0;
          border: none;
          box-sizing: border-box;
          border-bottom: 1px solid var(--border);
        }
        .checkbox-nested-table tbody td {
          height: 60px;
          padding: 0;
          border: none;
          box-sizing: border-box;
        }
        .checkbox-nested-table thead th > div {
          height: 100%;
          display: flex;
          align-items: center;
        }
        /* Забираємо border-bottom з ColumnHeader щоб не було подвійного */
        .checkbox-nested-table thead th .border-b {
          border-bottom: none !important;
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
                {displayColumns.map((column, index) =>
                  column.type === 'filler' ? (
                    <th
                      key={column.id}
                      style={{
                        ...getWidthStyle(column),
                        padding: 0,
                        verticalAlign: 'top',
                      }}
                    >
                      <FillerColumnWrapper />
                    </th>
                  ) : column.type === 'days' ? (
                    <th
                      key={column.id}
                      style={{
                        ...getWidthStyle(column),
                        padding: 0,
                        verticalAlign: 'top',
                      }}
                      className="border-r border-border"
                    >
                      <DaysColumnWrapper column={column} />
                    </th>
                  ) : column.type === 'checkbox' ? (
                    <th
                      key={column.id}
                      style={{
                        ...getWidthStyle(column),
                        padding: 0,
                        verticalAlign: 'top',
                      }}
                      className="border-r border-border"
                    >
                      <CheckboxColumnWrapper
                        column={column}
                        tableData={tableData}
                        columnIndex={index}
                        darkMode={darkMode}
                        handleCellChange={handleCellChange}
                        columnMenuLogic={columnMenuLogic}
                        handleMoveColumn={handleMoveColumn}
                        handleChangeWidth={handleChangeWidth}
                        columns={columns}
                      />
                    </th>
                  ) : column.type === 'numberbox' ? (
                    <th
                      key={column.id}
                      style={{
                        ...getWidthStyle(column),
                        padding: 0,
                        verticalAlign: 'top',
                      }}
                      className="border-r border-border"
                    >
                      <NumberColumnWrapper
                        column={column}
                        tableData={tableData}
                        columnIndex={index}
                        darkMode={darkMode}
                        handleCellChange={handleCellChange}
                        columnMenuLogic={columnMenuLogic}
                        handleMoveColumn={handleMoveColumn}
                        handleChangeWidth={handleChangeWidth}
                        columns={columns}
                      />
                    </th>
                  ) : column.type === 'multi-select' ? (
                    <th
                      key={column.id}
                      style={{
                        ...getWidthStyle(column),
                        padding: 0,
                        verticalAlign: 'top',
                      }}
                      className="border-r border-border"
                    >
                      <TagsColumnWrapper
                        column={column}
                        tableData={tableData}
                        columnIndex={index}
                        darkMode={darkMode}
                        handleCellChange={handleCellChange}
                        columnMenuLogic={columnMenuLogic}
                        handleMoveColumn={handleMoveColumn}
                        handleChangeWidth={handleChangeWidth}
                        columns={columns}
                      />
                    </th>
                  ) : column.type === 'text' ? (
                    <th
                      key={column.id}
                      style={{
                        ...getWidthStyle(column),
                        padding: 0,
                        verticalAlign: 'top',
                      }}
                      className="border-r border-border"
                    >
                      <NotesColumnWrapper
                        column={column}
                        tableData={tableData}
                        columnIndex={index}
                        darkMode={darkMode}
                        handleCellChange={handleCellChange}
                        columnMenuLogic={columnMenuLogic}
                        handleMoveColumn={handleMoveColumn}
                        handleChangeWidth={handleChangeWidth}
                        columns={columns}
                      />
                    </th>
                  ) : column.type === 'multicheckbox' ? (
                    <th
                      key={column.id}
                      style={{
                        ...getWidthStyle(column),
                        padding: 0,
                        verticalAlign: 'top',
                      }}
                      className="border-r border-border"
                    >
                      <MultiCheckboxColumnWrapper
                        column={column}
                        tableData={tableData}
                        columnIndex={index}
                        darkMode={darkMode}
                        handleCellChange={handleCellChange}
                        columnMenuLogic={columnMenuLogic}
                        handleMoveColumn={handleMoveColumn}
                        handleChangeWidth={handleChangeWidth}
                        columns={columns}
                      />
                    </th>
                  ) : column.type === 'todo' ? (
                    <th
                      key={column.id}
                      style={{
                        ...getWidthStyle(column),
                        padding: 0,
                        verticalAlign: 'top',
                      }}
                      className="border-r border-border"
                    >
                      <TodoColumnWrapper
                        column={column}
                        tableData={tableData}
                        columnIndex={index}
                        darkMode={darkMode}
                        handleCellChange={handleCellChange}
                        columnMenuLogic={columnMenuLogic}
                        handleMoveColumn={handleMoveColumn}
                        handleChangeWidth={handleChangeWidth}
                        columns={columns}
                      />
                    </th>
                  ) : column.type === 'tasktable' ? (
                    <th
                      key={column.id}
                      style={{
                        ...getWidthStyle(column),
                        padding: 0,
                        verticalAlign: 'top',
                      }}
                      className="border-r border-border"
                    >
                      <TaskTableColumnWrapper
                        column={column}
                        tableData={tableData}
                        columnIndex={index}
                        darkMode={darkMode}
                        handleCellChange={handleCellChange}
                        handleChangeOptions={handleChangeOptions}
                        columnMenuLogic={columnMenuLogic}
                        handleMoveColumn={handleMoveColumn}
                        handleChangeWidth={handleChangeWidth}
                        columns={columns}
                      />
                    </th>
                  ) : null,
                )}
              </tr>
            </thead>
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

export default Table2;
