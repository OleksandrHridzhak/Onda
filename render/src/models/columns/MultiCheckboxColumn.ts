import { DayBasedColumn, Day } from './DayBasedColumn';

export class MultiCheckboxColumn extends DayBasedColumn {
	options: string[];
	tagColors: Record<string, string>;

	constructor(emojiIcon: string = 'Circle', width: number = 50, nameVisible: boolean = false, description: string = '', id?: string) {
		super('multicheckbox', emojiIcon, width, nameVisible, description, id);
		this.options = ['Task 1', 'Task 2'];
		this.tagColors = {
			'Task 1': 'blue',
			'Task 2': 'green',
		};
	}

	setChecked(day: Day, checkedItems: string): boolean {
		this.days[day] = checkedItems;
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

	static fromJSON(json: Record<string, any>): MultiCheckboxColumn {
		const instance = new MultiCheckboxColumn(
			json.emojiIcon,
			json.width,
			json.nameVisible,
			json.description,
			json.id
		);
		for (const day in instance.days) {
			instance.days[day as Day] = json.days[day];
		}
		instance.options = json.options || [];
		instance.tagColors = json.tagColors || {};
		return instance;
	}

	toJSON(): Record<string, any> {
		return {
			...super.toJSON(),
			options: this.options,
			tagColors: this.tagColors,
		};
	}
}
