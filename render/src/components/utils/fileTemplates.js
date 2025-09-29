const getColumnTemplates = () => ({
  todo: {
    EmojiIcon: 'ListTodo',
    NameVisible: true,
    Width: 150,
    Chosen: {
      global: [],
    },
    Options: ['Option 1', 'Option 2'],
    TagColors: {
      'Option 1': 'blue',
      'Option 2': 'green',
    },
  },
  checkbox: {
    EmojiIcon: 'Star',
    NameVisible: false,
    Chosen: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    },
    Width: 50,
    CheckboxColor: 'green',
  },
  numberbox: {
    EmojiIcon: 'Star',
    NameVisible: false,
    Chosen: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
    Width: 60,
  },
  text: {
    EmojiIcon: 'Star',
    NameVisible: true,
    Chosen: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
    Width: 130,
  },
  'multi-select': {
    EmojiIcon: 'Star',
    NameVisible: true,
    Options: ['Option 1', 'Option 2'],
    TagColors: {
      'Option 1': 'blue',
      'Option 2': 'green',
    },
    Chosen: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
    Width: 90,
  },
  multicheckbox: {
    EmojiIcon: 'Circle',
    NameVisible: false,
    Options: ['Task 1', 'Task 2'],
    TagColors: {
      'Task 1': 'blue',
      'Task 2': 'green',
    },
    Chosen: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
    Width: 50,
  },
  tasktable: {
    EmojiIcon: 'ListTodo',
    NameVisible: true,
    Options: ['Task 1', 'Task 2'],
    TagColors: {
      'Task 1': 'blue',
      'Task 2': 'green',
    },
    Chosen: {
      global: [],
    },
    Width: 150,
  },
});

const getSettingsTemplate = () => ({
  theme: {
    darkMode: false,
    accentColor: 'blue',
    autoThemeSettings: {
      enabled: false,
      startTime: '08:00',
      endTime: '20:00',
    },
  },
  table: {
    columnOrder: [],
    showSummaryRow: false,
    compactMode: false,
    stickyHeader: true,
  },
  ui: {
    animations: true,
    tooltips: true,
    confirmDelete: true,
  },
});

module.exports = { getColumnTemplates, getSettingsTemplate};
