import { BaseColumn } from './BaseColumn';

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export abstract class DayBasedColumn extends BaseColumn {
	days: Record<Day, string>;

	constructor(type: string, emojiIcon: string, width: number, nameVisible: boolean, description: string = '', id?: string) {
		super(type, emojiIcon, width, nameVisible, description, id);
		this.days = {
			Monday: '',
			Tuesday: '',
			Wednesday: '',
			Thursday: '',
			Friday: '',
			Saturday: '',
			Sunday: '',
		};
	}

	clearDays(): boolean {
		for (const day in this.days) {
			this.days[day as Day] = '';
		}
		return true;
	}

	toJSON(): Record<string, any> {
		return {
			...super.toJSON(),
			days: { ...this.days },
		};
	}
}
