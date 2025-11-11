import { BaseColumn } from './BaseColumn';

export class TaskTableColumn extends BaseColumn {
	tasks: Array<{ id: string; text: string; completed: boolean }>;
	options: string[];
	doneTags: string[];
	tagColors: Record<string, string>;

	constructor(emojiIcon: string = 'ListTodo', width: number = 150, nameVisible: boolean = true, name: string = '', description: string = '', id?: string) {
		super('tasktable', emojiIcon, width, nameVisible, name, description, id);
		this.tasks = [];
		this.options = ['Task 1', 'Task 2'];
		this.doneTags = [];
		this.tagColors = {
			'Task 1': 'blue',
			'Task 2': 'green',
		};
	}

	addTask(text: string, color: string = 'blue'): boolean {
		if (this.options.includes(text)) return false;
		this.options.push(text);
		this.tagColors[text] = color;
		return true;
	}

	markAsDone(taskText: string): boolean {
		const index = this.options.indexOf(taskText);
		if (index === -1) return false;
		this.options.splice(index, 1);
		this.doneTags.push(taskText);
		return true;
	}

	markAsNotDone(taskText: string): boolean {
		const index = this.doneTags.indexOf(taskText);
		if (index === -1) return false;
		this.doneTags.splice(index, 1);
		this.options.push(taskText);
		return true;
	}

	removeTask(taskText: string): boolean {
		const optIndex = this.options.indexOf(taskText);
		const doneIndex = this.doneTags.indexOf(taskText);

		if (optIndex !== -1) {
			this.options.splice(optIndex, 1);
			delete this.tagColors[taskText];
			return true;
		}
		if (doneIndex !== -1) {
			this.doneTags.splice(doneIndex, 1);
			delete this.tagColors[taskText];
			return true;
		}
		return false;
	}

	static fromJSON(json: Record<string, any>): TaskTableColumn {
		const instance = new TaskTableColumn(
			json.emojiIcon,
			json.width,
			json.nameVisible,
			json.name,
			json.description,
			json.id
		);
		instance.tasks = json.tasks || [];
		instance.options = json.options || [];
		instance.doneTags = json.doneTags || [];
		instance.tagColors = json.tagColors || {};
		return instance;
	}

	toJSON(): Record<string, any> {
		return {
			...super.toJSON(),
			tasks: this.tasks,
			options: this.options,
			doneTags: this.doneTags,
			tagColors: this.tagColors,
		};
	}
}
