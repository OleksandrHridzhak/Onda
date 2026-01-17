import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { CheckboxCell } from './CheckBoxCell';
import { DAYS } from '../../TableLogic';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import { CheckBoxColumn } from '../../../../../types/newColumn.types';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';

interface CheckboxColumnProps {
    columnId: string;
}

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

            <tbody className="bg-tableBodyBg">
                {DAYS.map((day, idx) => (
                    <tr
                        key={day}
                        className={
                            idx !== DAYS.length - 1
                                ? 'border-b border-border'
                                : ''
                        }
                    >
                        <td>
                            <CheckboxCell
                                checked={
                                    column?.uniqueProps?.days?.[day] || false
                                }
                                onChange={(newValue) =>
                                    handleCheckboxChange(day, newValue)
                                }
                                color={
                                    column?.uniqueProps?.checkboxColor ||
                                    'green'
                                }
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
