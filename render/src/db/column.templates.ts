import { WeeklyValues, Column } from '../types/newColumn.types';
import { COLUMN_TYPES } from '../constants/columnTypes';
/**
 * Utility to generate empty initial values for each day of the week.
 * Ensures consistent data structure across the database.
 */
const createWeeklyValues = <T>(defaultValue: T): WeeklyValues<T> => ({
    Monday: defaultValue,
    Tuesday: defaultValue,
    Wednesday: defaultValue,
    Thursday: defaultValue,
    Friday: defaultValue,
    Saturday: defaultValue,
    Sunday: defaultValue,
});

/**
 * Global dictionary of column templates.
 * 'name' matches the type, but formatted for display (words ending in -Box are joined).
 */
export const COLUMN_TEMPLATES: Record<Column['type'], Omit<Column, 'id'>> = {
    [COLUMN_TYPES.CHECKBOX]: {
        type: COLUMN_TYPES.CHECKBOX,
        name: 'CheckBox',
        isNameVisible: false,
        description: 'Track daily items with simple checkboxes.',
        emojiIconName: 'Star',
        width: 50,
        uniqueProps: {
            days: createWeeklyValues(false),
            checkboxColor: 'green',
        },
    },

    [COLUMN_TYPES.TEXTBOX]: {
        type: COLUMN_TYPES.TEXTBOX,
        name: 'Textbox',
        isNameVisible: true,
        description: 'Store text strings for each day of the week.',
        emojiIconName: 'Star',
        width: 130,
        uniqueProps: {
            days: createWeeklyValues(''),
        },
    },

    [COLUMN_TYPES.NUMBERBOX]: {
        type: COLUMN_TYPES.NUMBERBOX,
        name: 'NumberBox',
        isNameVisible: false,
        description: 'Log numeric values for each weekday.',
        emojiIconName: 'Star',
        width: 60,
        uniqueProps: {
            days: createWeeklyValues(null),
        },
    },

    [COLUMN_TYPES.TAGS]: {
        type: COLUMN_TYPES.TAGS,
        name: 'Tags',
        isNameVisible: true,
        description: 'Assign specific tags to each day.',
        emojiIconName: 'Star',
        width: 120,
        uniqueProps: {
            availableTags: [
                { id: 't1', name: 'Work', color: '#EF4444' },
                { id: 't2', name: 'Personal', color: '#10B981' },
            ],
            days: createWeeklyValues([]),
        },
    },

    [COLUMN_TYPES.TODO]: {
        type: COLUMN_TYPES.TODO,
        name: 'TodoList',
        isNameVisible: true,
        description: 'Manage a list of tasks and categories.',
        emojiIconName: 'ListTodo',
        width: 150,
        uniqueProps: {
            availableCategories: [
                { id: 'c1', name: 'Urgent', color: '#F59E0B' },
            ],
            todos: [],
        },
    },

    [COLUMN_TYPES.MULTI_CHECKBOX]: {
        type: COLUMN_TYPES.MULTI_CHECKBOX,
        name: 'MultiCheckBox',
        isNameVisible: false,
        description: 'Select multiple options per weekday.',
        emojiIconName: 'Circle',
        width: 50,
        uniqueProps: {
            availableOptions: [
                { id: 'o1', name: 'Option 1', color: '#8B5CF6' },
                { id: 'o2', name: 'Option 2', color: '#EC4899' },
            ],
            days: createWeeklyValues([]),
        },
    },

    [COLUMN_TYPES.TASK_TABLE]: {
        type: COLUMN_TYPES.TASK_TABLE,
        name: 'TaskTable',
        isNameVisible: true,
        description: 'Advanced task tracking with completion status.',
        emojiIconName: 'ListTodo',
        width: 150,
        uniqueProps: {
            availableTags: [],
            doneTasks: [],
        },
    },

    [COLUMN_TYPES.GROUP_DIVIDER]: {
        type: COLUMN_TYPES.GROUP_DIVIDER,
        name: 'Group',
        isNameVisible: true,
        description: 'Visual divider to organize columns into groups.',
        emojiIconName: 'FolderOpen',
        width: 150,
        uniqueProps: {
            groupName: 'New Group',
            backgroundColor: '#94A3B8',
        },
    },
};
