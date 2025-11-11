abstract class BaseColumn {
  id: string;
  type: string;
  emojiIcon: string;
  width: number;
  nameVisible: boolean;
  description: string;

  constructor(
    type: string,
    emojiIcon: string,
    width: number,
    nameVisible: boolean,
    description: string = '',
    id?: string
  ) {
    this.id =
      id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.type = type;
    this.emojiIcon = emojiIcon;
    this.width = width;
    this.nameVisible = nameVisible;
    this.description = description;
  }

  setEmojiIcon(icon: string): boolean {
    if (icon === this.emojiIcon) return false;
    this.emojiIcon = icon;
    return true;
  }

  setWidth(width: number): boolean {
    if (width <= 0 || width === this.width) return false;
    this.width = width;
    return true;
  }

  setNameVisible(visible: boolean): boolean {
    if (visible === this.nameVisible) return false;
    this.nameVisible = visible;
    return true;
  }

  setDescription(desc: string): boolean {
    if (desc === this.description) return false;
    this.description = desc;
    return true;
  }

  update(
    params: Partial<
      Pick<BaseColumn, 'emojiIcon' | 'width' | 'nameVisible' | 'description'>
    >
  ): boolean {
    let changed = false;

    if (params.emojiIcon !== undefined && params.emojiIcon !== this.emojiIcon) {
      this.emojiIcon = params.emojiIcon;
      changed = true;
    }
    if (
      params.width !== undefined &&
      params.width > 0 &&
      params.width !== this.width
    ) {
      this.width = params.width;
      changed = true;
    }
    if (
      params.nameVisible !== undefined &&
      params.nameVisible !== this.nameVisible
    ) {
      this.nameVisible = params.nameVisible;
      changed = true;
    }
    if (
      params.description !== undefined &&
      params.description !== this.description
    ) {
      this.description = params.description;
      changed = true;
    }

    return changed;
  }
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      type: this.type,
      emojiIcon: this.emojiIcon,
      nameVisible: this.nameVisible,
      description: this.description,
      width: this.width,
    };
  }
}
type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

abstract class DayBasedColumn extends BaseColumn {
  days: Record<Day, string>;

  clearDays(): boolean {
    for (const day in this.days) {
      this.days[day as Day] = '';
    }
    return true;
  }

  constructor(
    type: string,
    emojiIcon: string,
    width: number,
    nameVisible: boolean,
    description: string = '',
    id?: string
  ) {
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

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      days: { ...this.days },
    };
  }
}

class CheckBoxColumn extends DayBasedColumn {
  static fromJSON(json: Record<string, any>): CheckBoxColumn {
    const instance = new CheckBoxColumn(
      json.emojiIcon,
      json.width,
      json.nameVisible,
      json.description,
      json.id
    );
    for (const day in instance.days) {
      instance.days[day as Day] = json.days[day];
    }
    instance.checkboxColor = json.checkboxColor;
    return instance;
  }
  checkboxColor: string;

  constructor(
    emojiIcon: string = 'Star',
    width: number = 50,
    nameVisible: boolean = false,
    description: string = '',
    id?: string
  ) {
    super('checkbox', emojiIcon, width, nameVisible, description, id);
    this.checkboxColor = 'green';
  }
  checkDay(day: Day): boolean {
    this.days[day] = 'checked';
    return true;
  }
  setCheckboxColor(color: string): boolean {
    this.checkboxColor = color;
    return true;
  }
  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      checkboxColor: this.checkboxColor,
    };
  }
}
class NumberBoxColumn extends DayBasedColumn {
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

