import { getDatabase } from '../database/rxdb';
import { ColumnDocument } from '../database/schemas/column.schema';
import { ColumnData } from '../types/column.types';

/**
 * Service for managing columns in RxDB
 * Provides backward-compatible API with the old columnsDB.js
 */

export async function getAllColumns(): Promise<ColumnDocument[]> {
  try {
    const db = await getDatabase();
    const docs = await db.columns.find().exec();
    const columns = docs.map((doc: any) => doc.toJSON());
    console.log('📦 Retrieved columns from RxDB:', columns.length, 'columns');
    return columns;
  } catch (error) {
    console.error('Error getting all columns:', error);
    return [];
  }
}

export async function getColumn(id: string): Promise<ColumnDocument | null> {
  try {
    const db = await getDatabase();
    const doc = await db.columns.findOne(id).exec();
    return doc ? doc.toJSON() : null;
  } catch (error) {
    console.error('Error getting column:', error);
    return null;
  }
}

export async function addColumn(column: any): Promise<any> {
  try {
    const db = await getDatabase();
    
    console.log('📝 Adding column to RxDB:', column);
    
    // Normalize field names from old Redux format to RxDB format
    const normalizedColumn = {
      _id: column.id,
      id: column.id,
      type: (column.Type || column.type || '').toLowerCase(),
      name: column.Name || column.name || '',
      emojiIcon: column.EmojiIcon || column.emojiIcon || '',
      width: column.Width || column.width || 150,
      nameVisible: column.NameVisible !== undefined ? column.NameVisible : (column.nameVisible !== undefined ? column.nameVisible : true),
      description: column.Description || column.description || '',
      // Copy other properties as-is
      days: column.uniqueProperties?.Days || column.days,
      checkboxColor: column.uniqueProperties?.CheckboxColor || column.checkboxColor,
      options: column.uniqueProperties?.Tags || column.uniqueProperties?.Options || column.options,
      tagColors: column.uniqueProperties?.TagsColors || column.uniqueProperties?.OptionsColors || column.uniqueProperties?.CategoryColors || column.tagColors,
      todos: column.uniqueProperties?.Chosen ? 
        Object.entries(column.uniqueProperties.Chosen)
          .filter(([key]) => key !== 'global')
          .map(([day, tasks]: [string, any]) => 
            Array.isArray(tasks) ? tasks.map((t: any) => ({ ...t, day })) : []
          )
          .flat() : column.todos,
      globalTodos: column.uniqueProperties?.Chosen?.global || column.globalTodos,
      tasks: column.uniqueProperties?.Chosen && typeof column.uniqueProperties.Chosen === 'object' ? 
        Object.entries(column.uniqueProperties.Chosen).map(([id, data]: [string, any]) => ({
          id,
          name: data.name || id,
          days: data.days || {}
        })) : column.tasks,
      doneTags: column.uniqueProperties?.Options || column.doneTags,
    };
    
    // Remove undefined fields
    Object.keys(normalizedColumn).forEach(key => {
      if (normalizedColumn[key] === undefined) {
        delete normalizedColumn[key];
      }
    });
    
    console.log('✅ Normalized column for RxDB:', normalizedColumn);
    
    await db.columns.upsert(normalizedColumn);
    
    console.log('💾 Column saved to RxDB successfully');
    
    return { status: true, data: column };
  } catch (error) {
    console.error('❌ Error adding column:', error);
    return { status: false, message: (error as Error).message };
  }
}

export async function updateColumn(column: any): Promise<void> {
  try {
    const db = await getDatabase();
    
    // Normalize field names from old Redux format to RxDB format
    const normalizedColumn = {
      _id: column.id,
      id: column.id,
      type: (column.Type || column.type || '').toLowerCase(),
      name: column.Name || column.name || '',
      emojiIcon: column.EmojiIcon || column.emojiIcon || '',
      width: column.Width || column.width || 150,
      nameVisible: column.NameVisible !== undefined ? column.NameVisible : (column.nameVisible !== undefined ? column.nameVisible : true),
      description: column.Description || column.description || '',
      // Copy other properties as-is
      days: column.uniqueProperties?.Days || column.days,
      checkboxColor: column.uniqueProperties?.CheckboxColor || column.checkboxColor,
      options: column.uniqueProperties?.Tags || column.uniqueProperties?.Options || column.options,
      tagColors: column.uniqueProperties?.TagsColors || column.uniqueProperties?.OptionsColors || column.uniqueProperties?.CategoryColors || column.tagColors,
      todos: column.uniqueProperties?.Chosen ? 
        Object.entries(column.uniqueProperties.Chosen)
          .filter(([key]) => key !== 'global')
          .map(([day, tasks]: [string, any]) => 
            Array.isArray(tasks) ? tasks.map((t: any) => ({ ...t, day })) : []
          )
          .flat() : column.todos,
      globalTodos: column.uniqueProperties?.Chosen?.global || column.globalTodos,
      tasks: column.uniqueProperties?.Chosen && typeof column.uniqueProperties.Chosen === 'object' ? 
        Object.entries(column.uniqueProperties.Chosen).map(([id, data]: [string, any]) => ({
          id,
          name: data.name || id,
          days: data.days || {}
        })) : column.tasks,
      doneTags: column.uniqueProperties?.Options || column.doneTags,
    };
    
    // Remove undefined fields
    Object.keys(normalizedColumn).forEach(key => {
      if (normalizedColumn[key] === undefined) {
        delete normalizedColumn[key];
      }
    });
    
    await db.columns.upsert(normalizedColumn);
  } catch (error) {
    console.error('Error updating column:', error);
    throw error;
  }
}

export async function deleteColumn(id: string): Promise<void> {
  try {
    const db = await getDatabase();
    const doc = await db.columns.findOne(id).exec();
    if (doc) {
      await doc.remove();
    }
  } catch (error) {
    console.error('Error deleting column:', error);
    throw error;
  }
}

export async function getColumnsOrder(): Promise<string[]> {
  try {
    const db = await getDatabase();
    const settings = await db.settings.findOne('1').exec();
    if (settings) {
      const data = settings.toJSON();
      return data.table?.columnOrder || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting columns order:', error);
    return [];
  }
}

export async function updateColumnsOrder(order: string[]): Promise<void> {
  try {
    const db = await getDatabase();
    const settings = await db.settings.findOne('1').exec();
    if (settings) {
      await settings.update({
        $set: {
          'table.columnOrder': order,
        },
      });
    }
  } catch (error) {
    console.error('Error updating columns order:', error);
    throw error;
  }
}
