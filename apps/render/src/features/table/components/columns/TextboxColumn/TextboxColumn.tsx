import type { TextboxColumn as TextboxColumnType } from '../../../types/columnTypes';
import { ColumnEntryValueMap } from 'features/table/types/entryTypes';
import { TextEntryEditor } from './TextboxCell';
import { ColumnHeader } from '../shared/ColumnHeader';
import { DayColumnLayout } from '../shared/DayColumnLayout';

// TODO : Don't repeat in each column, create a HOC for this pattern
interface TextboxColumnProps {
    column: TextboxColumnType;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
    archivedAt: Date;
}

export function TextboxColumn({
    column,
    weekDates,
    weekEntriesByDate,
    archivedAt,
}: TextboxColumnProps): React.ReactElement {
    return (
        <table className="checkbox-nested-table column-text font-poppins">
            <ColumnHeader column={column} archivedAt={archivedAt} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => (
                    <TextEntryEditor
                        column={column}
                        dateKey={dateKey}
                        entry={weekEntriesByDate[dateKey]}
                    />
                )}
            </DayColumnLayout>
        </table>
    );
}
