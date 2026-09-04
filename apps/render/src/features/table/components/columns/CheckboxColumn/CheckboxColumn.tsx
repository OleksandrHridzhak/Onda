import type { CheckboxColumn as CheckboxColumnType } from '../../../types/columnTypes';
import { ColumnEntryValueMap } from 'features/table/types/entryTypes';
import { CheckboxEntryEditor } from './CheckBoxCell';
import { ColumnHeader } from '../shared/ColumnHeader';
import { DayColumnLayout } from '../shared/DayColumnLayout';

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
