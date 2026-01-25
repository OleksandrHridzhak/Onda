import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { NumberboxCell } from './NumberboxCell';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import { NumberBoxColumn as NumberBoxColumnType } from '../../../../../types/newColumn.types';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { DayColumnLayout } from '../DayColumnLayout';

interface NumberboxColumnProps {
    columnId: string;
}

export const NumberboxColumn: React.FC<NumberboxColumnProps> = ({
    columnId,
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

    const handleCellChange = (day: string, newValue: string) => {
        const numericValue = newValue === '' ? null : Number(newValue);
        if (Number.isNaN(numericValue)) {
            return;
        }

        updateColumnFields(columnId, {
            [`uniqueProps.days.${day}`]: numericValue,
        });
    };

    return (
        <table className="checkbox-nested-table column-numberbox font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout>
                {(day) => (
                    <NumberboxCell
                        value={column.uniqueProps.days[day] ?? null}
                        onChange={(newValue) => handleCellChange(day, newValue)}
                    />
                )}
            </DayColumnLayout>
        </table>
    );
};
