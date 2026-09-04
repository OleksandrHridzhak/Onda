import type { TagsColumn as TagsColumnType } from '../../../types/columnTypes';
import { ColumnEntryValueMap } from 'features/table/types/entryTypes';
import { TagsEntryEditor } from './TagsEntryEditor';
import { ColumnHeader } from '../shared/ColumnHeader';
import { DayColumnLayout } from '../shared/DayColumnLayout';

interface TagsColumnProps {
    column: TagsColumnType;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
    archivedAt: Date;
}

/**
 * TagsColumn component
 * Displays tags that can be assigned to each day of the week.
 * Uses Dexie live queries for reactive updates following the same pattern as CheckboxColumn.
 */
export function TagsColumn({
    column,
    weekDates,
    weekEntriesByDate,
    archivedAt,
}: TagsColumnProps): React.ReactElement {
    return (
        <table className="checkbox-nested-table font-poppins">
            <ColumnHeader column={column} archivedAt={archivedAt} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => {
                    return (
                        <TagsEntryEditor
                            column={column}
                            dateKey={dateKey}
                            entry={weekEntriesByDate[dateKey]}
                        />
                    );
                }}
            </DayColumnLayout>
        </table>
    );
}
