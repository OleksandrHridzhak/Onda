import type { TagsColumn } from 'features/columns/types/types';
import { upsertDayEntry } from 'features/table/api/columnEntries';
import type { ColumnEntrySnapshot } from 'features/table/types/entryTypes';
import { TagsCell } from './TagsCell';
import type { EntryEditorProps } from 'features/table/types/updateTypes';

export function TagsEntryEditor({
    column,
    dateKey,
    entry,
}: EntryEditorProps<TagsColumn>): React.ReactElement {
    const selectedTagIds = (entry?.value as string[]) || [];

    const handleChange = (tagIds: string[]): void => {
        const selectedSnapshots: ColumnEntrySnapshot[] = tagIds
            .map((tagId) =>
                column.uniqueProps.availableTags.find(
                    (tag) => tag.id === tagId,
                ),
            )
            .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag))
            .map(({ id, name, color }) => ({ id, name, color }));

        void upsertDayEntry({
            columnId: column.id,
            dayDate: dateKey,
            valueType: 'tagIds',
            value: tagIds,
            meta: { selectedSnapshots },
        });
    };

    return (
        <TagsCell
            selectedTagIds={selectedTagIds}
            onChange={handleChange}
            availableTags={column.uniqueProps.availableTags}
            selectedSnapshots={entry?.meta?.selectedSnapshots || []}
        />
    );
}
