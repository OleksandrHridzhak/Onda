import type { Column } from 'app/types/newColumn.types';
import { getWeekStartKey } from 'app/utils/date';

export const isColumnArchived = (column: Column): boolean =>
    Boolean(column.lifecycle?.archivedAt);

export const isColumnVisibleForWeek = (
    column: Column,
    weekStartKey: string,
): boolean => {
    const createdWeek = column.lifecycle?.createdAt
        ? getWeekStartKey(new Date(column.lifecycle.createdAt))
        : null;
    const archivedWeek = column.lifecycle?.archivedAt
        ? getWeekStartKey(new Date(column.lifecycle.archivedAt))
        : null;

    return (
        (!createdWeek || createdWeek <= weekStartKey) &&
        (!archivedWeek || weekStartKey <= archivedWeek)
    );
};
