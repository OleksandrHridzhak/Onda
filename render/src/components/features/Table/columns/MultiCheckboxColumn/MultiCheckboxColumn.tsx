import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { MultiCheckboxCell } from './MultiCheckBoxCell';
import { DayColumnLayout } from '../DayColumnLayout';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import { MultiCheckboxColumn as MultiCheckboxColumnType } from '../../../../../types/newColumn.types';

interface MultiCheckboxColumnProps {
    columnId: string;
}

/**
 * MultiCheckboxColumn component
 * Displays multiple checkbox options that can be selected for each day of the week.
 * Uses Dexie live queries for reactive updates following the same pattern as CheckboxColumn.
 */
export const MultiCheckboxColumn: React.FC<MultiCheckboxColumnProps> = ({
    columnId,
}) => {
    const { column, isLoading, isError } =
        useReactiveColumn<MultiCheckboxColumnType>(
            columnId,
            'multiCheckBoxColumn',
        );

    // TODO: Replace with a proper skeleton loader
    if (isLoading) {
        return <div></div>;
    }

    if (isError || !column) {
        return null;
    }

    const handleCellChange = (day: string, selectedIds: string[]) => {
        updateColumnFields(columnId, {
            [`uniqueProps.days.${day}`]: selectedIds,
        });
    };

    return (
        <table className="checkbox-nested-table column-multicheckbox font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout>
                {(day) => {
                    const selectedIds =
                        column.uniqueProps.days?.[day] || [];

                    return (
                        <MultiCheckboxCell
                            selectedOptionIds={selectedIds}
                            onChange={(newIds) => handleCellChange(day, newIds)}
                            availableOptions={
                                column.uniqueProps.availableOptions
                            }
                        />
                    );
                }}
            </DayColumnLayout>
        </table>
    );
};
