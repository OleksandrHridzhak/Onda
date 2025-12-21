interface ChosenGlobal {
  global: unknown[];
}

interface TagColors {
  [key: string]: string;
}

interface TodoColumnTemplate {
  EmojiIcon: string;
  NameVisible: boolean;
  Width: number;
  Chosen: ChosenGlobal;
  Options: string[];
  TagColors: TagColors;
}

interface CheckboxColumnTemplate {
  EmojiIcon: string;
  NameVisible: boolean;
  Chosen: Record<string, boolean>;
  Width: number;
  CheckboxColor: string;
}

interface NumberboxColumnTemplate {
  EmojiIcon: string;
  NameVisible: boolean;
  Chosen: Record<string, string>;
  Width: number;
}

interface TextColumnTemplate {
  EmojiIcon: string;
  NameVisible: boolean;
  Chosen: Record<string, string>;
  Width: number;
}

interface MultiSelectColumnTemplate {
  EmojiIcon: string;
  NameVisible: boolean;
  Options: string[];
  TagColors: TagColors;
  Chosen: Record<string, string>;
  Width: number;
}

interface MulticheckboxColumnTemplate {
  EmojiIcon: string;
  NameVisible: boolean;
  Options: string[];
  TagColors: TagColors;
  Chosen: Record<string, string>;
  Width: number;
}

interface TasktableColumnTemplate {
  EmojiIcon: string;
  NameVisible: boolean;
  Options: string[];
  TagColors: TagColors;
  Chosen: ChosenGlobal;
  Width: number;
}

interface ColumnTemplates {
  todo: TodoColumnTemplate;
  checkbox: CheckboxColumnTemplate;
  numberbox: NumberboxColumnTemplate;
  text: TextColumnTemplate;
  multiselect: MultiSelectColumnTemplate;
  multicheckbox: MulticheckboxColumnTemplate;
  tasktable: TasktableColumnTemplate;
}

interface AutoThemeSettings {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface ThemeSettings {
  darkMode: boolean;
  accentColor: string;
  autoThemeSettings: AutoThemeSettings;
}

interface TableSettings {
  columnOrder: unknown[];
  showSummaryRow: boolean;
  compactMode: boolean;
  stickyHeader: boolean;
}

interface UiSettings {
  animations: boolean;
  tooltips: boolean;
  confirmDelete: boolean;
}

interface SettingsTemplate {
  theme: ThemeSettings;
  table: TableSettings;
  ui: UiSettings;
}

const getColumnTemplates = (): ColumnTemplates => ({
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
  multiselect: {
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

const getSettingsTemplate = (): SettingsTemplate => ({
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

export { getColumnTemplates, getSettingsTemplate };
