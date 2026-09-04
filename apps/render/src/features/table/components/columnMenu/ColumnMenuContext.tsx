import React, { createContext, useContext, useMemo } from "react";
import { useDbQuery } from "shared/api/db";
import { getColumnById, getAllColumns } from "../../api/columns";
import { getSettings } from "features/settings/api/settings";
import { useColumnMenuHandlers } from "../../hooks/useColumnMenuHandlers";
import { isColumnArchived } from "../../utils/lifecycle";
import type { Column } from "../../types/columnTypes";

type ColumnMenuHandlers = ReturnType<typeof useColumnMenuHandlers>;

export interface ColumnMenuContextValue {
  columnId: string;
  column: Column | null | undefined;
  activeColumnsOrder: string[] | undefined;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  form: ColumnMenuHandlers["form"];
  actions: ColumnMenuHandlers["actions"];
  ui: ColumnMenuHandlers["ui"];
  onClose: () => void;
}

const ColumnMenuContext = createContext<ColumnMenuContextValue | null>(null);

interface ColumnMenuProviderProps {
  columnId: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function ColumnMenuProvider({
  columnId,
  onClose,
  children,
}: ColumnMenuProviderProps): React.ReactElement {
  const column = useDbQuery(
    async () => {
      const result = await getColumnById(columnId);
      if (result.success && result.data) {
        return result.data;
      }
      return null;
    },
    ["columns"],
    columnId,
  );

  const activeColumnsOrder = useDbQuery(async () => {
    const [settingsRes, columnsRes] = await Promise.all([
      getSettings(),
      getAllColumns(),
    ]);
    if (
      !settingsRes.success ||
      !settingsRes.data ||
      !columnsRes.success ||
      !columnsRes.data
    ) {
      return [];
    }

    const columnsById = new Map(columnsRes.data.map((c) => [c.id, c]));
    return settingsRes.data.layout.columnsOrder.filter((id) => {
      const col = columnsById.get(id);
      return col && !isColumnArchived(col);
    });
  }, ["columns", "settings"]);

  const { form, actions, ui } = useColumnMenuHandlers({
    columnId,
    column,
    onClose,
  });

  const currentIndex = activeColumnsOrder
    ? activeColumnsOrder.indexOf(columnId)
    : -1;
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = Boolean(
    activeColumnsOrder &&
    currentIndex >= 0 &&
    currentIndex < activeColumnsOrder.length - 1,
  );

  const value = useMemo<ColumnMenuContextValue>(
    () => ({
      columnId,
      column,
      activeColumnsOrder,
      canMoveLeft,
      canMoveRight,
      form,
      actions,
      ui,
      onClose,
    }),
    [
      columnId,
      column,
      activeColumnsOrder,
      canMoveLeft,
      canMoveRight,
      form,
      actions,
      ui,
      onClose,
    ],
  );

  return (
    <ColumnMenuContext.Provider value={value}>
      {children}
    </ColumnMenuContext.Provider>
  );
}

export function useColumnMenuContext(): ColumnMenuContextValue {
  const ctx = useContext(ColumnMenuContext);
  if (!ctx) {
    throw new Error(
      "useColumnMenuContext must be used within a ColumnMenuProvider",
    );
  }
  return ctx;
}
