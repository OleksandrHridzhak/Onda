import type { MultiCheckboxColumn as MultiCheckboxColumnType } from '../../../types/columnTypes';
import { ColumnEntryValueMap } from 'features/table/types/entryTypes';
import { MultiCheckboxEntryEditor } from './MultiCheckboxEntryEditor';
import { ColumnHeader } from '../shared/ColumnHeader';
import { DayColumnLayout } from '../shared/DayColumnLayout';

interface MultiCheckboxColumnProps {
    column: MultiCheckboxColumnType;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
    archivedAt: Date;
}

/**
 * MultiCheckboxColumn component
 * Displays multiple checkbox options that can be selected for each day of the week.
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
