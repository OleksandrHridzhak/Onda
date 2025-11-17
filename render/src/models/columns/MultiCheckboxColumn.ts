import { DayBasedColumn, Day } from './DayBasedColumn';

export class MultiCheckboxColumn extends DayBasedColumn {
  options: string[];
  tagColors: Record<string, string>;

  constructor(
    emojiIcon: string = 'Circle',
    width: number = 50,
    nameVisible: boolean = false,
    name: string = '',
    description: string = '',
    id?: string,
  ) {
    super(
      'multicheckbox',
      emojiIcon,
      width,
      nameVisible,
      name,
      description,
      id,
    );
    this.options = ['Task 1', 'Task 2'];
    this.tagColors = {
      'Task 1': 'blue',
      'Task 2': 'green',
    };
  }

  /**
   * Sets checked items for a specific day and saves to DB
   */
  async setChecked(day: Day, checkedItems: string): Promise<boolean> {
    return await this.setDayValue(day, checkedItems);
  }

  /**
   * Adds an option and saves to DB
   */
  async addOption(option: string, color: string = 'blue'): Promise<boolean> {
    if (this.options.includes(option)) return false;
    this.options.push(option);
    this.tagColors[option] = color;
    await this.save();
    return true;
  }

  /**
   * Removes an option and saves to DB
   */
  async removeOption(option: string): Promise<boolean> {
    const index = this.options.indexOf(option);
    if (index === -1) return false;
    this.options.splice(index, 1);
    delete this.tagColors[option];
    await this.save();
    return true;
  }

  /**
   * Updates options and tag colors together and saves to DB
   */
  async updateOptions(
    options: string[],
    tagColors: Record<string, string>,
  ): Promise<boolean> {
    this.options = options;
    this.tagColors = tagColors;
    await this.save();
    return true;
  }

  static fromJSON(json: Record<string, any>): MultiCheckboxColumn {
    const instance = new MultiCheckboxColumn(
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
