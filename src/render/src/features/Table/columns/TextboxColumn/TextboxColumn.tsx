import React from 'react';
import { ColumnHeader } from 'features/Table/columns/ColumnHeader';
import { TextboxCell } from 'features/Table/columns/TextboxColumn/TextboxCell';
import { TextboxColumn as TextboxColumnType } from 'shared/types/newColumn.types';
import { ColumnEntryValueMap } from 'shared/types/columnEntries.types';
import { useReactiveColumn } from 'features/Table/hooks/useReactiveColumn';
import { DayColumnLayout } from 'features/Table/columns/DayColumnLayout';
import { upsertDayEntry } from 'db/helpers/columnEntries';

// TODO : Don't repeat in each column, create a HOC for this pattern
interface TextboxColumnProps {
    columnId: string;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
}

export const TextboxColumn: React.FC<TextboxColumnProps> = ({
    columnId,
    weekDates,
    weekEntriesByDate,
}) => {
    const { isLoading } = useReactiveColumn<TextboxColumnType>(
        columnId,
        'textboxColumn',
    );

    // TODO: Try to add skeleton loading state later
    if (isLoading) {
        return <div></div>;
    }

    const handleCellChange = (dateKey: string, newValue: string) => {
        upsertDayEntry({
            columnId,
            dayDate: dateKey,
            valueType: 'text',
            value: newValue,
        });
    };

    return (
        <table className="checkbox-nested-table column-text font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => (
                    <TextboxCell
                        value={
                            (weekEntriesByDate[dateKey]?.value as string) || ''
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
