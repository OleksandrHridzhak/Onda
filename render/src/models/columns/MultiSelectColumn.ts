import { DayBasedColumn, Day } from './DayBasedColumn';

export class MultiSelectColumn extends DayBasedColumn {
  options: string[];
  tagColors: Record<string, string>;

  constructor(
    emojiIcon: string = 'Star',
    width: number = 90,
    nameVisible: boolean = true,
    name: string = '',
    description: string = '',
    id?: string,
  ) {
    super('multiselect', emojiIcon, width, nameVisible, name, description, id);
    this.options = ['Option 1', 'Option 2'];
    this.tagColors = {
      'Option 1': 'blue',
      'Option 2': 'green',
    };
  }

  setTags(day: Day, tags: string): boolean {
    this.days[day] = tags;
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

  static fromJSON(json: Record<string, any>): MultiSelectColumn {
    const instance = new MultiSelectColumn(
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
