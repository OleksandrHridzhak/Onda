import React from 'react';
import PlannerHeader from '../planerHeader/PlannerHeader';
import ColumnTypeSelector from '../planerHeader/ColumnTypeSelector';
import ColumnHeader from './ColumnHeader';
import { LoadingScreen } from './LoadingScreen';
import { CheckboxCell } from './cells/CheckboxCell';
import {
  useTableLogic,
  DAYS,
  getWidthStyle,
  calculateSummary,
  RenderCell,
} from './TableLogic';
import { useColumnMenuLogic } from './columnMenu/ColumnMenuLogic';
import { useSelector } from 'react-redux';

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
            <ColumnHeader
              column={column}
              onRename={columnMenuLogic.handleRename}
              onRemove={columnMenuLogic.handleDeleteColumn}
              onClearColumn={columnMenuLogic.handleClearColumn}
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
                  ) : (
                    <ColumnHeader
                      key={column.id}
                      column={column as any}
                      onRename={columnMenuLogic.handleRename}
                      onRemove={columnMenuLogic.handleDeleteColumn}
                      onClearColumn={columnMenuLogic.handleClearColumn}
                      onChangeIcon={columnMenuLogic.handleChangeIcon}
                      onChangeDescription={
                        columnMenuLogic.handleChangeDescription
                      }
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
                      onChangeCheckboxColor={
                        columnMenuLogic.handleChangeCheckboxColor
                      }
                      onMoveUp={(id: string) => handleMoveColumn(id, 'up')}
                      onMoveDown={(id: string) => handleMoveColumn(id, 'down')}
                      canMoveUp={
                        column.id !== 'days' && columns.indexOf(column) > 1
                      }
                      canMoveDown={
                        column.id !== 'days' &&
                        columns.indexOf(column) < columns.length - 1
                      }
                      onChangeWidth={handleChangeWidth}
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
                  {displayColumns.map((column, index) =>
                    column.type === 'checkbox' ||
                    column.type === 'days' ||
                    column.type === 'filler' ? null : (
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
                    ),
                  )}
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

export default Table2;
