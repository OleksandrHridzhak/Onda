import { BaseColumn } from './BaseColumn';

export class TodoColumn extends BaseColumn {
	tasks: Array<{ text: string; completed: boolean; category?: string }>;
	options: string[];
	tagColors: Record<string, string>;

	constructor(emojiIcon: string = 'ListTodo', width: number = 150, nameVisible: boolean = true, description: string = '', id?: string) {
		super('todo', emojiIcon, width, nameVisible, description, id);
		this.tasks = [];
		this.options = ['Option 1', 'Option 2'];
		this.tagColors = {
			'Option 1': 'blue',
			'Option 2': 'green',
		};
	}

	addTask(text: string, category?: string): boolean {
		this.tasks.push({ text, completed: false, category: category || '' });
		return true;
	}

	addOption(option: string, color: string = 'blue'): boolean {
		if (this.options.includes(option)) return false;
		this.options.push(option);
		this.tagColors[option] = color;
		return true;
	}

	removeOption(option: string): boolean {
		const index = this.options.indexOf(option);
		if (index === -1) return false;
		this.options.splice(index, 1);
		delete this.tagColors[option];
		return true;
	}

	static fromJSON(json: Record<string, any>): TodoColumn {
		const instance = new TodoColumn(
			json.emojiIcon,
			json.width,
			json.nameVisible,
			json.description,
			json.id
		);
		instance.tasks = json.tasks || [];
		instance.options = json.options || [];
		instance.tagColors = json.tagColors || {};
		return instance;
	}

	toJSON(): Record<string, any> {
		return {
			...super.toJSON(),
			tasks: this.tasks,
			options: this.options,
			tagColors: this.tagColors,
		};
	}
}
