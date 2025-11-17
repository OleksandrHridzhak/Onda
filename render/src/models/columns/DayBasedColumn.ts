import { BaseColumn } from './BaseColumn';

export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export abstract class DayBasedColumn extends BaseColumn {
  days: Record<Day, string>;

  constructor(
    type: string,
    emojiIcon: string,
    width: number,
    nameVisible: boolean,
    name: string = '',
    description: string = '',
    id?: string,
  ) {
    super(type, emojiIcon, width, nameVisible, name, description, id);
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

  /**
   * Sets the value for a specific day and saves to DB
   */
  async setDayValue(day: Day, value: string | boolean): Promise<boolean> {
    const normalizedValue =
      typeof value === 'boolean' ? (value ? 'checked' : '') : value;
    if (this.days[day] === normalizedValue) return false;
    this.days[day] = normalizedValue;
    await this.save();
    return true;
  }

  /**
   * Clears all day values and saves to DB
   */
  async clearDays(): Promise<boolean> {
    for (const day in this.days) {
      this.days[day as Day] = '';
    }
    await this.save();
    return true;
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      days: { ...this.days },
    };
  }
}
