import React from 'react';
import { ColumnHeaderContent } from '../ColumnHeaderContent';
import { ColumnHeader } from '../ColumnHeader';
import { CheckboxCell } from './CheckboxCell';
import { DAYS } from '../../TableLogic';
import { useColumnLogic } from '../useColumnLogic';
import { updateColumnFields } from '../../../../../db/helpers/columns';

interface CheckboxColumnProps {
    columnId: string;
}

export const CheckboxColumn: React.FC<CheckboxColumnProps> = ({ columnId }) => {
    const {
        columnData,
        dispatch,
        handleMoveColumn,
        handleChangeWidth,
        columnMenuLogic,
        columns,
        columnForHeader: baseColumnForHeader,
    } = useColumnLogic({
        columnId,
        clearValue: false,
    });

    const handleCheckboxChange = (day: string, newValue: boolean) => {
        updateColumnFields(columnId, { [`uniqueProps.days.${day}`]: newValue });
    };

    const columnForHeader = {
        ...baseColumnForHeader,
        checkboxColor: columnData?.uniqueProps?.checkboxColor,
    };

    return (
        <table className="checkbox-nested-table column-checkbox font-poppins">
            <thead className="bg-tableHeader">
                <tr>
                    <th className="border-b border-border">
                        <ColumnHeader columnId={columnId} />
                    </th>
                </tr>
            </thead>
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
                                    columnData?.uniqueProps?.days?.[day] ||
                                    false
                                }
                                onChange={(newValue) =>
                                    handleCheckboxChange(day, newValue)
                                }
                                color={
                                    columnData?.uniqueProps?.checkboxColor ||
                                    '#3b82f6'
                                }
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
