import React from 'react';
import { Check, Minus } from 'lucide-react';
import { COLUMN_TYPES } from '../../constants/columnTypes';
import type { Column } from '../../types/newColumn.types';
import type { ColumnEntry } from '../../types/columnEntries.types';
import { COLOR_STYLES } from '../../utils/colorOptions';

export interface ColumnStatsCard {
    column: Column;
    entries: ColumnEntry[];
}

export const COLUMN_TYPE_LABELS: Record<Column['type'], string> = {
    [COLUMN_TYPES.CHECKBOX]: 'Checkbox',
    [COLUMN_TYPES.TEXTBOX]: 'Notes',
    [COLUMN_TYPES.NUMBERBOX]: 'Number',
    [COLUMN_TYPES.TAGS]: 'Tags',
    [COLUMN_TYPES.TODO]: 'Todo List',
    [COLUMN_TYPES.MULTI_CHECKBOX]: 'Multi Checkbox',
    [COLUMN_TYPES.TASK_TABLE]: 'Task Table',
};

export function getColumnSummary(column: Column): string {
    switch (column.type) {
        case COLUMN_TYPES.CHECKBOX:
            return 'Boolean checkmarks tracked per day';
        case COLUMN_TYPES.TEXTBOX:
            return 'Text notes saved per day';
        case COLUMN_TYPES.NUMBERBOX:
            return 'Numeric values saved per day';
        case COLUMN_TYPES.TAGS:
            return `${column.uniqueProps.availableTags.length} available tags`;
        case COLUMN_TYPES.MULTI_CHECKBOX:
            return `${column.uniqueProps.availableOptions.length} selectable options`;
        case COLUMN_TYPES.TODO:
            return `${column.uniqueProps.todos.length} todos in this column`;
        case COLUMN_TYPES.TASK_TABLE:
            return `${column.uniqueProps.doneTasks.length} completed tasks stored`;
        default:
            return 'No summary available';
    }
}

export function formatEntryDate(dateKey: string): {
    label: string;
    shortDate: string;
} {
    const date = new Date(`${dateKey}T00:00:00`);
    const labelFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
    });
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return {
        label: labelFormatter.format(date),
        shortDate: dateFormatter.format(date),
    };
}

export function sortEntriesByDateDesc(entries: ColumnEntry[]): ColumnEntry[] {
    return [...entries].sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

export function getEntryDetailText(
    column: Column,
    entry: ColumnEntry | undefined,
): string {
    if (!entry) {
        if (
            column.type === COLUMN_TYPES.TODO ||
            column.type === COLUMN_TYPES.TASK_TABLE
        ) {
            return 'This column stores a running list instead of separate day entries.';
        }

        return 'No saved value for this day.';
    }

    switch (column.type) {
        case COLUMN_TYPES.CHECKBOX:
            return entry.value === true
                ? 'Checked on this day.'
                : 'Not checked.';
        case COLUMN_TYPES.TEXTBOX: {
            const value = String(entry.value || '').trim();
            return value || 'Empty note.';
        }
        case COLUMN_TYPES.NUMBERBOX:
            return `Value: ${String(entry.value)}`;
        case COLUMN_TYPES.TAGS:
        case COLUMN_TYPES.MULTI_CHECKBOX: {
            const snapshots = entry.meta?.selectedSnapshots || [];
            if (snapshots.length > 0) {
                return snapshots.map((item) => item.name).join(', ');
            }
            const count = Array.isArray(entry.value) ? entry.value.length : 0;
            return `${count} items selected`;
        }
        default:
            return 'No detailed preview available.';
    }
}

export function getTrackedDaysCount(
    column: Column,
    entries: ColumnEntry[],
): number {
    if (
        column.type === COLUMN_TYPES.TODO ||
        column.type === COLUMN_TYPES.TASK_TABLE
    ) {
        return 0;
    }

    return entries.length;
}

export function getPrimaryMetric(
    column: Column,
    entries: ColumnEntry[],
): { label: string; value: string } {
    switch (column.type) {
        case COLUMN_TYPES.CHECKBOX: {
            const checkedDays = entries.filter(
                (entry) => entry.value === true,
            ).length;
            return {
                label: 'Checked Days',
                value: `${checkedDays}/${entries.length || 0}`,
            };
        }
        case COLUMN_TYPES.TEXTBOX:
            return {
                label: 'Days With Notes',
                value: String(getTrackedDaysCount(column, entries)),
            };
        case COLUMN_TYPES.NUMBERBOX: {
            const numbers = entries
                .map((entry) => entry.value)
                .filter((value) => typeof value === 'number') as number[];
            if (numbers.length === 0) {
                return { label: 'Average', value: '-' };
            }
            const average =
                numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
            return { label: 'Average', value: average.toFixed(1) };
        }
        case COLUMN_TYPES.TAGS:
            return {
                label: 'Available Tags',
                value: String(column.uniqueProps.availableTags.length),
            };
        case COLUMN_TYPES.MULTI_CHECKBOX:
            return {
                label: 'Available Options',
                value: String(column.uniqueProps.availableOptions.length),
            };
        case COLUMN_TYPES.TODO:
            return {
                label: 'Todos',
                value: String(column.uniqueProps.todos.length),
            };
        case COLUMN_TYPES.TASK_TABLE:
            return {
                label: 'Done Tasks',
                value: String(column.uniqueProps.doneTasks.length),
            };
        default:
            return { label: 'Metric', value: '-' };
    }
}

export function getLatestEntryDate(entries: ColumnEntry[]): string {
    if (entries.length === 0) {
        return 'No activity yet';
    }

    return formatEntryDate(sortEntriesByDateDesc(entries)[0].dateKey).shortDate;
}

export function renderEntryPreview(
    column: Column,
    entry: ColumnEntry | undefined,
): React.ReactElement {
    if (column.type === COLUMN_TYPES.CHECKBOX) {
        const color = COLOR_STYLES[column.uniqueProps.checkboxColor];
        const isChecked = entry?.value === true;

        return (
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                    isChecked
                        ? `${color.solid} ${color.text} border-transparent`
                        : 'border-border bg-background text-textSubtle'
                }`}
            >
                {isChecked ? <Check size={16} /> : <Minus size={16} />}
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-xs text-textSubtle">
                -
            </div>
        );
    }

    switch (column.type) {
        case COLUMN_TYPES.TEXTBOX: {
            const value = String(entry.value || '').trim();
            return (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surfaceMuted px-1 text-[10px] font-medium text-text">
                    {value ? value.slice(0, 2).toUpperCase() : '-'}
                </div>
            );
        }
        case COLUMN_TYPES.NUMBERBOX: {
            const value = entry.value;
            return (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surfaceMuted px-1 text-xs font-medium text-text">
                    {typeof value === 'number' || typeof value === 'string'
                        ? String(value)
                        : '-'}
                </div>
            );
        }
        case COLUMN_TYPES.TAGS:
        case COLUMN_TYPES.MULTI_CHECKBOX: {
            const count = Array.isArray(entry.value) ? entry.value.length : 0;
            return (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surfaceMuted text-xs font-medium text-text">
                    {count}
                </div>
            );
        }
        default:
            return (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-xs text-textSubtle">
                    -
                </div>
            );
    }
}
