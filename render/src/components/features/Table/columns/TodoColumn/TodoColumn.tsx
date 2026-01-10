import React, { useCallback } from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { TodoCell } from './TodoCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import { useColumns } from '../../../../../database';

interface TodoColumnProps {
  columnId: string;
}

type TodoItem = { text: string; completed: boolean; category?: string };

export const TodoColumn: React.FC<TodoColumnProps> = ({ columnId }) => {
  const { updateColumnNested: updateNested } = useColumns();

  const customClearColumn = useCallback(() => {
    updateNested(columnId, ['Chosen', 'global'], []);
  }, [columnId, updateNested]);

  const customHandleChangeOptions = useCallback(
    (id: string, options: string[], tagColors: Record<string, string>) => {
      updateNested(id, ['Categorys'], options);
      updateNested(id, ['CategoryColors'], tagColors);
    },
    [updateNested],
  );

  const {
    columnData,
    updateColumnNested,
    handleMoveColumn,
    handleChangeWidth,
    columnMenuLogic,
    columns,
    columnForHeader: baseColumnForHeader,
  } = useColumnLogic({
    columnId,
    customClearColumn,
    customHandleChangeOptions,
  });

  const handleCellChange = (newValue: TodoItem[]) => {
    updateColumnNested(['Chosen', 'global'], newValue);
  };

  const uniqueProps =
    (columnData.uniqueProperties as Record<string, unknown>) || {};
  const chosen = uniqueProps.Chosen as Record<string, unknown> | undefined;
  const globalTodos = (chosen?.global as TodoItem[]) || [];

  const columnForHeader = {
    ...baseColumnForHeader,
    options: uniqueProps.Categorys,
    tagColors: uniqueProps.CategoryColors,
    Chosen: uniqueProps.Chosen,
  };

  return (
    <table className="checkbox-nested-table font-poppins">
      <thead className="bg-tableHeader">
        <tr>
          <th className="border-b border-border">
            <ColumnHeaderContent
              column={columnForHeader}
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
          <td
            className="px-2 py-3 text-sm text-textTableRealValues todo-cell"
            style={{ verticalAlign: 'top' }}
            rowSpan={DAYS.length}
          >
            <TodoCell
              value={globalTodos}
              onChange={handleCellChange}
              column={{
                id: columnId,
                type: columnData.type || 'todo',
                options: (uniqueProps.Categorys as string[]) || [],
                tagColors:
                  (uniqueProps.CategoryColors as Record<string, string>) || {},
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};