  constructor(
    emojiIcon: string = 'Star',
    width: number = 50,
    nameVisible: boolean = false,
    description: string = '',
    id?: string
  ) {
    super('numberbox', emojiIcon, width, nameVisible, description, id);
  }
  setNumber(day: Day, value: number): boolean {
    this.days[day] = value.toString();
    return true;
  }
}
class TextBoxColumn extends DayBasedColumn {
  static fromJSON(json: Record<string, any>): TextBoxColumn {
    const instance = new TextBoxColumn(
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

  constructor(
    emojiIcon: string = 'Star',
    width: number = 130,
    nameVisible: boolean = false,
    description: string = '',
    id?: string
  ) {
    super('text', emojiIcon, width, nameVisible, description, id);
  }
  setText(day: Day, value: string): boolean {
    this.days[day] = value;
    return true;
  }
}

// TodoColumn - глобальний список задач
class TodoColumn extends BaseColumn {
  tasks: Array<{ text: string; completed: boolean; category?: string }>;
  options: string[];
  tagColors: Record<string, string>;

  constructor(
    emojiIcon: string = 'ListTodo',
    width: number = 150,
    nameVisible: boolean = true,
    description: string = '',
    id?: string
  ) {
    super('todo', emojiIcon, width, nameVisible, description, id);
    this.tasks = [];
    this.options = ['Option 1', 'Option 2'];
    this.tagColors = {
      'Option 1': 'blue',
      'Option 2': 'green',
    };
  }

  addTask(text: string, category?: string): boolean {
    this.tasks.push({ text, completed: false, category: category || '' });
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

  static fromJSON(json: Record<string, any>): TodoColumn {
    const instance = new TodoColumn(
      json.emojiIcon,
      json.width,
      json.nameVisible,
      json.description,
      json.id
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

// MultiSelectColumn - мультивибір тегів по днях
class MultiSelectColumn extends DayBasedColumn {
  options: string[];
  tagColors: Record<string, string>;

  constructor(
    emojiIcon: string = 'Star',
    width: number = 90,
    nameVisible: boolean = true,
    description: string = '',
    id?: string
  ) {
    super('multi-select', emojiIcon, width, nameVisible, description, id);
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
      json.description,
      json.id
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

// MultiCheckboxColumn - чекбокси з множинним вибором по днях
class MultiCheckboxColumn extends DayBasedColumn {
  options: string[];
  tagColors: Record<string, string>;

  constructor(
    emojiIcon: string = 'Circle',
    width: number = 50,
    nameVisible: boolean = false,
    description: string = '',
    id?: string
  ) {
    super('multicheckbox', emojiIcon, width, nameVisible, description, id);
    this.options = ['Task 1', 'Task 2'];
    this.tagColors = {
      'Task 1': 'blue',
      'Task 2': 'green',
    };
  }

  setChecked(day: Day, checkedItems: string): boolean {
    this.days[day] = checkedItems;
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

  static fromJSON(json: Record<string, any>): MultiCheckboxColumn {
    const instance = new MultiCheckboxColumn(
      json.emojiIcon,
      json.width,
      json.nameVisible,
      json.description,
      json.id
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

// TaskTableColumn - таблиця задач з виконаними/невиконаними
class TaskTableColumn extends BaseColumn {
  tasks: Array<{ id: string; text: string; completed: boolean }>;
  options: string[];
  doneTags: string[];
  tagColors: Record<string, string>;

  constructor(
    emojiIcon: string = 'ListTodo',
    width: number = 150,
    nameVisible: boolean = true,
    description: string = '',
    id?: string
  ) {
    super('tasktable', emojiIcon, width, nameVisible, description, id);
    this.tasks = [];
    this.options = ['Task 1', 'Task 2'];
    this.doneTags = [];
    this.tagColors = {
      'Task 1': 'blue',
      'Task 2': 'green',
    };
  }

  addTask(text: string, color: string = 'blue'): boolean {
    if (this.options.includes(text)) return false;
    this.options.push(text);
    this.tagColors[text] = color;
    return true;
  }

  markAsDone(taskText: string): boolean {
    const index = this.options.indexOf(taskText);
    if (index === -1) return false;
    this.options.splice(index, 1);
    this.doneTags.push(taskText);
    return true;
  }

  markAsNotDone(taskText: string): boolean {
    const index = this.doneTags.indexOf(taskText);
    if (index === -1) return false;
    this.doneTags.splice(index, 1);
    this.options.push(taskText);
    return true;
  }

  removeTask(taskText: string): boolean {
    const optIndex = this.options.indexOf(taskText);
    const doneIndex = this.doneTags.indexOf(taskText);

    if (optIndex !== -1) {
      this.options.splice(optIndex, 1);
      delete this.tagColors[taskText];
      return true;
    }
    if (doneIndex !== -1) {
      this.doneTags.splice(doneIndex, 1);
      delete this.tagColors[taskText];
      return true;
    }
    return false;
  }

  static fromJSON(json: Record<string, any>): TaskTableColumn {
    const instance = new TaskTableColumn(
      json.emojiIcon,
      json.width,
      json.nameVisible,
      json.description,
      json.id
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

// Експорт класів
export {
  BaseColumn,
  DayBasedColumn,
  CheckBoxColumn,
  NumberBoxColumn,
  TextBoxColumn,
  TodoColumn,
  MultiSelectColumn,
  MultiCheckboxColumn,
  TaskTableColumn,
};

// Фабрика для створення колонок з JSON
export function ColumnFactory(json: Record<string, any>): BaseColumn {
  const type = json.type;

  switch (type) {
    case 'checkbox':
      return CheckBoxColumn.fromJSON(json);
    case 'numberbox':
    case 'numberBox':
      return NumberBoxColumn.fromJSON(json);
    case 'text':
    case 'textBox':
      return TextBoxColumn.fromJSON(json);
    case 'todo':
      return TodoColumn.fromJSON(json);
    case 'multi-select':
      return MultiSelectColumn.fromJSON(json);
    case 'multicheckbox':
      return MultiCheckboxColumn.fromJSON(json);
    case 'tasktable':
      return TaskTableColumn.fromJSON(json);
    default:
      throw new Error(`Unknown column type: ${type}`);
  }
}

// Функція для створення нової колонки за типом
export function createColumn(type: string): BaseColumn {
  switch (type) {
    case 'checkbox':
      return new CheckBoxColumn();
    case 'numberbox':
      return new NumberBoxColumn();
    case 'text':
      return new TextBoxColumn();
    case 'todo':
      return new TodoColumn();
    case 'multi-select':
      return new MultiSelectColumn();
    case 'multicheckbox':
      return new MultiCheckboxColumn();
    case 'tasktable':
      return new TaskTableColumn();
    default:
      throw new Error(`Unknown column type: ${type}`);
  }
}
