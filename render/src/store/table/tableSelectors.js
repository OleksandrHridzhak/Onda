// selectors.js
import { createSelector } from '@reduxjs/toolkit';

export const selectColumns = (state) => state.table.columns;

export const selectColumnById = (id) =>
  createSelector([selectColumns], (columns) =>
    columns.find((col) => col.ColumnId === id)
  );
