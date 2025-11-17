import { BaseColumn } from './BaseColumn';

export class TodoColumn extends BaseColumn {
  tasks: Array<{ text: string; completed: boolean; category?: string }>;
  options: string[];
  tagColors: Record<string, string>;

  constructor(
    emojiIcon: string = 'ListTodo',
    width: number = 150,
    nameVisible: boolean = true,
    name: string = '',
    description: string = '',
    id?: string,
  ) {
    super('todo', emojiIcon, width, nameVisible, name, description, id);
    this.tasks = [];
    this.options = ['Option 1', 'Option 2'];
    this.tagColors = {
      'Option 1': 'blue',
      'Option 2': 'green',
    };
  }

  /**
   * Adds a task and saves to DB
   */
  async addTask(text: string, category?: string): Promise<boolean> {
    this.tasks.push({ text, completed: false, category: category || '' });
    await this.save();
    return true;
  }

  /**
   * Updates an entire task array and saves to DB
   */
  async updateTasks(
    tasks: Array<{ text: string; completed: boolean; category?: string }>,
  ): Promise<boolean> {
    this.tasks = tasks;
    await this.save();
    return true;
  }

  /**
   * Removes completed tasks and saves to DB
   */
  async removeCompletedTasks(): Promise<boolean> {
    this.tasks = this.tasks.filter((task) => !task.completed);
    await this.save();
    return true;
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

  static fromJSON(json: Record<string, any>): TodoColumn {
    const instance = new TodoColumn(
      json.emojiIcon,
      json.width,
      json.nameVisible,
      json.name,
      json.description,
      json.id,
    );
    instance.tasks = json.tasks || [];
    instance.options = json.options || [];
    instance.tagColors = json.tagColors || {};
    return instance;
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      tasks: this.tasks,
      options: this.options,
      tagColors: this.tagColors,
    };
  }
}
