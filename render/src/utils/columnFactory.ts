/**
 * Фабрика для створення нових колонок
 */
import { ColumnData, Day } from '../types/column.types';

const generateColumnId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const emptyDays: Record<Day, string> = {
  Monday: '',
  Tuesday: '',
  Wednesday: '',
  Thursday: '',
  Friday: '',
  Saturday: '',
  Sunday: '',
};

export const createColumn = (type: string): ColumnData => {
  const id = generateColumnId();

  switch (type.toLowerCase()) {
    case 'checkbox':
      return {
        id,
        type: 'checkbox',
        name: 'New Checkbox',
        emojiIcon: 'Star',
        width: 50,
        nameVisible: false,
        description: '',
        days: { ...emptyDays },
        checkboxColor: 'green',
      };

    case 'numberbox':
      return {
        id,
        type: 'numberbox',
        name: 'New Numberbox',
        emojiIcon: 'Star',
        width: 60,
        nameVisible: false,
        description: '',
        days: { ...emptyDays },
      };

    case 'text':
      return {
        id,
        type: 'text',
        name: 'New Text',
        emojiIcon: 'Star',
        width: 130,
        nameVisible: true,
        description: '',
        days: { ...emptyDays },
      };

    case 'multiselect':
      return {
        id,
        type: 'multiselect',
        name: 'New MultiSelect',
        emojiIcon: 'Star',
        width: 90,
        nameVisible: true,
        description: '',
        days: { ...emptyDays },
        options: [],
        tagColors: {},
      };

    case 'multicheckbox':
      return {
        id,
        type: 'multicheckbox',
        name: 'New Multicheckbox',
        emojiIcon: 'Circle',
        width: 50,
        nameVisible: false,
        description: '',
        days: { ...emptyDays },
        options: [],
        tagColors: {},
      };

    case 'todo':
      return {
        id,
        type: 'todo',
        name: 'Todo',
        emojiIcon: 'ListTodo',
        width: 150,
        nameVisible: true,
        description: '',
        todos: [],
        globalTodos: [],
      };

    case 'tasktable':
      return {
        id,
        type: 'tasktable',
        name: 'Tasktable',
        emojiIcon: 'ListTodo',
        width: 150,
        nameVisible: true,
        description: '',
        tasks: [],
        doneTags: [],
        tagColors: {},
      };

    default:
      throw new Error(`Unknown column type: ${type}`);
  }
};
