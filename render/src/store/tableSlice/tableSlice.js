import { createSlice } from '@reduxjs/toolkit';
import { columnsFactory } from './columnsFactory';

const tableSlice = createSlice({
  name: 'tableData',
  initialState: {
    columns: {
      f9e8d7c6: {
        Name: 'Checkbox',
        EmojiIcon: '☑️',
        NameVisible: true,
        Width: 120,
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
      },
    },
    columnOrder: ['f9e8d7c6'],
    status: 'idle',
  },
  reducers: {
    createNewColumn: (state, action) => {
      const columnType = action.payload.columnType;
      const newColumn = columnsFactory(columnType);
      const columnId = Object.keys(newColumn)[0];
      state.columns[columnId] = newColumn[columnId];
      state.columnOrder.push(columnId);
    },
    deleteColumn: (state, action) => {
      const columnId = action.payload.columnId;
      delete state.columns[columnId];
      state.columnOrder = state.columnOrder.filter((id) => id !== columnId);
    },
    updateColumnNested: (state, action) => {
      const { columnId, path, value } = action.payload;
      let obj = state.columns[columnId].uniqueProperties;

      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
        if (!obj) return;
      }

      obj[path[path.length - 1]] = value;
    },
    updateCommonColumnProperties: (state, action) => {
      const { columnId, properties } = action.payload;
      state.columns[columnId] = {
        ...state.columns[columnId],
        ...properties,
      };
    },
    swapColumnsPosition: (state, action) => {
      const { id, direction } = action.payload;
      const index = state.columnOrder.indexOf(id);
      if (index === -1) return;

      let newIndex;
      if (direction === 'left' && index > 0) {
        newIndex = index - 1;
      } else if (
        direction === 'right' &&
        index < state.columnOrder.length - 1
      ) {
        newIndex = index + 1;
      } else {
        return;
      }
      const temp = state.columnOrder[newIndex];
      state.columnOrder[newIndex] = state.columnOrder[index];
      state.columnOrder[index] = temp;
    },
  },
});

export default tableSlice.reducer;
