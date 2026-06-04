import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { MultiCheckboxCell } from './MultiCheckBoxCell';
import { DayColumnLayout } from '../DayColumnLayout';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { MultiCheckboxColumn as MultiCheckboxColumnType } from '../../../../../types/newColumn.types';
import {
    ColumnEntrySnapshot,
    ColumnEntryValueMap,
} from '../../../../../types/columnEntries.types';
import { upsertDayEntry } from '../../../../../db/helpers/columnEntries';

interface MultiCheckboxColumnProps {
    columnId: string;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
}

/**
 * MultiCheckboxColumn component
 * Displays multiple checkbox options that can be selected for each day of the week.
 * Uses Dexie live queries for reactive updates following the same pattern as CheckboxColumn.
 */
export const MultiCheckboxColumn: React.FC<MultiCheckboxColumnProps> = ({
    columnId,
    weekDates,
    weekEntriesByDate,
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

    const handleCellChange = (dateKey: string, selectedIds: string[]) => {
        const selectedSnapshots: ColumnEntrySnapshot[] = selectedIds
            .map((optionId) =>
                column.uniqueProps.availableOptions.find(
                    (option) => option.id === optionId,
                ),
            )
            .filter((option): option is NonNullable<typeof option> =>
                Boolean(option),
            )
            .map((option) => ({
                id: option.id,
                name: option.name,
                color: option.color,
            }));

        upsertDayEntry({
            columnId,
            dayDate: dateKey,
            valueType: 'optionIds',
            value: selectedIds,
            meta: { selectedSnapshots },
        });
    };

    return (
        <table className="checkbox-nested-table column-multicheckbox font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => {
                    const entry = weekEntriesByDate[dateKey];
                    const selectedIds = (entry?.value as string[]) || [];

                    return (
                        <MultiCheckboxCell
                            selectedOptionIds={selectedIds}
                            onChange={(newIds) =>
                                handleCellChange(dateKey, newIds)
                            }
                            availableOptions={
                                column.uniqueProps.availableOptions
                            }
                            selectedSnapshots={
                                entry?.meta?.selectedSnapshots || []
                            }
                        />
                    );
                }}
            </DayColumnLayout>
        </table>
    );
};
