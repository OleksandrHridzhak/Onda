import { useSelector, useDispatch } from 'react-redux';
import {
  updateColumnNested,
  updateCommonColumnProperties,
  swapColumnsPosition,
  deleteColumn,
} from '../../../../store/tableSlice/tableSlice';
import { DAYS } from '../TableLogic';

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

export const useColumnLogic = ({
  columnId,
  clearValue = '',
  clearPath,
  customHandleChangeOptions,
  customClearColumn,
}: ColumnLogicOptions) => {
  const dispatch = useDispatch();

  const columnData: Record<string, any> = useSelector(
    (state: Record<string, any>) => state.tableData.columns[columnId] || {},
  );
  const columnOrder: string[] = useSelector(
    (state: Record<string, any>) => state.tableData?.columnOrder ?? [],
  );
  const allColumns = useSelector(
    (state: Record<string, any>) => state.tableData?.columns ?? {},
  );

  const handleMoveColumn = (id: string, direction: string) => {
    const mappedDirection = direction === 'up' ? 'left' : 'right';
    dispatch(swapColumnsPosition({ id, direction: mappedDirection }));
  };

  const handleChangeWidth = (id: string, width: number) => {
    dispatch(
      updateCommonColumnProperties({
        columnId: id,
        properties: { width: width },
      }),
    );
  };

  const defaultHandleClearColumn = () => {
    if (clearPath) {
      dispatch(
        updateColumnNested({
          columnId,
          path: clearPath,
          value: clearValue,
        }),
      );
    } else {
      DAYS.forEach((day) => {
        dispatch(
          updateColumnNested({
            columnId,
            path: ['days', day],
            value: clearValue,
          }),
        );
      });
    }
  };

  const defaultHandleChangeOptions = (
    id: string,
    options: string[],
    tagColors: Record<string, string>,
    doneTags?: string[],
  ) => {
    dispatch(
      updateCommonColumnProperties({
        columnId: id,
        properties: { options, tagColors, doneTags },
      }),
    );
  };

  const columnMenuLogic = {
    handleDeleteColumn: (id: string) => {
      dispatch(deleteColumn({ columnId: id }));
    },
    handleClearColumn: customClearColumn || defaultHandleClearColumn,
    handleRename: (id: string, newName: string) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { name: newName },
        }),
      );
    },
    handleChangeIcon: (id: string, newIcon: string) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { emojiIcon: newIcon },
        }),
      );
    },
    handleChangeDescription: (id: string, description: string) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { description: description },
        }),
      );
    },
    handleToggleTitleVisibility: (id: string, visible: boolean) => {
      dispatch(
        updateCommonColumnProperties({
          columnId: id,
          properties: { nameVisible: visible },
        }),
      );
    },
    handleChangeOptions:
      customHandleChangeOptions || defaultHandleChangeOptions,
    handleChangeCheckboxColor: (id: string, color: string) => {
      dispatch(
        updateColumnNested({
          columnId: id,
          path: ['checkboxColor'],
          value: color,
        }),
      );
    },
  };

  const columns = columnOrder.map((id) => ({
    id,
    ...allColumns[id],
  }));

  const columnForHeader = {
    id: columnId,
    ...columnData,
  };

  return {
    columnData,
    columnOrder,
    allColumns,
    dispatch,
    handleMoveColumn,
    handleChangeWidth,
    columnMenuLogic,
    columns,
    columnForHeader,
  };
};
