import { DayBasedColumn, Day } from './DayBasedColumn';

export class NumberBoxColumn extends DayBasedColumn {
	constructor(emojiIcon: string = 'Star', width: number = 50, nameVisible: boolean = false, description: string = '', id?: string) {
		super('numberbox', emojiIcon, width, nameVisible, description, id);
	}

	static fromJSON(json: Record<string, any>): NumberBoxColumn {
		const instance = new NumberBoxColumn(
			json.emojiIcon,
			json.width,
			json.nameVisible,
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

	setNumber(day: Day, value: number): boolean {
		this.days[day] = value.toString();
		return true;
	}
}
