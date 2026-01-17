import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { TaskTableCell } from './TaskTableCell';
import { DAYS } from '../../TableLogic';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { TaskTableColumn as TaskTableColumnType } from '../../../../../types/newColumn.types';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import { getCheckBoxColorOptions } from '../../../../../utils/colorOptions';

interface TaskTableColumnProps {
    columnId: string;
}

export const TaskTableColumn: React.FC<TaskTableColumnProps> = ({
    columnId,
}) => {
    const { column, isLoading, isError } =
        useReactiveColumn<TaskTableColumnType>(columnId, 'taskTableColumn');

    // TODO: Add proper skeleton/error UI later
    if (isLoading) {
        return <div></div>;
    }

    if (isError || !column) {
        return null;
    }

    const availableTags = column.uniqueProps.availableTags || [];
    const doneTaskIds = column.uniqueProps.doneTasks || [];

    const nameToId: Record<string, string> = {};
    const idToName: Record<string, string> = {};
    availableTags.forEach((tag) => {
        nameToId[tag.name] = tag.id;
        idToName[tag.id] = tag.name;
    });

    const checkboxColors = getCheckBoxColorOptions({ darkMode: false });
    const hexToName: Record<string, string> = {};
    Object.entries(checkboxColors).forEach(([name, cfg]) => {
        if (cfg.hex) {
            hexToName[cfg.hex.toLowerCase()] = name;
        }
    });

    const tagColors: Record<string, string> = {};
    availableTags.forEach((tag) => {
        const hex = (tag.color || '').toLowerCase();
        const colorName = hexToName[hex] || 'blue';
        tagColors[tag.name] = colorName;
    });

    const completedTaskNames = availableTags
        .filter((tag) => doneTaskIds.includes(tag.id))
        .map((tag) => tag.name);

    const incompleteTaskNames = availableTags
        .filter((tag) => !doneTaskIds.includes(tag.id))
        .map((tag) => tag.name);

    const handleChangeOptions = (
        _id: string,
        _incomplete: string[],
        _tagColors: Record<string, string>,
        completed: string[],
    ) => {
        const completedIds = completed
            .map((name) => nameToId[name])
            .filter((val): val is string => Boolean(val));

        updateColumnFields(columnId, {
            'uniqueProps.doneTasks': completedIds,
        });
    };

    return (
        <table className="checkbox-nested-table font-poppins">
            <ColumnHeader columnId={columnId} />
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
                                tagColors,
                                options: incompleteTaskNames,
                                doneTags: completedTaskNames,
                            }}
                            onChangeOptions={handleChangeOptions}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
