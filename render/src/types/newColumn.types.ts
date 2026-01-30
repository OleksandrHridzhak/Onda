/**
 * WeeklyValues<T>
 * Generic mapping of weekday names to a value of type `T`.
 * Used for storing per-day data (e.g. booleans, strings, numbers, arrays).
 * Example: { Monday: true, Tuesday: false, ... }
 */
export type WeeklyValues<T> = {
    Monday: T;
    Tuesday: T;
    Wednesday: T;
    Thursday: T;
    Friday: T;
    Saturday: T;
    Sunday: T;
};

/**
 * WeeksHistory<T>
 * Map of week IDs (YYYY-MM-DD format) to WeeklyValues
 * Used for storing historical week data
 * Example: { '2024-01-01': { Monday: true, Tuesday: false, ... }, '2024-01-08': { ... } }
 */
export type WeeksHistory<T> = Record<string, WeeklyValues<T>>;

/**
 * BaseColumn
 * Common metadata shared by all column types.
 * - `id`: unique identifier
 * - `name`: display name
 * - `isNameVisible`: whether the name is shown in the UI
 * - `description`: optional longer description/help text
 * - `emojiIconName`: visual icon identifier
 * - `width`: column width in pixels or layout units
 */
export interface BaseColumn {
    id: string;
    name: string;
    isNameVisible: boolean;
    description: string;
    emojiIconName: string;
    width: number;
}

/**
 * CheckBoxColumn
 * Stores boolean values per weekday and a display color for checkboxes.
 */
export interface CheckboxColumn extends BaseColumn {
    type: 'checkboxColumn';
    uniqueProps: {
        days: WeeklyValues<boolean>;
        weeksHistory?: WeeksHistory<boolean>;
        checkboxColor: string;
    };
}

/**
 * TextboxColumn
 * Stores string values for each weekday.
 */
export interface TextboxColumn extends BaseColumn {
    type: 'textboxColumn';
    uniqueProps: {
        days: WeeklyValues<string>;
        weeksHistory?: WeeksHistory<string>;
    };
}

/**
 * NumberBoxColumn
 * Stores numeric values for each weekday.
 */
export interface NumberBoxColumn extends BaseColumn {
    type: 'numberboxColumn';
    uniqueProps: {
        days: WeeklyValues<number>;
        weeksHistory?: WeeksHistory<number>;
    };
}

/**
 * Tags Column Interfaces
 */

/**
 * Tag
 * Simple tag object used by several column types.
 */
export interface Tag {
    id: string;
    name: string;
    color: string;
}
/**
 * TagsColumn
 * Lets users assign one or more `Tag` ids to each weekday.
 * - `availableTags`: tag definitions available for selection
 * - `days`: per-day arrays of tag ids
 */
export interface TagsColumn extends BaseColumn {
    type: 'tagsColumn';
    uniqueProps: {
        availableTags: Tag[];
        days: WeeklyValues<string[]>;
        weeksHistory?: WeeksHistory<string[]>;
    };
}

/**
 * Todo
 * A single todo item for `TodoListColumn`.
 */
export interface Todo {
    id: string;
    text: string;
    done: boolean;
    categoryId?: string;
}

/**
 * TodoListColumn
 * Holds a flat list of todos and optional categories.
 */
export interface TodoListColumn extends BaseColumn {
    type: 'todoListColumn';
    uniqueProps: {
        availableCategories: Tag[];
        todos: Todo[];
    };
}

/**
 * MultiCheckboxColumn
 * Multiple selectable options (stored by id) available per weekday.
 */
export interface MultiCheckboxColumn extends BaseColumn {
    type: 'multiCheckBoxColumn';
    uniqueProps: {
        availableOptions: Tag[];
        days: WeeklyValues<string[]>;
        weeksHistory?: WeeksHistory<string[]>;
    };
}
/**
 * TaskTableColumn
 * Represents a table-like task column with tags and completed-task ids.
 */
export interface TaskTableColumn extends BaseColumn {
    type: 'taskTableColumn';
    uniqueProps: {
        availableTags: Tag[];
        doneTasks: string[];
    };
}

/**
 * Column
 * Union of all concrete column types used in the app.
 * Use this when storing or operating on heterogeneous column arrays.
 *
 * Benefits:
 * - Allows type narrowing based on `type` discriminant
 * - Ensures compile-time safety when accessing `uniqueProps`
 */
export type Column =
    | CheckboxColumn
    | TextboxColumn
    | NumberBoxColumn
    | TagsColumn
    | TodoListColumn
    | MultiCheckboxColumn
    | TaskTableColumn;

/**
 * Helper function to create empty WeeklyValues for a given type
 */
export function createEmptyWeeklyValues<T>(defaultValue: T): WeeklyValues<T> {
    return {
        Monday: defaultValue,
        Tuesday: defaultValue,
        Wednesday: defaultValue,
        Thursday: defaultValue,
        Friday: defaultValue,
        Saturday: defaultValue,
        Sunday: defaultValue,
    };
}
