import type { Column } from '../model/types';
import { getWeekStartKey } from 'shared/lib/date';

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
