import type { Column } from './columnTypes';
import type { ColumnEntry } from 'features/table/types/entryTypes';

export interface EntryEditorProps<TColumn extends Column> {
    column: TColumn;
    dateKey: string;
    entry?: ColumnEntry;
}
