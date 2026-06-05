import React from 'react';
import { ColumnHeader } from 'features/Table/columns/ColumnHeader';
import { NumberboxCell } from 'features/Table/columns/NumberboxColumn/NumberboxCell';
import { NumberBoxColumn as NumberBoxColumnType } from 'app/types/newColumn.types';
import { ColumnEntryValueMap } from 'app/types/columnEntries.types';
import { useReactiveColumn } from 'features/Table/hooks/useReactiveColumn';
import { DayColumnLayout } from 'features/Table/columns/DayColumnLayout';
import { upsertDayEntry } from 'db/helpers/columnEntries';

interface NumberboxColumnProps {
    columnId: string;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
}

export const NumberboxColumn: React.FC<NumberboxColumnProps> = ({
    columnId,
    weekDates,
    weekEntriesByDate,
}) => {
    const { column, isLoading, isError } =
        useReactiveColumn<NumberBoxColumnType>(columnId, 'numberboxColumn');

    // TODO: Add a proper skeleton / error state later
    if (isLoading) {
        return <div></div>;
    }

    if (isError || !column) {
        return null;
    }

    const handleCellChange = (dateKey: string, newValue: string) => {
        const numericValue = newValue === '' ? null : Number(newValue);
        if (Number.isNaN(numericValue)) {
            return;
        }

        upsertDayEntry({
            columnId,
            dayDate: dateKey,
            valueType: 'number',
            value: numericValue,
        });
    };

    return (
        <table className="checkbox-nested-table column-numberbox font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => (
                    <NumberboxCell
                        value={
                            (weekEntriesByDate[dateKey]?.value as
                                | number
                                | null) ?? ''
                        }
                        onChange={(newValue) =>
                            handleCellChange(dateKey, newValue)
                        }
                    />
                )}
            </DayColumnLayout>
        </table>
    );
};
