import type { NumberBoxColumn } from 'features/columns/types/types';
import { ColumnEntryValueMap } from 'features/table/types/entryTypes';
import { NumberEntryEditor } from '../cells/NumberboxColumn/NumberboxCell';
import { ColumnHeader } from '../ColumnHeader';
import { DayColumnLayout } from './DayColumnLayout';

interface NumberboxColumnProps {
    column: NumberBoxColumn;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
    archivedAt: Date;
}

export function NumberboxColumn({
    column,
    weekDates,
    weekEntriesByDate,
    archivedAt,
}: NumberboxColumnProps): React.ReactElement {
    return (
        <table className="checkbox-nested-table column-numberbox font-poppins">
            <ColumnHeader column={column} archivedAt={archivedAt} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => (
                    <NumberEntryEditor
                        column={column}
                        dateKey={dateKey}
                        entry={weekEntriesByDate[dateKey]}
                    />
                )}
            </DayColumnLayout>
        </table>
    );
}
