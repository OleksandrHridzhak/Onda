// Table.constants.ts

import {
    DaysColumn,
    CheckboxColumn,
    TagsColumn,
    NumberColumn,
    TextboxColumn,
    MultiCheckboxColumn,
    TodoColumn,
    TaskTableColumn,
    FillerColumn,
} from './columns';

export const componentsMap: Record<string, React.FC<any>> = {
    days: DaysColumn,
    checkboxColumn: CheckboxColumn,
    numberBoxColumn: NumberColumn,
    tagsColumn: TagsColumn,
    textboxColumn: TextboxColumn,
    multiCheckBoxColumn: MultiCheckboxColumn,
    todoListColumn: TodoColumn,
    taskTableColumn: TaskTableColumn,
    fillerColumn: FillerColumn,
};
export const daysColumn = {
    id: 'days',
    name: 'Days',
    type: 'days',
    width: 135,
};
export const fillerColumn = {
    id: 'filler',
    name: 'Filler',
    type: 'filler',
    width: undefined,
};
