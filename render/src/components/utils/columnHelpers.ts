import { BaseColumn, ColumnFactory, createColumn } from './columnCreator';

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
 * Міграція старих даних (Chosen -> days/tasks)
 * Конвертує старий формат JSON у новий формат з класами
 */
export function migrateOldColumnData(oldJson: Record<string, any>): Record<string, any> {
    const migrated = { ...oldJson };
    
    // Якщо є Chosen - мігруємо залежно від типу
    if (oldJson.Chosen) {
        const type = oldJson.Type || oldJson.type;
        
        if (type === 'todo' || type === 'tasktable') {
            // Для todo/tasktable: Chosen.global -> tasks
            migrated.tasks = oldJson.Chosen.global || [];
        } else {
            // Для day-based колонок: Chosen -> days
            migrated.days = oldJson.Chosen;
        }
        
        delete migrated.Chosen;
    }
    
    // Нормалізація назв полів
    if (oldJson.Type) {
        migrated.type = oldJson.Type;
        delete migrated.Type;
    }
    if (oldJson.EmojiIcon) {
        migrated.emojiIcon = oldJson.EmojiIcon;
        delete migrated.EmojiIcon;
    }
    if (oldJson.Width) {
        migrated.width = parseInt(oldJson.Width);
        delete migrated.Width;
    }
    if (oldJson.NameVisible !== undefined) {
        migrated.nameVisible = oldJson.NameVisible;
        delete migrated.NameVisible;
    }
    if (oldJson.Description) {
        migrated.description = oldJson.Description;
        delete migrated.Description;
    }
    if (oldJson.Options) {
        migrated.options = oldJson.Options;
        delete migrated.Options;
    }
    if (oldJson.TagColors) {
        migrated.tagColors = oldJson.TagColors;
        delete migrated.TagColors;
    }
    if (oldJson.CheckboxColor) {
        migrated.checkboxColor = oldJson.CheckboxColor;
        delete migrated.CheckboxColor;
    }
    if (oldJson.DoneTags) {
        migrated.doneTags = oldJson.DoneTags;
        delete migrated.DoneTags;
    }
    
    return migrated;
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
