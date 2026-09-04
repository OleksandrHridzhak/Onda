import { create } from "zustand";

export interface TableUIState {
  editingColumnId: string | null;
  openColumnMenu: (columnId: string) => void;
  closeColumnMenu: () => void;
}

export const useTableStore = create<TableUIState>((set) => ({
  editingColumnId: null,
  openColumnMenu: (columnId: string) => set({ editingColumnId: columnId }),
  closeColumnMenu: () => set({ editingColumnId: null }),
}));
