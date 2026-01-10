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
    return docs.map((doc) => doc.toJSON());
  } catch (error) {
    console.error('Error getting all columns:', error);
    return [];
  }
}

export async function getColumn(id: string): Promise<ColumnDocument | null> {
  try {
    const db = await getDatabase();
    const doc = await db.columns.findOne({
      selector: {
        _id: id
      }
    }).exec();
    return doc ? doc.toJSON() : null;
  } catch (error) {
    console.error('Error getting column:', error);
    return null;
  }
}

export async function addColumn(column: any): Promise<any> {
  try {
    const db = await getDatabase();
    await db.columns.upsert({
      _id: column.id,
      ...column,
    });
    return { status: true, data: column };
  } catch (error) {
    console.error('Error adding column:', error);
    return { status: false, message: (error as Error).message };
  }
}

export async function updateColumn(column: any): Promise<void> {
  try {
    const db = await getDatabase();
    await db.columns.upsert({
      _id: column.id,
      ...column,
    });
  } catch (error) {
    console.error('Error updating column:', error);
    throw error;
  }
}

export async function deleteColumn(id: string): Promise<void> {
  try {
    const db = await getDatabase();
    const doc = await db.columns.findOne({
      selector: {
        _id: id
      }
    }).exec();
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
    const settings = await db.settings.findOne({
      selector: {
        _id: '1'
      }
    }).exec();
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
    const settings = await db.settings.findOne({
      selector: {
        _id: '1'
      }
    }).exec();
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
