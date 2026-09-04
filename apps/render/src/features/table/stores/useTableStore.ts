import { create } from "zustand";

interface TableState {
  // стейт
}

interface TableActions {
  // екшени
}

export type TableStore = TableState & TableActions;

export const useTableStore = create<TableStore>((set) => ({
  // початковий стан та реалізація екшенів
}));
