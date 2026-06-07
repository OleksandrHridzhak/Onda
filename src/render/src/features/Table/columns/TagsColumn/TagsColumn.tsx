import React from 'react';
import { ColumnHeader } from 'features/Table/columns/ColumnHeader';
import { TagsCell } from 'features/Table/columns/TagsColumn/TagsCell';
import { DayColumnLayout } from 'features/Table/columns/DayColumnLayout';
import { useReactiveColumn } from 'features/Table/hooks/useReactiveColumn';
import { TagsColumn as TagsColumnType } from 'app/types/newColumn.types';
import {
    ColumnEntrySnapshot,
    ColumnEntryValueMap,
} from 'app/types/columnEntries.types';
import { upsertDayEntry } from 'db/helpers/columnEntries';

interface TagsColumnProps {
    columnId: string;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
}

/**
 * TagsColumn component
 * Displays tags that can be assigned to each day of the week.
 * Uses Dexie live queries for reactive updates following the same pattern as CheckboxColumn.
 */
export const TagsColumn: React.FC<TagsColumnProps> = ({
    columnId,
    weekDates,
    weekEntriesByDate,
}) => {
    const { column, isLoading, isError } = useReactiveColumn<TagsColumnType>(
        columnId,
        'tagsColumn',
    );

    // TODO: Add proper skeleton/error UI later
    if (isLoading) {
        return <div></div>;
    }

    if (isError || !column) {
        return null;
    }

    const handleCellChange = (dateKey: string, newTagIds: string[]) => {
        const selectedSnapshots: ColumnEntrySnapshot[] = newTagIds
            .map((tagId) =>
                column.uniqueProps.availableTags.find(
                    (tag) => tag.id === tagId,
                ),
            )
            .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag))
            .map((tag) => ({
                id: tag.id,
                name: tag.name,
                color: tag.color,
            }));

        upsertDayEntry({
            columnId,
            dayDate: dateKey,
            valueType: 'tagIds',
            value: newTagIds,
            meta: { selectedSnapshots },
        });
    };

    return (
        <table className="checkbox-nested-table font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => {
                    const entry = weekEntriesByDate[dateKey];
                    const tagIdsForDay = (entry?.value as string[]) || [];

                    return (
                        <TagsCell
                            selectedTagIds={tagIdsForDay}
                            onChange={(newTagIds) =>
                                handleCellChange(dateKey, newTagIds)
                            }
                            availableTags={column.uniqueProps.availableTags}
                            selectedSnapshots={
                                entry?.meta?.selectedSnapshots || []
                            }
                        />
                    );
                }}
            </DayColumnLayout>
        </table>
    );
};
