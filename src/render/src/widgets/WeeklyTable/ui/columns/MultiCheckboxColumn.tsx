import type { MultiCheckboxColumn as MultiCheckboxColumnType } from 'entities/Column';
import { ColumnEntryValueMap } from 'entities/ColumnEntry';
import { MultiCheckboxEntryEditor } from 'features/UpdateColumnEntry';
import { ColumnHeader } from '../ColumnHeader';
import { DayColumnLayout } from './DayColumnLayout';

interface MultiCheckboxColumnProps {
    column: MultiCheckboxColumnType;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
    archivedAt: Date;
}

/**
 * MultiCheckboxColumn component
 * Displays multiple checkbox options that can be selected for each day of the week.
 * Uses Dexie live queries for reactive updates following the same pattern as CheckboxColumn.
 */
export function MultiCheckboxColumn({
    column,
    weekDates,
    weekEntriesByDate,
    archivedAt,
}: MultiCheckboxColumnProps): React.ReactElement {
    return (
        <table className="checkbox-nested-table column-multicheckbox font-poppins">
            <ColumnHeader column={column} archivedAt={archivedAt} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => {
                    return (
                        <MultiCheckboxEntryEditor
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
