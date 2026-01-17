import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { TaskTableCell } from '.';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import { updateCommonColumnProperties } from '../../../../../store/tableSlice/tableSlice';

interface TaskTableColumnProps {
    columnId: string;
}

export const TaskTableColumn: React.FC<TaskTableColumnProps> = ({
    columnId,
}) => {
    const customClearColumn = () => {
        dispatch(
            updateCommonColumnProperties({
                columnId,
                properties: {
                    uniqueProperties: {
                        ...columnData.uniqueProperties,
                        Options: [],
                        OptionsColors: {},
                        DoneTags: [],
                    },
                },
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
                        Options: options,
                        OptionsColors: tagColors,
                        DoneTags: doneTags || [],
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

    const handleChangeOptions = (
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
                        ...columnData.uniqueProperties,
                        Options: options,
                        OptionsColors: tagColors,
                        DoneTags: doneTags || [],
                    },
                },
            }),
        );
    };

    const columnForHeader = {
        ...baseColumnForHeader,
        options: columnData.uniqueProperties?.Options,
        tagColors: columnData.uniqueProperties?.OptionsColors,
        doneTags: columnData.uniqueProperties?.DoneTags,
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
                        <TaskTableCell
                            column={{
                                id: columnId,
                                ...columnData,
                                tagColors:
                                    columnData.uniqueProperties
                                        ?.OptionsColors || {},
                                options:
                                    columnData.uniqueProperties?.Options || [],
                                doneTags:
                                    columnData.uniqueProperties?.DoneTags || [],
                            }}
                            onChangeOptions={handleChangeOptions}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
