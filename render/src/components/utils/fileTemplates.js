const { ColumnFactory } = require('./columnClasses');

const getColumnTemplates = () => {
  // Get base templates from ColumnFactory
  const templates = ColumnFactory.getAllTemplates();
  
  // Customize templates with specific icons and visibility settings
  return {
    todo: {
      ...templates.todo,
      EmojiIcon: 'ListTodo',
      NameVisible: true,
    },
    checkbox: {
      ...templates.checkbox,
      EmojiIcon: 'Star',
      NameVisible: false,
    },
    numberbox: {
      ...templates.numberbox,
      EmojiIcon: 'Star',
      NameVisible: false,
    },
    text: {
      ...templates.text,
      EmojiIcon: 'Star',
      NameVisible: true,
    },
    'multi-select': {
      ...templates['multi-select'],
      EmojiIcon: 'Star',
      NameVisible: true,
    },
    multicheckbox: {
      ...templates.multicheckbox,
      EmojiIcon: 'Circle',
      NameVisible: false,
    },
    tasktable: {
      ...templates.tasktable,
      EmojiIcon: 'ListTodo',
      NameVisible: true,
    },
  };
};

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
