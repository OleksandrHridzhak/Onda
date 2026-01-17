import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { NotesCell } from './NotesCell';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import { TextBoxColumn } from '../../../../../types/newColumn.types';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { DayColumnLayout } from '../DayColumnLayout';

// TODO : Don't repeat in each column, create a HOC for this pattern
interface NotesColumnProps {
    columnId: string;
}

export const NotesColumn: React.FC<NotesColumnProps> = ({ columnId }) => {
    const { column, isLoading, isError } = useReactiveColumn<TextBoxColumn>(
        columnId,
        'textBoxColumn',
    );

    // TODO: Try to add skeleton loading state later
    if (isLoading) {
        return <div></div>;
    }

    const handleCellChange = (day: string, newValue: string) => {
        updateColumnFields(columnId, {
            [`uniqueProps.days.${day}`]: newValue,
        });
    };

    return (
        <table className="checkbox-nested-table column-text font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout>
                {(day) => (
                    <NotesCell
                        value={column?.uniqueProps?.days?.[day] || ''}
                        onChange={(newValue) => handleCellChange(day, newValue)}
                    />
                )}
            </DayColumnLayout>
        </table>
    );
};
