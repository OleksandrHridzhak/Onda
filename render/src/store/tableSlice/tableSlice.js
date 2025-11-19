import { createSlice } from '@reduxjs/toolkit';
import { columnsFactory } from './columnsFactory';

const tableSlice = createSlice({
  name: 'tableData',
  initialState: {
    columns: {},
    columnOrder: [],
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
  },
});

export default tableSlice.reducer;
