import {
  COLUMN_EMOJI_ICON,
  COLUMN_NAME_VISIBLE,
  COLUMN_WIDTHS,
  COLUMN_NAMES,
} from './constants';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
};

const basicColumnTemplate = (type) => ({
  name: COLUMN_NAMES[type],
  type: type,
  emojiIcon: COLUMN_EMOJI_ICON[type],
  nameVisible: COLUMN_NAME_VISIBLE[type],
  width: COLUMN_WIDTHS[type],
  description: '',
});

const createTodoColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('TODO'),
    todos: [],
    globalTodos: [],
  };
  return { [id]: column };
};

const createCheckboxColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('CHECKBOX'),
    days: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    },
    checkboxColor: 'green',
  };
  return { [id]: column };
};

const createNumberboxColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('NUMBERBOX'),
    days: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
  };
  return { [id]: column };
};

const createTextColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('TEXT'),
    days: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
  };
  return { [id]: column };
};

const createMultiSelectColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('MULTISELECT'),
    days: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
    options: ['Option 1', 'Option 2'],
    tagColors: { 'Option 1': 'blue', 'Option 2': 'green' },
  };
  return { [id]: column };
};

const createMulticheckboxColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('MULTICHECKBOX'),
    days: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
    options: ['Task 1', 'Task 2'],
    tagColors: { 'Task 1': 'blue', 'Task 2': 'green' },
  };
  return { [id]: column };
};

const createTasktableColumn = () => {
  const id = generateId();
  const column = {
    ...basicColumnTemplate('TASKTABLE'),
    tasks: [],
    doneTags: ['Done', 'Completed'],
    tagColors: { 'Done': 'green', 'Completed': 'blue' },
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
