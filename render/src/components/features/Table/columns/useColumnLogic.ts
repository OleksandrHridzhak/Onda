import { useSelector, useDispatch } from 'react-redux';
import {
    updateColumnNested,
    updateCommonColumnProperties,
    swapColumnsPosition,
    deleteColumn,
} from '../../../../store/tableSlice/tableSlice';
import { getColumnById } from '../../../../db/helpers/columns';
import { DAYS } from '../TableLogic';
import { useLiveQuery } from 'dexie-react-hooks';

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

    const columnData: Record<string, any> = useLiveQuery(async () => {
        const res = await getColumnById(columnId);
        if (!res) {
            console.log(res.error);
            return {};
        }

        return res.data || {};
    });
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
                        path: ['Days', day],
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
                    path: ['CheckboxColor'],
                    value: color,
                }),
            );
        },
    };

    const columns = columnOrder.map((id) => ({
        id,
        ...allColumns[id],
        name: allColumns[id]?.name,
        type: allColumns[id]?.type?.toLowerCase(),
        emojiIcon: allColumns[id]?.emojiIcon,
        nameVisible: allColumns[id]?.nameVisible,
    }));

    const columnForHeader = {
        id: columnId,
        name: columnData?.name,
        type: columnData?.type?.toLowerCase(),
        emojiIcon: columnData?.emojiIcon,
        nameVisible: columnData?.nameVisible,
        width: columnData?.width,
        description: columnData?.description,
        checkboxColor: columnData?.uniqueProperties?.CheckboxColor,
        options:
            columnData?.uniqueProperties?.Options ||
            columnData?.uniqueProperties?.Tags ||
            [],
        tagColors:
            columnData?.uniqueProperties?.OptionsColors ||
            columnData?.uniqueProperties?.TagsColors ||
            columnData?.uniqueProperties?.CategoryColors ||
            {},
        doneTags: columnData?.uniqueProperties?.DoneTags || [],
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
