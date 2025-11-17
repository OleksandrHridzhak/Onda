import { BaseColumn } from './BaseColumn';

export class TaskTableColumn extends BaseColumn {
  tasks: Array<{ id: string; text: string; completed: boolean }>;
  options: string[];
  doneTags: string[];
  tagColors: Record<string, string>;

  constructor(
    emojiIcon: string = 'ListTodo',
    width: number = 150,
    nameVisible: boolean = true,
    name: string = '',
    description: string = '',
    id?: string,
  ) {
    super('tasktable', emojiIcon, width, nameVisible, name, description, id);
    this.tasks = [];
    this.options = ['Task 1', 'Task 2'];
    this.doneTags = [];
    this.tagColors = {
      'Task 1': 'blue',
      'Task 2': 'green',
    };
  }

  /**
   * Adds a task and saves to DB
   */
  async addTask(text: string, color: string = 'blue'): Promise<boolean> {
    if (this.options.includes(text)) return false;
    this.options.push(text);
    this.tagColors[text] = color;
    await this.save();
    return true;
  }

  /**
   * Marks a task as done and saves to DB
   */
  async markAsDone(taskText: string): Promise<boolean> {
    const index = this.options.indexOf(taskText);
    if (index === -1) return false;
    this.options.splice(index, 1);
    this.doneTags.push(taskText);
    await this.save();
    return true;
  }

  /**
   * Marks a task as not done and saves to DB
   */
  async markAsNotDone(taskText: string): Promise<boolean> {
    const index = this.doneTags.indexOf(taskText);
    if (index === -1) return false;
    this.doneTags.splice(index, 1);
    this.options.push(taskText);
    await this.save();
    return true;
  }

  /**
   * Removes a task and saves to DB
   */
  async removeTask(taskText: string): Promise<boolean> {
    const optIndex = this.options.indexOf(taskText);
    const doneIndex = this.doneTags.indexOf(taskText);

    if (optIndex !== -1) {
      this.options.splice(optIndex, 1);
      delete this.tagColors[taskText];
      await this.save();
      return true;
    }
    if (doneIndex !== -1) {
      this.doneTags.splice(doneIndex, 1);
      delete this.tagColors[taskText];
      await this.save();
      return true;
    }
    return false;
  }

  /**
   * Updates options, doneTags, and tagColors together and saves to DB
   */
  async updateOptionsAndTags(
    options: string[],
    tagColors: Record<string, string>,
    doneTags: string[],
  ): Promise<boolean> {
    this.options = options;
    this.tagColors = tagColors;
    this.doneTags = doneTags;
    await this.save();
    return true;
  }

  /**
   * Clears all done tasks (moves them back to options) and saves to DB
   */
  async clearDoneTasks(): Promise<boolean> {
    this.options = [...this.options, ...this.doneTags];
    this.doneTags = [];
    await this.save();
    return true;
  }

  static fromJSON(json: Record<string, any>): TaskTableColumn {
    const instance = new TaskTableColumn(
      json.emojiIcon,
      json.width,
      json.nameVisible,
      json.name,
      json.description,
      json.id,
    );
    instance.tasks = json.tasks || [];
    instance.options = json.options || [];
    instance.doneTags = json.doneTags || [];
    instance.tagColors = json.tagColors || {};
    return instance;
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      tasks: this.tasks,
      options: this.options,
      doneTags: this.doneTags,
      tagColors: this.tagColors,
    };
  }
}
