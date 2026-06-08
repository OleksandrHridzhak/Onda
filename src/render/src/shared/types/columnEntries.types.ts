import type { ColorName } from 'shared/utils/colorOptions';

export type ColumnEntryValueType =
    | 'boolean'
    | 'text'
    | 'number'
    | 'tagIds'
    | 'optionIds';

export interface ColumnEntrySnapshot {
    id: string;
    name: string;
    color: ColorName;
}

export interface ColumnEntryMeta {
    selectedSnapshots?: ColumnEntrySnapshot[];
}

export interface ColumnEntry {
    id: string;
    columnId: string;
    scope: 'day';
    dateKey: string;
    dayDate: string;
    weekStart: string;
    valueType: ColumnEntryValueType;
    value: unknown;
    meta?: ColumnEntryMeta;
    createdAt: string;
    updatedAt: string;
}

export type ColumnEntryValueMap = Record<string, ColumnEntry>;
