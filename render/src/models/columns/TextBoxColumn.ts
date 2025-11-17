import { DayBasedColumn, Day } from './DayBasedColumn';

export class TextBoxColumn extends DayBasedColumn {
  constructor(
    emojiIcon: string = 'Star',
    width: number = 130,
    nameVisible: boolean = false,
    name: string = '',
    description: string = '',
    id?: string,
  ) {
    super('text', emojiIcon, width, nameVisible, name, description, id);
  }

  /**
   * Sets text for a specific day and saves to DB
   */
  async setText(day: Day, value: string): Promise<boolean> {
    return await this.setDayValue(day, value);
  }

  static fromJSON(json: Record<string, any>): TextBoxColumn {
    const instance = new TextBoxColumn(
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
