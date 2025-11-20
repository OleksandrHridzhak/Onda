import React from 'react';
import PlannerHeader from '../planerHeader/PlannerHeader';
import ColumnTypeSelector from '../planerHeader/ColumnTypeSelector';
import { LoadingScreen } from './LoadingScreen';
import { useTableLogic, getWidthStyle, calculateSummary } from './TableLogic';
import { useColumnMenuLogic } from './columnMenu/ColumnMenuLogic';
import { useSelector } from 'react-redux';
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
        
        /* Примусово застосовуємо Poppins */
        .checkbox-nested-table,
        .checkbox-nested-table * {
          font-family: 'Poppins', sans-serif !important;
          font-weight: 450 !important;
        }
        
        /* Для headers можна залишити medium */
        .checkbox-nested-table thead th {
          font-weight: 500 !important;
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
        className={`overflow-x-auto font-poppins border border-border rounded-xl m-2 custom-scroll`}
      >
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full">
            <thead>
              <tr
                className={`border-border bg-tableHeader text-textTableValues border-b`}
              >
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
