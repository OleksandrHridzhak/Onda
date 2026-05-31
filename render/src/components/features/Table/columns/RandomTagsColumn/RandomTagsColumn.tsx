import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { RandomTagsCell } from './RandomTagsCell';
import { DayColumnLayout } from '../DayColumnLayout';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { RandomTagsColumn as RandomTagsColumnType } from '../../../../../types/newColumn.types';
import { updateColumnFields } from '../../../../../db/helpers/columns';

interface RandomTagsColumnProps {
    columnId: string;
}

/**
 * RandomTagsColumn component
 * Displays tags that are automatically assigned to each day based on probability.
 * Users can regenerate random tags or manually adjust them.
 */
export const RandomTagsColumn: React.FC<RandomTagsColumnProps> = ({
    columnId,
}) => {
    const { column, isLoading, isError } =
        useReactiveColumn<RandomTagsColumnType>(columnId, 'randomTagsColumn');

    if (isLoading) {
        return <div></div>;
    }

    if (isError || !column) {
        return null;
    }

    const handleCellChange = (day: string, newTagIds: string[]) => {
        updateColumnFields(columnId, {
            [`uniqueProps.days.${day}`]: newTagIds,
        });
    };

    return (
        <table className="checkbox-nested-table font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout>
                {(day) => {
                    const tagIdsForDay =
                        column.uniqueProps.days[
                            day as keyof typeof column.uniqueProps.days
                        ] || [];

                    return (
                        <RandomTagsCell
                            selectedTagIds={tagIdsForDay}
                            onChange={(newTagIds) =>
                                handleCellChange(day, newTagIds)
                            }
                            availableTags={column.uniqueProps.availableTags}
                        />
                    );
                }}
            </DayColumnLayout>
        </table>
    );
};
