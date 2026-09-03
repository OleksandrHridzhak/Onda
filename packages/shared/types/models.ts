export interface DbResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Todo {
    id: string;
    text: string;
    done: boolean;
    categoryId?: string;
}

export interface BaseColumn {
    id: string;
    name: string;
    isNameVisible: boolean;
    description: string;
    emojiIconName: string;
    width: number;
    lifecycle: {
        createdAt: string | null;
        archivedAt: string | null;
    };
}

export interface CheckboxColumn extends BaseColumn {
    type: 'checkboxColumn';
    uniqueProps: {
        checkboxColor: string;
    };
}

export interface TextboxColumn extends BaseColumn {
    type: 'textboxColumn';
    uniqueProps: Record<string, never>;
}

export interface NumberBoxColumn extends BaseColumn {
    type: 'numberboxColumn';
    uniqueProps: Record<string, never>;
}

export interface TagsColumn extends BaseColumn {
    type: 'tagsColumn';
    uniqueProps: {
        availableTags: Tag[];
    };
}

export interface TodoListColumn extends BaseColumn {
    type: 'todoListColumn';
    uniqueProps: {
        availableCategories: Tag[];
        todos: Todo[];
    };
}

export interface MultiCheckboxColumn extends BaseColumn {
    type: 'multiCheckBoxColumn';
    uniqueProps: {
        availableOptions: Tag[];
    };
}

export interface TaskTableColumn extends BaseColumn {
    type: 'taskTableColumn';
    uniqueProps: {
        availableTags: Tag[];
        doneTasks: string[];
    };
}

export type Column =
    | CheckboxColumn
    | TextboxColumn
    | NumberBoxColumn
    | TagsColumn
    | TodoListColumn
    | MultiCheckboxColumn
    | TaskTableColumn;

export type ColumnType = Column['type'];

export type ColumnEntryValueType =
    | 'boolean'
    | 'text'
    | 'number'
    | 'tagIds'
    | 'optionIds';

export interface ColumnEntrySnapshot {
    id: string;
    name: string;
    color: string;
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

export interface CalendarEntry {
    id: string;
    title: string;
    color: string;
    date: string;
    startTime: string;
    endTime: string;
    isRepeating?: boolean;
    repeatDays?: number[];
    repeatFrequency?: 'daily' | 'weekly' | 'biweekly' | null;
}

export interface Setting {
    id: 'global';
    layout: {
        columnsOrder: string[];
    };
}
