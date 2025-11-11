import { BaseColumn, ColumnFactory, createColumn } from './index';

/**
 * Конвертує масив JSON-об'єктів колонок у масив екземплярів класів
 */
export function deserializeColumns(jsonColumns: Record<string, any>[]): BaseColumn[] {
    return jsonColumns.map(json => ColumnFactory(json));
}

/**
 * Конвертує масив екземплярів класів колонок у JSON для збереження
 */
export function serializeColumns(columns: BaseColumn[]): Record<string, any>[] {
    return columns.map(column => column.toJSON());
}
/**
 * Оновлює колонку і повертає новий екземпляр
 */
export function updateColumnField(
    column: BaseColumn,
    field: string,
    value: any
): BaseColumn {
    const json = column.toJSON();
    json[field] = value;
    return ColumnFactory(json);
}
