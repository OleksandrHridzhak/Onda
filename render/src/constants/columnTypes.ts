/**
 * Global Source of Truth for all column types in Onda.
 * Using 'as const' ensures these strings are treated as literal types.
 */
export const COLUMN_TYPES = {
    CHECKBOX: 'checkboxColumn',
    TEXTBOX: 'textboxColumn',
    NUMBERBOX: 'numberboxColumn',
    TAGS: 'tagsColumn',
    TODO: 'todoListColumn',
    MULTI_CHECKBOX: 'multiCheckBoxColumn',
    TASK_TABLE: 'taskTableColumn',
    FORMULA: 'formulaColumn',
} as const;

/**
 * Manual type definition.
 * Clear, simple, and no TypeScript "magic".
 */
export type ColumnType =
    | 'checkboxColumn'
    | 'textboxColumn'
    | 'numberboxColumn'
    | 'tagsColumn'
    | 'todoListColumn'
    | 'multiCheckBoxColumn'
    | 'taskTableColumn'
    | 'formulaColumn';

/**
 * Column types that have tag/option management capabilities
 */
export const COLUMN_TYPES_WITH_OPTIONS: ColumnType[] = [
    COLUMN_TYPES.TAGS,
    COLUMN_TYPES.TODO,
    COLUMN_TYPES.MULTI_CHECKBOX,
    COLUMN_TYPES.TASK_TABLE,
];

/**
 * Type guard to check if a column has options/tags
 */
export function hasOptionsSupport(columnType: ColumnType): boolean {
    return COLUMN_TYPES_WITH_OPTIONS.includes(columnType);
}
