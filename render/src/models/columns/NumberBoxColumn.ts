import { DayBasedColumn, Day } from './DayBasedColumn';

export class NumberBoxColumn extends DayBasedColumn {
  constructor(
    emojiIcon: string = 'Star',
    width: number = 50,
    nameVisible: boolean = false,
    name: string = '',
    description: string = '',
    id?: string,
  ) {
    super('numberbox', emojiIcon, width, nameVisible, name, description, id);
  }

  /**
   * Sets a number for a specific day and saves to DB
   */
  async setNumber(day: Day, value: number): Promise<boolean> {
    return await this.setDayValue(day, value.toString());
  }

  static fromJSON(json: Record<string, any>): NumberBoxColumn {
    const instance = new NumberBoxColumn(
      json.emojiIcon,
      json.width,
      json.nameVisible,
      json.name,
      json.description,
      json.id,
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
}
