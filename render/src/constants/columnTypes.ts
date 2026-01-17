/**
 * Global Source of Truth for all column types in Onda.
 * Using 'as const' ensures these strings are treated as literal types.
 */
export const COLUMN_TYPES = {
    CHECKBOX: 'checkboxColumn',
    TEXTBOX: 'textboxColumn',
    NUMBERBOX: 'numberBoxColumn',
    TAGS: 'tagsColumn',
    TODO: 'todoListColumn',
    MULTI_CHECKBOX: 'multiCheckBoxColumn',
    TASK_TABLE: 'taskTableColumn',
} as const;

/**
 * Manual type definition.
 * Clear, simple, and no TypeScript "magic".
 */
export type ColumnType =
    | 'checkboxColumn'
    | 'textBoxColumn'
    | 'numberBoxColumn'
    | 'tagsColumn'
    | 'todoListColumn'
    | 'multiCheckBoxColumn'
    | 'taskTableColumn';
