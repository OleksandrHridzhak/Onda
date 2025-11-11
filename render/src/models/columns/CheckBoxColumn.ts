import { DayBasedColumn, Day } from './DayBasedColumn';

export class CheckBoxColumn extends DayBasedColumn {
	checkboxColor: string;

	constructor(emojiIcon: string = 'Star', width: number = 50, nameVisible: boolean = false, description: string = '', id?: string) {
		super('checkbox', emojiIcon, width, nameVisible, description, id);
		this.checkboxColor = 'green';
	}

	static fromJSON(json: Record<string, any>): CheckBoxColumn {
		const instance = new CheckBoxColumn(
			json.emojiIcon,
			json.width,
			json.nameVisible,
			json.description,
			json.id
		);
		for (const day in instance.days) {
			instance.days[day as Day] = json.days[day];
		}
		instance.checkboxColor = json.checkboxColor;
		return instance;
	}

	checkDay(day: Day): boolean {
		this.days[day] = 'checked';
		return true;
	}

	setCheckboxColor(color: string): boolean {
		this.checkboxColor = color;
		return true;
	}

	toJSON(): Record<string, any> {
		return {
			...super.toJSON(),
			checkboxColor: this.checkboxColor,
		};
	}
}
