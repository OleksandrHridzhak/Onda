import { useCallback, useMemo } from 'react';
import { useColumns, Column } from '../../../../database';

interface ColumnLogicOptions {
  columnId: string;
  clearValue?: any;
  clearPath?: string[];
  customHandleChangeOptions?: (
    id: string,
    options: string[],
    tagColors: Record<string, string>,
    doneTags?: string[],
  ) => void;
  customClearColumn?: () => void;
}

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Default empty column data to satisfy TypeScript
const emptyColumn: Partial<Column> = {
  uniqueProperties: {},
};

export const useColumnLogic = ({
  columnId,
  clearValue = '',
  clearPath,
  customHandleChangeOptions,
  customClearColumn,
}: ColumnLogicOptions) => {
  const {
    columns,
    columnOrder,
    updateColumnNested,
    updateColumnProperties,
    swapColumnsPosition,
    deleteColumn,
  } = useColumns();

  const columnData = useMemo(
    () => columns[columnId] || emptyColumn,
    [columns, columnId],
  ) as Column;

  const handleMoveColumn = useCallback(
    (id: string, direction: string) => {
      const mappedDirection = direction === 'up' ? 'left' : 'right';
      swapColumnsPosition(id, mappedDirection as 'left' | 'right');
    },
    [swapColumnsPosition],
  );

  const handleChangeWidth = useCallback(
    (id: string, width: number) => {
      updateColumnProperties(id, { width });
    },
    [updateColumnProperties],
  );

  const defaultHandleClearColumn = useCallback(() => {
    if (clearPath) {
      updateColumnNested(columnId, clearPath, clearValue);
    } else {
      DAYS.forEach((day) => {
        updateColumnNested(columnId, ['Days', day], clearValue);
      });
    }
  }, [columnId, clearPath, clearValue, updateColumnNested]);

  const defaultHandleChangeOptions = useCallback(
    (
      id: string,
      options: string[],
      tagColors: Record<string, string>,
      doneTags?: string[],
    ) => {
      // Update uniqueProperties with options
      const updates: Record<string, unknown> = {
        Options: options,
        OptionsColors: tagColors,
      };
      if (doneTags) {
        updates.DoneTags = doneTags;
      }

      // We need to update each property individually
      updateColumnNested(id, ['Options'], options);
      updateColumnNested(id, ['OptionsColors'], tagColors);
      if (doneTags) {
        updateColumnNested(id, ['DoneTags'], doneTags);
      }
    },
    [updateColumnNested],
  );

  const columnMenuLogic = useMemo(
    () => ({
      handleDeleteColumn: (id: string) => {
        deleteColumn(id);
      },
      handleClearColumn: customClearColumn || defaultHandleClearColumn,
      handleRename: (id: string, newName: string) => {
        updateColumnProperties(id, { name: newName });
      },
      handleChangeIcon: (id: string, newIcon: string) => {
        updateColumnProperties(id, { emojiIcon: newIcon });
      },
      handleChangeDescription: (id: string, description: string) => {
        updateColumnProperties(id, { description });
      },
      handleToggleTitleVisibility: (id: string, visible: boolean) => {
        updateColumnProperties(id, { nameVisible: visible });
      },
      handleChangeOptions:
        customHandleChangeOptions || defaultHandleChangeOptions,
      handleChangeCheckboxColor: (id: string, color: string) => {
        updateColumnNested(id, ['CheckboxColor'], color);
      },
    }),
    [
      deleteColumn,
      customClearColumn,
      defaultHandleClearColumn,
      updateColumnProperties,
      customHandleChangeOptions,
      defaultHandleChangeOptions,
      updateColumnNested,
    ],
  );

  const allColumns = useMemo(() => columns, [columns]);

  const columnsForList = useMemo(() => {
    return columnOrder.map((id) => ({
      id,
      ...allColumns[id],
      name: allColumns[id]?.name,
      type: allColumns[id]?.type?.toLowerCase(),
      emojiIcon: allColumns[id]?.emojiIcon,
      nameVisible: allColumns[id]?.nameVisible,
    }));
  }, [columnOrder, allColumns]);

  const columnForHeader = useMemo(
    () => ({
      id: columnId,
      name: columnData.name,
      type: columnData.type?.toLowerCase(),
      emojiIcon: columnData.emojiIcon,
      nameVisible: columnData.nameVisible,
      width: columnData.width,
      description: columnData.description,
      checkboxColor: (columnData.uniqueProperties as Record<string, unknown>)
        ?.CheckboxColor,
      options:
        (columnData.uniqueProperties as Record<string, unknown>)?.Options || [],
      tagColors:
        (columnData.uniqueProperties as Record<string, unknown>)
          ?.OptionsColors || {},
      doneTags:
        (columnData.uniqueProperties as Record<string, unknown>)?.DoneTags ||
        [],
    }),
    [columnId, columnData],
  );

  return {
    columnData,
    columnOrder,
    allColumns,
    updateColumnNested: (path: string[], value: unknown) =>
      updateColumnNested(columnId, path, value),
    handleMoveColumn,
    handleChangeWidth,
    columnMenuLogic,
    columns: columnsForList,
    columnForHeader,
  };
};
