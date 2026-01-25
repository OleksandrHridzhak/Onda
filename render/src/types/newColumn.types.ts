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
