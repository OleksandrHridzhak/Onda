import React from 'react';
import { ColumnHeader } from 'features/Table/columns/ColumnHeader';
import { CheckboxCell } from 'features/Table/columns/CheckboxColumn/CheckBoxCell';
import { CheckboxColumn as CheckboxColumnType } from 'shared/types/newColumn.types';
import { ColumnEntryValueMap } from 'shared/types/columnEntries.types';
import { useReactiveColumn } from 'features/Table/hooks/useReactiveColumn';
import { DayColumnLayout } from 'features/Table/columns/DayColumnLayout';
import { upsertDayEntry } from 'db/helpers/columnEntries';

interface CheckboxColumnProps {
    columnId: string;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
}
/**
 * Just a checkbox column.
 */

export const CheckboxColumn: React.FC<CheckboxColumnProps> = ({
    columnId,
    weekDates,
    weekEntriesByDate,
}) => {
    const { column, isLoading } = useReactiveColumn<CheckboxColumnType>(
        columnId,
        'checkboxColumn',
    );

    // TODO: Try to add skeleton loading state later
    if (isLoading) {
        return <div></div>;
    }

    const handleCheckboxChange = (dateKey: string, newValue: boolean) => {
        upsertDayEntry({
            columnId,
            dayDate: dateKey,
            valueType: 'boolean',
            value: newValue,
        });
    };

    return (
        <table className="checkbox-nested-table column-checkbox font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => (
                    <CheckboxCell
                        checked={
                            (weekEntriesByDate[dateKey]?.value as boolean) ||
                            false
                        }
                        onChange={(newValue) =>
                            handleCheckboxChange(dateKey, newValue)
                        }
                        color={column?.uniqueProps?.checkboxColor || 'accent1'}
                    />
                )}
            </DayColumnLayout>
        </table>
    );
};
