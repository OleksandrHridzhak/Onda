import type {
    CheckboxColumn,
    TextboxColumn,
    NumberBoxColumn,
    TagsColumn,
    TodoListColumn,
    MultiCheckboxColumn,
    TaskTableColumn,
    Column,
} from './types';
import type { ColorName } from 'shared/lib/color';

type ColumnDefinition<TColumn extends Column> = {
    template: Omit<TColumn, 'id' | 'lifecycle'>;
    supportsOptions: boolean;
    creation: {
        label: string;
        description: string;
        iconName: string;
        accent: ColorName;
    };
};

export const COLUMN_DEFINITIONS = {
    CHECKBOX: {
        template: {
            type: 'checkboxColumn',
            name: 'CheckBox',
            isNameVisible: false,
            description: 'Track daily items with simple checkboxes.',
            emojiIconName: 'Star',
            width: 50,
            uniqueProps: {
                checkboxColor: 'accent1',
            },
        },
        supportsOptions: false,
        creation: {
            label: 'Checkbox',
            description: 'Simple on/off checkbox for marking items done.',
            iconName: 'CheckSquare',
            accent: 'accent2',
        },
    } satisfies ColumnDefinition<CheckboxColumn>,
    TEXTBOX: {
        template: {
            type: 'textboxColumn',
            name: 'Textbox',
            isNameVisible: true,
            description: 'Store text strings for each day of the week.',
            emojiIconName: 'Star',
            width: 130,
            uniqueProps: {},
        },
        supportsOptions: false,
        creation: {
            label: 'Notes',
            description: 'Free-form text field for notes and descriptions.',
            iconName: 'Type',
            accent: 'accent4',
        },
    } satisfies ColumnDefinition<TextboxColumn>,
    NUMBERBOX: {
        template: {
            type: 'numberboxColumn',
            name: 'NumberBox',
            isNameVisible: false,
            description: 'Log numeric values for each weekday.',
            emojiIconName: 'Star',
            width: 60,
            uniqueProps: {},
        },
        supportsOptions: false,
        creation: {
            label: 'Number',
            description: 'Numeric input for counts, scores or measurements.',
            iconName: 'Hash',
            accent: 'accent1',
        },
    } satisfies ColumnDefinition<NumberBoxColumn>,
    TAGS: {
        template: {
            type: 'tagsColumn',
            name: 'Tags',
            isNameVisible: true,
            description: 'Assign specific tags to each day.',
            emojiIconName: 'Star',
            width: 120,
            uniqueProps: {
                availableTags: [
                    { id: 't1', name: 'Work', color: 'accent6' },
                    { id: 't2', name: 'Personal', color: 'accent1' },
                ],
            },
        },
        supportsOptions: true,
        creation: {
            label: 'Tags',
            description: 'Tag-based multi-select for categorizing items.',
            iconName: 'Tag',
            accent: 'accent3',
        },
    } satisfies ColumnDefinition<TagsColumn>,
    TODO: {
        template: {
            type: 'todoListColumn',
            name: 'TodoList',
            isNameVisible: true,
            description: 'Manage a list of tasks and categories.',
            emojiIconName: 'ListTodo',
            width: 150,
            uniqueProps: {
                availableCategories: [
                    { id: 'c1', name: 'Urgent', color: 'accent4' },
                ],
                todos: [],
            },
        },
        supportsOptions: true,
        creation: {
            label: 'Todo List',
            description:
                'Checklist-style column for tasks with categories and quick add.',
            iconName: 'ListTodo',
            accent: 'accent6',
        },
    } satisfies ColumnDefinition<TodoListColumn>,
    MULTI_CHECKBOX: {
        template: {
            type: 'multiCheckBoxColumn',
            name: 'MultiCheckBox',
            isNameVisible: false,
            description: 'Select multiple options per weekday.',
            emojiIconName: 'Circle',
            width: 50,
            uniqueProps: {
                availableOptions: [
                    { id: 'o1', name: 'Option 1', color: 'accent3' },
                    { id: 'o2', name: 'Option 2', color: 'accent7' },
                ],
            },
        },
        supportsOptions: true,
        creation: {
            label: 'Multi Checkbox',
            description: 'Multiple checkbox options for subtasks or choices.',
            iconName: 'Circle',
            accent: 'accent8',
        },
    } satisfies ColumnDefinition<MultiCheckboxColumn>,
    TASK_TABLE: {
        template: {
            type: 'taskTableColumn',
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
        supportsOptions: true,
        creation: {
            label: 'Task Table',
            description: 'Nested task table for managing tasks inside a row.',
            iconName: 'Table',
            accent: 'accent9',
        },
    } satisfies ColumnDefinition<TaskTableColumn>,
} as const;

export type ColumnType =
    (typeof COLUMN_DEFINITIONS)[keyof typeof COLUMN_DEFINITIONS]['template']['type'];

export function hasOptionsSupport(columnType: ColumnType): boolean {
    const columnDef = Object.values(COLUMN_DEFINITIONS).find(
        ({ template }) => template.type === columnType,
    );
    return columnDef ? columnDef.supportsOptions : false;
}

export const COLUMN_TYPES = {
    CHECKBOX: COLUMN_DEFINITIONS.CHECKBOX.template.type,
    TEXTBOX: COLUMN_DEFINITIONS.TEXTBOX.template.type,
    NUMBERBOX: COLUMN_DEFINITIONS.NUMBERBOX.template.type,
    TAGS: COLUMN_DEFINITIONS.TAGS.template.type,
    TODO: COLUMN_DEFINITIONS.TODO.template.type,
    MULTI_CHECKBOX: COLUMN_DEFINITIONS.MULTI_CHECKBOX.template.type,
    TASK_TABLE: COLUMN_DEFINITIONS.TASK_TABLE.template.type,
} as const;
