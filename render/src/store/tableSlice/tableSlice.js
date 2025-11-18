import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 1. Сховище сутностей: доступ за ID (для швидкого пошуку)
  columns: {
    1755000000005: {
      // Колонка 1: Daily Standup
      Type: 'checkbox',
      Name: 'Daily Standup',
      Description: 'Attend team standup meeting',
      EmojiIcon: 'User',
      NameVisible: false,
      Chosen: {
        Monday: true,
        Tuesday: false,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: false,
        Sunday: false,
      },
      Width: 50,
      CheckboxColor: 'orange',
    },

    1755000000009: {
      // Колонка 2: Client Calls
      Type: 'numberbox',
      Name: 'Client Calls',
      Description: 'Hours spent on client calls',
      EmojiIcon: 'Zap',
      NameVisible: false,
      Chosen: {
        Monday: '1',
        Tuesday: '2',
        Wednesday: '1.5',
        Thursday: '1',
        Friday: '0',
        Saturday: '0',
        Sunday: '0',
      },
      Width: 60,
    },

    1755000000013: {
      // Колонка 3: Wellness Goals
      Type: 'multicheckbox',
      Name: 'Wellness Goals',
      Description: 'Track wellness activities',
      EmojiIcon: 'Leaf',
      NameVisible: false,
      Options: ['Yoga', 'Running'],
      TagColors: {
        Yoga: 'blue',
        Running: 'green',
      },
      Chosen: {
        Monday: 'Yoga',
        Tuesday: 'Running',
        Wednesday: '',
        Thursday: 'Yoga',
        Friday: '',
        Saturday: 'Running',
        Sunday: '',
      },
      Width: 50,
    },
  },

  // 2. Порядок відображення: Масив ID
  columnOrder: ['1755000000005', '1755000000009', '1755000000013'],
};

const tableSlice = createSlice({
  name: 'tableData',
  initialState: initialState,
  reducers: {
    createNewColumn: (state, action) => {},
    deleteColumn: (state, action) => {
      const columnId = action.payload.columnId;
      delete state.columns[columnId];
      state.columnOrder = state.columnOrder.filter((id) => id !== columnId);
    },
  },
});

export default tableSlice.reducer;
