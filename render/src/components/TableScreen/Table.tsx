import React from 'react';
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
import './Table.css';
import { useSelector } from 'react-redux';

const Table: React.FC = () => {
  const columnOrder: string[] = useSelector(
    (state: Record<string, any>) => state.tableData?.columnOrder ?? [],
  );
  const columnsData = useSelector(
    (state: Record<string, any>) => state.tableData?.columns ?? {},
  );

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

  // Find days column id and data (fallback to default if missing)
  const daysColumnId = Object.keys(columnsData).find(
    (id) => columnsData[id]?.Type?.toLowerCase() === 'days',
  );
  const daysColumnData = daysColumnId ? columnsData[daysColumnId] : null;
  const daysColumn = {
    id: daysColumnId || 'days',
    name: daysColumnData?.Name || 'Days',
    type: 'days',
    width: daysColumnData?.Width || 120,
  };

  return (
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
                column={daysColumn}
                className="border-r border-border"
              >
                <DaysColumnWrapper column={daysColumn} />
              </TableItemWrapper>

              {columnOrder.map((columnId: string) => {
                const columnData = columnsData[columnId];
                if (!columnData) return null;

                const columnType = columnData.Type?.toLowerCase();
                const Component = componentsMap[columnType];

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
        </table>
      </div>
    </div>
  );
};

export default Table;
