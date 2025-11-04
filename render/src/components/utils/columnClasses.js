/**
 * Base Column Class
 * Provides common functionality for all column types
 */
class Column {
  constructor(config = {}) {
    this.ColumnId = config.ColumnId || this.generateId();
    this.Type = config.Type || 'text';
    this.Name = config.Name || '';
    this.Description = config.Description || '';
    this.EmojiIcon = config.EmojiIcon || 'Star';
    this.NameVisible = config.NameVisible !== undefined ? config.NameVisible : true;
    this.Width = config.Width || this.getDefaultWidth();
    this.Chosen = config.Chosen || this.getDefaultChosen();
  }

  generateId() {
    // Use timestamp + random component to avoid collisions
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getDefaultWidth() {
    return 100;
  }

  getDefaultChosen() {
    return {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    };
  }

  toJSON() {
    return {
      ColumnId: this.ColumnId,
      Type: this.Type,
      Name: this.Name,
      Description: this.Description,
      EmojiIcon: this.EmojiIcon,
      NameVisible: this.NameVisible,
      Width: this.Width,
      Chosen: this.Chosen,
    };
  }

  updateValue(day, value) {
    if (this.Chosen && day in this.Chosen) {
      this.Chosen[day] = value;
    }
  }

  getValue(day) {
    return this.Chosen?.[day] || '';
  }

  validate() {
    return true;
  }
}

/**
 * Checkbox Column Class
 * Handles boolean checkbox values
 */
class CheckboxColumn extends Column {
  constructor(config = {}) {
    super({ ...config, Type: 'checkbox' });
    this.CheckboxColor = config.CheckboxColor || 'green';
  }

  getDefaultWidth() {
    return 50;
  }

  getDefaultChosen() {
    return {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      CheckboxColor: this.CheckboxColor,
    };
  }

  updateValue(day, value) {
    if (this.Chosen && day in this.Chosen) {
      this.Chosen[day] = !!value;
    }
  }

  validate() {
    return typeof this.CheckboxColor === 'string' && this.CheckboxColor.length > 0;
  }
}

/**
 * Numberbox Column Class
 * Handles numeric input values
 */
class NumberboxColumn extends Column {
  constructor(config = {}) {
    super({ ...config, Type: 'numberbox' });
  }

  getDefaultWidth() {
    return 60;
  }

  updateValue(day, value) {
    if (this.Chosen && day in this.Chosen) {
      const numValue = parseFloat(value);
      // Store as string to maintain consistency with data format
      this.Chosen[day] = isNaN(numValue) ? '' : String(value);
    }
  }

  validate() {
    return true;
  }
}

/**
 * Text Column Class
 * Handles text/string input values
 */
class TextColumn extends Column {
  constructor(config = {}) {
    super({ ...config, Type: 'text' });
  }

  getDefaultWidth() {
    return 130;
  }
}

/**
 * Multi-Select Column Class
 * Handles multiple tag selection
 */
class MultiSelectColumn extends Column {
  constructor(config = {}) {
    super({ ...config, Type: 'multi-select' });
    this.Options = config.Options || ['Option 1', 'Option 2'];
    this.TagColors = config.TagColors || {
      'Option 1': 'blue',
      'Option 2': 'green',
    };
  }

  getDefaultWidth() {
    return 90;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      Options: this.Options,
      TagColors: this.TagColors,
    };
  }

  addOption(option, color = 'blue') {
    if (!this.Options.includes(option)) {
      this.Options.push(option);
      this.TagColors[option] = color;
    }
  }

  removeOption(option) {
    const index = this.Options.indexOf(option);
    if (index > -1) {
      this.Options.splice(index, 1);
      delete this.TagColors[option];
    }
  }

  updateOption(oldOption, newOption) {
    const index = this.Options.indexOf(oldOption);
    if (index > -1) {
      this.Options[index] = newOption;
      if (this.TagColors[oldOption]) {
        this.TagColors[newOption] = this.TagColors[oldOption];
        delete this.TagColors[oldOption];
      }
    }
  }

  validate() {
    return Array.isArray(this.Options) && typeof this.TagColors === 'object';
  }
}

/**
 * Multi-Checkbox Column Class
 * Handles multiple checkbox options
 */
class MultiCheckboxColumn extends Column {
  constructor(config = {}) {
    super({ ...config, Type: 'multicheckbox' });
    this.Options = config.Options || ['Task 1', 'Task 2'];
    this.TagColors = config.TagColors || {
      'Task 1': 'blue',
      'Task 2': 'green',
    };
  }

