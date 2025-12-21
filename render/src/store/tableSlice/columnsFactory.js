import {
  COLUMN_EMOJI_ICON,
  COLUMN_NAME_VISIBLE,
  COLUMN_WIDTHS,
  COLUMN_NAMES,
} from './constants';

// Функція для генерації унікального ID у браузері
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback для старих браузерів
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const basicColumnTemplate = (type) => ({
  Name: COLUMN_NAMES[type],
  Type: type,
  EmojiIcon: COLUMN_EMOJI_ICON[type],
  NameVisible: COLUMN_NAME_VISIBLE[type],
  Width: COLUMN_WIDTHS[type],
});

const createTodoColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('TODO'),
    uniqueProperties: {
      Chosen: { global: [] },
      Categorys: ['Option 1', 'Option 2'],
      CategoryColors: { 'Option 1': 'blue', 'Option 2': 'green' },
    },
  };
  return { [id]: column };
};

const createCheckboxColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('CHECKBOX'),
    uniqueProperties: {
      Days: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
      },
      CheckboxColor: 'green',
    },
  };
  return { [id]: column };
};

const createNumberboxColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('NUMBERBOX'),
    uniqueProperties: {
      Days: {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        Sunday: '',
      },
    },
  };
  return { [id]: column };
};

const createTextColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('TEXT'),
    uniqueProperties: {
      Days: {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        Sunday: '',
      },
    },
  };
  return { [id]: column };
};

const createMultiSelectColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('MULTISELECT'),
    uniqueProperties: {
      Days: {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        Sunday: '',
      },
      Tags: ['Option 1', 'Option 2'],
      TagsColors: { 'Option 1': 'blue', 'Option 2': 'green' },
    },
  };
  return { [id]: column };
};

const createMulticheckboxColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('MULTICHECKBOX'),
    uniqueProperties: {
      Days: {
        Monday: '',
        Tuesday: '',
        Wednesday: '',
        Thursday: '',
        Friday: '',
        Saturday: '',
        Sunday: '',
      },
      Options: ['Task 1', 'Task 2'],
      OptionsColors: { 'Task 1': 'blue', 'Task 2': 'green' },
    },
  };
  return { [id]: column };
};

const createTasktableColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('TASKTABLE'),
    uniqueProperties: {
      Chosen: {},
      Options: ['Task 1', 'Task 2'],
      OptionsColors: { 'Task 1': 'blue', 'Task 2': 'green' },
    },
  };
  return { [id]: column };
};

// Фабрика колонок
export const columnsFactory = (columnType) => {
  switch (columnType) {
    case 'todo':
      return createTodoColumn();
    case 'checkbox':
      return createCheckboxColumn();
    case 'numberbox':
      return createNumberboxColumn();
    case 'text':
      return createTextColumn();
    case 'multiselect':
      return createMultiSelectColumn();
    case 'multicheckbox':
      return createMulticheckboxColumn();
    case 'tasktable':
      return createTasktableColumn();
    default:
      throw new Error(`Unknown column type: ${columnType}`);
  }
};
