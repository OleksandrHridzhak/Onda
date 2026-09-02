import type { CheckboxColumn as CheckboxColumnType } from 'entities/Column';
import { ColumnEntryValueMap } from 'entities/ColumnEntry';
import { CheckboxEntryEditor } from 'features/UpdateColumnEntry';
import { ColumnHeader } from '../ColumnHeader';
import { DayColumnLayout } from './DayColumnLayout';

interface CheckboxColumnProps {
    column: CheckboxColumnType;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
    archivedAt: Date;
}
export function CheckboxColumn({
    column,
    weekDates,
    weekEntriesByDate,
    archivedAt,
}: CheckboxColumnProps): React.ReactElement {
    return (
        <table className="checkbox-nested-table column-checkbox font-poppins">
            <ColumnHeader column={column} archivedAt={archivedAt} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => (
                    <CheckboxEntryEditor
                        column={column}
                        dateKey={dateKey}
                        entry={weekEntriesByDate[dateKey]}
                    />
                )}
            </DayColumnLayout>
        </table>
    );
}
