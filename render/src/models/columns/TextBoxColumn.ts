import { DayBasedColumn, Day } from './DayBasedColumn';

export class TextBoxColumn extends DayBasedColumn {
	constructor(emojiIcon: string = 'Star', width: number = 130, nameVisible: boolean = false, name: string = '', description: string = '', id?: string) {
		super('text', emojiIcon, width, nameVisible, name, description, id);
	}

	static fromJSON(json: Record<string, any>): TextBoxColumn {
		const instance = new TextBoxColumn(
			json.emojiIcon,
			json.width,
			json.nameVisible,
			json.name,
			json.description,
			json.id
		);
		for (const day in instance.days) {
			instance.days[day as Day] = json.days[day];
		}
		return instance;
	}

	toJSON(): Record<string, any> {
		return {
			...super.toJSON(),
		};
	}

	setText(day: Day, value: string): boolean {
		this.days[day] = value;
		return true;
	}
}
