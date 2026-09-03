import type {
    Column,
    ColumnEntry,
    ColumnEntryMeta,
    ColumnEntryValueType,
    CalendarEntry,
    Setting,
    DbResult,
} from './models';

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
    getByIds(ids: string[]): Promise<DbResult<(Column | undefined)[]>>;
    create(column: Column): Promise<DbResult<Column>>;
    updateFields(id: string, fields: Partial<Column>): Promise<DbResult<{ updatedCount: number }>>;
    updateUniqueProps(id: string, uniqueProps: unknown): Promise<DbResult<{ columnId: string }>>;
    archive(id: string, archivedAt: string): Promise<DbResult<{ columnId: string }>>;
    delete(id: string): Promise<DbResult<{ columnId: string }>>;
    reorder(order: string[]): Promise<DbResult<{ columnsOrder: string[] }>>;
    move(columnId: string, direction: 'left' | 'right'): Promise<DbResult<{ columnsOrder: string[] }>>;
}

export interface IEntriesApi {
    getDayEntry(columnId: string, dayDate: string): Promise<DbResult<ColumnEntry | null>>;
    getEntriesForWeek(weekStart: string): Promise<DbResult<ColumnEntry[]>>;
    getEntriesForDateRange(startDate: string, endDate: string): Promise<DbResult<ColumnEntry[]>>;
    upsertDayEntry(input: UpsertDayEntryInput): Promise<DbResult<ColumnEntry>>;
    deleteEntriesForColumn(columnId: string): Promise<DbResult<{ deletedCount: number }>>;
}

export interface ICalendarApi {
    getAll(): Promise<DbResult<CalendarEntry[]>>;
    getByDate(date: string): Promise<DbResult<CalendarEntry[]>>;
    getById(id: string): Promise<DbResult<CalendarEntry>>;
    getInRange(startDate: string, endDate: string): Promise<DbResult<CalendarEntry[]>>;
    save(event: CalendarEntry | Omit<CalendarEntry, 'id'>): Promise<DbResult<CalendarEntry>>;
    delete(id: string): Promise<DbResult<{ eventId: string }>>;
}

export interface ISettingsApi {
    get(): Promise<DbResult<Setting>>;
    update(updates: Partial<Omit<Setting, 'id'>>): Promise<DbResult<{ updatedCount: number }>>;
    getColumnsOrder(): Promise<DbResult<string[]>>;
    updateColumnsOrder(columnIds: string[]): Promise<DbResult<{ columnsOrder: string[] }>>;
}

export interface ISystemApi {
    clearAllData(): Promise<DbResult<boolean>>;
}

export type DbChangeEvent = {
    table: 'columns' | 'entries' | 'calendar' | 'settings' | 'all';
    action?: 'create' | 'update' | 'delete' | 'reorder' | 'clear';
};

export interface IPlannerApi {
    columns: IColumnsApi;
    entries: IEntriesApi;
    calendar: ICalendarApi;
    settings: ISettingsApi;
    system: ISystemApi;
    onDbChange(callback: (event: DbChangeEvent) => void): () => void;
}
