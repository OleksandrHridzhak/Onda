import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { TodoCell } from './TodoCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import {
    updateColumnNested,
    updateCommonColumnProperties,
} from '../../../../../store/tableSlice/tableSlice';

interface TodoColumnProps {
    columnId: string;
}

export const TodoColumn: React.FC<TodoColumnProps> = ({ columnId }) => {
    const customClearColumn = () => {
        dispatch(
            updateColumnNested({
                columnId,
                path: ['Chosen', 'global'],
                value: [],
            }),
        );
    };

    const customHandleChangeOptions = (
        id: string,
        options: string[],
        tagColors: Record<string, string>,
        doneTags?: string[],
    ) => {
        dispatch(
            updateCommonColumnProperties({
                columnId: id,
                properties: {
                    uniqueProperties: {
                        ...columnData?.uniqueProperties,
                        Categorys: options,
                        CategoryColors: tagColors,
                    },
                },
            }),
        );
    };

    const {
        columnData,
        dispatch,
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

    const handleCellChange = (newValue: any) => {
        dispatch(
            updateColumnNested({
                columnId,
                path: ['Chosen', 'global'],
                value: newValue,
            }),
        );
    };

    const columnForHeader = {
        ...baseColumnForHeader,
        options: columnData?.uniqueProperties?.Categorys,
        tagColors: columnData?.uniqueProperties?.CategoryColors,
        Chosen: columnData?.uniqueProperties?.Chosen,
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
                            value={
                                columnData.uniqueProperties?.Chosen?.global ||
                                []
                            }
                            onChange={handleCellChange}
                            column={{
                                id: columnId,
                                type: columnData.type || 'todo',
                                ...columnData,
                                options:
                                    columnData?.uniqueProperties?.Categorys ||
                                    columnData.options,
                                tagColors:
                                    columnData?.uniqueProperties
                                        ?.CategoryColors ||
                                    columnData?.tagColors,
                            }}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
