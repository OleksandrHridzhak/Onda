import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { CheckboxCell } from './CheckBoxCell';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import { CheckBoxColumn } from '../../../../../types/newColumn.types';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { DayColumnLayout } from '../DayColumnLayout';

interface CheckboxColumnProps {
    columnId: string;
}
/**
 * Just a checkbox column.
 */

export const CheckboxColumn: React.FC<CheckboxColumnProps> = ({ columnId }) => {
    const { column, isLoading, isError } = useReactiveColumn<CheckBoxColumn>(
        columnId,
        'checkBoxColumn',
    );

    // TODO: Try to add skeleton loading state later
    if (isLoading) {
        return <div></div>;
    }

    const handleCheckboxChange = (day: string, newValue: boolean) => {
        updateColumnFields(columnId, { [`uniqueProps.days.${day}`]: newValue });
    };

    return (
        <table className="checkbox-nested-table column-checkbox font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout>
                {(day) => (
                    <CheckboxCell
                        checked={column?.uniqueProps?.days?.[day] || false}
                        onChange={(newValue) =>
                            handleCheckboxChange(day, newValue)
                        }
                        color={column?.uniqueProps?.checkboxColor || 'green'}
                    />
                )}
            </DayColumnLayout>
        </table>
    );
};
