import React from 'react';
import {
  CheckboxColumn,
  DaysColumn,
  FillerColumn,
  NumberColumn,
  TagsColumn,
  NotesColumn,
  MultiCheckboxColumn,
  TodoColumn,
  TaskTableColumn,
} from './columns';
import TableItemWrapper from './columns/TableItemWrapper';
import './Table.css';
import { useSelector } from 'react-redux';
import { useRowHeightSync } from './hooks/useRowHeightSync';

const Table: React.FC = () => {
  const columnOrder: string[] = useSelector(
    (state: Record<string, any>) => state.tableData?.columnOrder ?? [],
  );
  const columnsData = useSelector(
    (state: Record<string, any>) => state.tableData?.columns ?? {},
  );

  const componentsMap: Record<string, React.FC<any>> = {
    days: DaysColumn,
    checkbox: CheckboxColumn,
    numberbox: NumberColumn,
    multiselect: TagsColumn,
    text: NotesColumn,
    multicheckbox: MultiCheckboxColumn,
    todo: TodoColumn,
    tasktable: TaskTableColumn,
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
    width: daysColumnData?.Width || 135,
  };

  // Sync row heights across all table columns
  useRowHeightSync([columnsData, columnOrder]);

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
                <DaysColumn column={daysColumn} />
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
                column={{ id: 'filler', type: 'filler', width: 'auto' }}
              >
                <FillerColumn />
              </TableItemWrapper>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default Table;
