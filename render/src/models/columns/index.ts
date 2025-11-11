import { BaseColumn } from './BaseColumn';
import { DayBasedColumn } from './DayBasedColumn';
import type { Day } from './DayBasedColumn';
import { CheckBoxColumn } from './CheckBoxColumn';
import { NumberBoxColumn } from './NumberBoxColumn';
import { TextBoxColumn } from './TextBoxColumn';
import { TodoColumn } from './TodoColumn';
import { MultiSelectColumn } from './MultiSelectColumn';
import { MultiCheckboxColumn } from './MultiCheckboxColumn';
import { TaskTableColumn } from './TaskTableColumn';

export { BaseColumn };
export { DayBasedColumn };
export type { Day };
export { CheckBoxColumn };
export { NumberBoxColumn };
export { TextBoxColumn };
export { TodoColumn };
export { MultiSelectColumn };
export { MultiCheckboxColumn };
export { TaskTableColumn };

export function ColumnFactory(json: Record<string, any>): BaseColumn {
	const type = json.type;

	switch (type) {
		case 'checkbox':
			return CheckBoxColumn.fromJSON(json);
		case 'numberbox':
		case 'numberBox':
			return NumberBoxColumn.fromJSON(json);
		case 'text':
		case 'textBox':
			return TextBoxColumn.fromJSON(json);
		case 'todo':
			return TodoColumn.fromJSON(json);
		case 'multi-select':
			return MultiSelectColumn.fromJSON(json);
		case 'multicheckbox':
			return MultiCheckboxColumn.fromJSON(json);
		case 'tasktable':
			return TaskTableColumn.fromJSON(json);
		default:
			throw new Error(`Unknown column type: ${type}`);
	}
}

export function createColumn(type: string): BaseColumn {
	switch (type) {
		case 'checkbox':
			return new CheckBoxColumn();
		case 'numberbox':
			return new NumberBoxColumn();
		case 'text':
			return new TextBoxColumn();
		case 'todo':
			return new TodoColumn();
		case 'multi-select':
			return new MultiSelectColumn();
		case 'multicheckbox':
			return new MultiCheckboxColumn();
		case 'tasktable':
			return new TaskTableColumn();
		default:
			throw new Error(`Unknown column type: ${type}`);
	}
}
