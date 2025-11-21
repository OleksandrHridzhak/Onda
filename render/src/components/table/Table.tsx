import React from 'react';
import PlannerHeader from '../planerHeader/PlannerHeader';
import ColumnTypeSelector from '../planerHeader/ColumnTypeSelector';
import { LoadingScreen } from './LoadingScreen';
import { useTableLogic } from './TableLogic';
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
import TableItemWrapper from './TableItemWrapper';

const Table: React.FC = () => {
  const {
    columns,
    showColumnSelector,
    setShowColumnSelector,
    loading,
    handleAddColumn,
  } = useTableLogic();

  const columnOrder: string[] = useSelector(
    (state: Record<string, any>) => state.tableData?.columnOrder ?? [],
  );
  const columnsData = useSelector(
    (state: Record<string, any>) => state.tableData?.columns ?? {},
  );
  const { mode } = useSelector((state: any) => state.theme);

  console.log('columnOrder:', columnOrder);
  console.log('columnsData:', columnsData);

  if (loading) {
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
      {/*

      PlanerHeader section*
      
      */}
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
      {/*

      Main table section*

      */}
      <div
        className={`overflow-x-auto font-poppins border border-border rounded-xl m-2 custom-scroll`}
      >
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full">
            <thead>
              <tr
                className={`border-border bg-tableHeader text-textTableValues border-b`}
              >
                <TableItemWrapper
                  key={'days-column'}
                  column={columns.find((col) => col.id === 'days')!}
                  className="border-r border-border"
                >
                  <DaysColumnWrapper
                    column={columns.find((col) => col.id === 'days')!}
                  />
                </TableItemWrapper>

                {columnOrder.map((columnId: string) => {
                  const columnData = columnsData[columnId];
                  if (!columnData) return null;

                  const columnType = columnData.Type?.toLowerCase();
                  const Component = componentsMap[columnType];

                  // Створюємо об'єкт колонки для TableItemWrapper
                  const column = {
                    id: columnId,
                    type: columnType,
                    width: columnData.Width,
                  };

                  if (Component) {
                    return (
                      <TableItemWrapper
                        key={columnId}
                        column={column}
                        className="border-r border-border"
                      >
                        <Component columnId={columnId} />
                      </TableItemWrapper>
                    );
                  }
                  return null;
                })}
                <TableItemWrapper
                  key={'filler'}
                  column={{ id: 'filler', type: 'filler', width: 0 }}
                >
                  <FillerColumnWrapper />
                </TableItemWrapper>
              </tr>
            </thead>

            {/* Table footer with stats */}

            {/* showSummaryRow && (
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
            )*/}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
