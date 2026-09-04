import type {
  Column,
  ColumnEntry,
  ColumnEntryMeta,
  ColumnEntryValueType,
  CalendarEntry,
  Setting,
  DbResult,
} from "./models";

export interface UpsertDayEntryInput {
  columnId: string;
  dayDate: string;
  valueType: ColumnEntryValueType;
  value: unknown;
  meta?: ColumnEntryMeta;
}

export interface IColumnsApi {
  getAll(): Promise<DbResult<Column[]>>;
  getById(id: string): Promise<DbResult<Column>>;
  create(
    column: Omit<Column, "id"> & { id?: string },
  ): Promise<DbResult<Column>>;
  updateFields(
    id: string,
    fields: Partial<Column>,
  ): Promise<DbResult<{ updatedCount: number }>>;
  archive(id: string): Promise<DbResult<{ columnId: string }>>;
  delete(id: string): Promise<DbResult<{ columnId: string }>>;
  move(
    columnId: string,
    direction: "left" | "right",
  ): Promise<DbResult<{ columnsOrder: string[] }>>;
}

export interface IEntriesApi {
  getEntriesForWeek(weekStart: string): Promise<DbResult<ColumnEntry[]>>;
  getEntriesForDateRange(
    startDate: string,
    endDate: string,
  ): Promise<DbResult<ColumnEntry[]>>;
  upsertDayEntry(input: UpsertDayEntryInput): Promise<DbResult<ColumnEntry>>;
}

export interface ICalendarApi {
  getAll(): Promise<DbResult<CalendarEntry[]>>;
  save(
    event: CalendarEntry | Omit<CalendarEntry, "id">,
  ): Promise<DbResult<CalendarEntry>>;
  delete(id: string): Promise<DbResult<{ eventId: string }>>;
}

export interface ISettingsApi {
  get(): Promise<DbResult<Setting>>;
  update(
    updates: Partial<Omit<Setting, "id">>,
  ): Promise<DbResult<{ updatedCount: number }>>;
}

export interface ISystemApi {
  clearAllData(): Promise<DbResult<boolean>>;
}

export type DbChangeEvent = {
  table: "columns" | "entries" | "calendar" | "settings" | "all";
  action?: "create" | "update" | "delete" | "reorder" | "clear";
};

export interface IPlannerApi {
  columns: IColumnsApi;
  entries: IEntriesApi;
  calendar: ICalendarApi;
  settings: ISettingsApi;
  system: ISystemApi;
  onDbChange(callback: (event: DbChangeEvent) => void): () => void;
}