  getDefaultWidth() {
    return 50;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      Options: this.Options,
      TagColors: this.TagColors,
    };
  }

  addOption(option, color = 'blue') {
    if (!this.Options.includes(option)) {
      this.Options.push(option);
      this.TagColors[option] = color;
    }
  }

  removeOption(option) {
    const index = this.Options.indexOf(option);
    if (index > -1) {
      this.Options.splice(index, 1);
      delete this.TagColors[option];
    }
  }

  validate() {
    return Array.isArray(this.Options) && typeof this.TagColors === 'object';
  }
}

/**
 * Todo Column Class
 * Handles global todo list
 */
class TodoColumn extends Column {
  constructor(config = {}) {
    super({ ...config, Type: 'todo' });
    this.Options = config.Options || ['Option 1', 'Option 2'];
    this.TagColors = config.TagColors || {
      'Option 1': 'blue',
      'Option 2': 'green',
    };
  }

  getDefaultWidth() {
    return 150;
  }

  getDefaultChosen() {
    return {
      global: [],
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      Options: this.Options,
      TagColors: this.TagColors,
    };
  }

  addTodo(todoText) {
    if (!this.Chosen.global) {
      this.Chosen.global = [];
    }
    this.Chosen.global.push({
      id: Date.now(),
      text: todoText,
      completed: false,
    });
  }

  updateTodo(todoId, updates) {
    if (this.Chosen.global) {
      const todo = this.Chosen.global.find(t => t.id === todoId);
      if (todo) {
        Object.assign(todo, updates);
      }
    }
  }

  removeTodo(todoId) {
    if (this.Chosen.global) {
      this.Chosen.global = this.Chosen.global.filter(t => t.id !== todoId);
    }
  }

  validate() {
    return Array.isArray(this.Chosen?.global);
  }
}

/**
 * Task Table Column Class
 * Handles task table with options
 */
class TaskTableColumn extends Column {
  constructor(config = {}) {
    super({ ...config, Type: 'tasktable' });
    this.Options = config.Options || ['Task 1', 'Task 2'];
    this.TagColors = config.TagColors || {
      'Task 1': 'blue',
      'Task 2': 'green',
    };
    this.DoneTags = config.DoneTags || [];
  }

  getDefaultWidth() {
    return 150;
  }

  getDefaultChosen() {
    return {
      global: [],
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      Options: this.Options,
      TagColors: this.TagColors,
      DoneTags: this.DoneTags,
    };
  }

  addTask(taskText, color = 'blue') {
    if (!this.Options.includes(taskText)) {
      this.Options.push(taskText);
      this.TagColors[taskText] = color;
    }
  }

  markTaskDone(task) {
    const index = this.Options.indexOf(task);
    if (index > -1) {
      this.Options.splice(index, 1);
      if (!this.DoneTags.includes(task)) {
        this.DoneTags.push(task);
      }
    }
  }

  validate() {
    return Array.isArray(this.Options) && typeof this.TagColors === 'object';
  }
}

/**
 * Column Factory
 * Creates column instances based on type
 */
class ColumnFactory {
  static createColumn(type, config = {}) {
    const columnClasses = {
      'checkbox': CheckboxColumn,
      'numberbox': NumberboxColumn,
      'text': TextColumn,
      'multi-select': MultiSelectColumn,
      'multicheckbox': MultiCheckboxColumn,
      'todo': TodoColumn,
      'tasktable': TaskTableColumn,
    };

    const ColumnClass = columnClasses[type] || TextColumn;
    return new ColumnClass(config);
  }

  static fromJSON(data) {
    if (!data || !data.Type) {
      return null;
    }
    return this.createColumn(data.Type, data);
  }

  static getColumnTemplate(type) {
    const column = this.createColumn(type);
    return column.toJSON();
  }

  static getAllTemplates() {
    return {
      todo: this.getColumnTemplate('todo'),
      checkbox: this.getColumnTemplate('checkbox'),
      numberbox: this.getColumnTemplate('numberbox'),
      text: this.getColumnTemplate('text'),
      'multi-select': this.getColumnTemplate('multi-select'),
      multicheckbox: this.getColumnTemplate('multicheckbox'),
      tasktable: this.getColumnTemplate('tasktable'),
    };
  }
}

module.exports = {
  Column,
  CheckboxColumn,
  NumberboxColumn,
  TextColumn,
  MultiSelectColumn,
  MultiCheckboxColumn,
  TodoColumn,
  TaskTableColumn,
  ColumnFactory,
};
