import type { Column } from 'entities/Column';
import type { ColumnEntry } from 'entities/ColumnEntry';

export interface EntryEditorProps<TColumn extends Column> {
    column: TColumn;
    dateKey: string;
    entry?: ColumnEntry;
}
