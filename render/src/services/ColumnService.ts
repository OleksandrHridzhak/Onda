import { dbPromise } from './indexedDB';
import { BaseColumn, ColumnFactory, createColumn } from '../models/columns';

/**
 * ColumnService - Unified service for all column-related operations
 * 
 * This service provides a single point of access for:
 * - Creating new columns
 * - Reading column data
 * - Updating existing columns
 * - Deleting columns
 * - Managing column order
 * 
 * It handles communication between:
 * - Column class instances (domain models)
 * - IndexedDB (persistence layer)
 * - React components (presentation layer)
 */
export class ColumnService {
  /**
   * Get all columns from the database
   * @returns Promise with array of column data objects
   */
  async getAllColumns(): Promise<Record<string, any>[]> {
    try {
      const db = await dbPromise;
      const columns = await db.getAll('columns');
      console.log('Loaded columns:', columns.length);
      return columns;
    } catch (error) {
      console.error('Error getting columns:', error);
      return [];
    }
  }

  /**
   * Get a single column by ID
   * @param columnId - The unique identifier of the column
   * @returns Promise with column data or null if not found
   */
  async getColumnById(columnId: string): Promise<Record<string, any> | null> {
    try {
      const db = await dbPromise;
      const column = await db.get('columns', columnId);
      return column || null;
    } catch (error) {
      console.error('Error getting column:', error);
      return null;
    }
  }

  /**
   * Add a new column to the database
   * @param columnData - Column data object or BaseColumn instance
   * @returns Promise with operation result
   */
  async addColumn(
    columnData: Record<string, any> | BaseColumn
  ): Promise<{ status: boolean; data?: Record<string, any>; message?: string }> {
    try {
      const db = await dbPromise;

      // Convert BaseColumn instance to JSON if needed
      const data =
        columnData instanceof BaseColumn
          ? columnData.toJSON()
          : columnData;

      // Generate id if not present
      if (!data.id) {
        data.id =
          Date.now().toString() + Math.random().toString(36).substr(2, 9);
      }

      await db.put('columns', data);
      console.log('Column added:', data.id);
      return { status: true, data };
    } catch (error) {
      console.error('Error adding column:', error);
      return {
        status: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update an existing column
   * @param columnData - Column data object or BaseColumn instance (must include id)
   * @returns Promise with boolean indicating success
   */
  async updateColumn(
    columnData: Record<string, any> | BaseColumn
  ): Promise<boolean> {
    try {
      // Convert BaseColumn instance to JSON if needed
      const data =
        columnData instanceof BaseColumn
          ? columnData.toJSON()
          : columnData;

      if (!data.id) {
        throw new Error('Column ID is required for update');
      }

      const db = await dbPromise;
      await db.put('columns', data);
      console.log('Column updated:', data.id);
      return true;
    } catch (error) {
      console.error('Error updating column:', error);
      return false;
    }
  }

  /**
   * Delete a column by ID
   * @param columnId - The unique identifier of the column to delete
   * @returns Promise with operation result
   */
  async deleteColumn(
    columnId: string
  ): Promise<{ status: string; columnId: string; message?: string }> {
    try {
      const db = await dbPromise;
      await db.delete('columns', columnId);
      console.log('Column deleted:', columnId);
      return { status: 'Column deleted', columnId };
    } catch (error) {
      console.error('Error deleting column:', error);
      return {
        status: 'Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        columnId,
      };
    }
  }

  /**
   * Create a new column instance of the specified type
   * @param type - The type of column to create (checkbox, numberbox, text, etc.)
   * @returns A new BaseColumn instance
   */
  createColumn(type: string): BaseColumn {
    return createColumn(type);
  }

  /**
   * Create column instances from JSON data
   * @param jsonColumns - Array of column data objects
   * @returns Array of BaseColumn instances
   */
  deserializeColumns(jsonColumns: Record<string, any>[]): BaseColumn[] {
    return jsonColumns.map((json) => ColumnFactory(json));
  }

  /**
   * Convert column instances to JSON for storage
   * @param columns - Array of BaseColumn instances
   * @returns Array of JSON objects
   */
  serializeColumns(columns: BaseColumn[]): Record<string, any>[] {
    return columns.map((column) => column.toJSON());
  }

  /**
   * Get the saved column order
   * @returns Promise with array of column IDs in order, or null if not set
   */
  async getColumnsOrder(): Promise<string[] | null> {
    try {
      const db = await dbPromise;
      const orderRecord = await db.get('settings', 'columnsOrder');
      return orderRecord?.columnIds || null;
    } catch (error) {
      console.error('Error getting column order:', error);
      return null;
    }
  }

  /**
   * Update the column order
   * @param columnIds - Array of column IDs in the desired order
   * @returns Promise with operation result
   */
  async updateColumnsOrder(
    columnIds: string[]
  ): Promise<{ status: string; message?: string }> {
    try {
      const db = await dbPromise;

      const order = {
        id: 'columnsOrder',
        columnIds: columnIds,
        lastUpdated: new Date().toISOString(),
      };

      await db.put('settings', order);
      console.log('Column order updated');
      return { status: 'Order updated' };
    } catch (error) {
      console.error('Error updating column order:', error);
      return {
        status: 'Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Migrate columns from legacy weeks.body storage to separate columns table
   * This is a one-time migration for existing users
   * @returns Promise with migration result
   */
  async migrateColumnsFromWeeks(): Promise<{
    status: string;
    count?: number;
    message?: string;
  }> {
    try {
      const db = await dbPromise;

      // Check if columns already exist
      const existingColumns = await db.getAll('columns');
      if (existingColumns.length > 0) {
        console.log('Columns already migrated, count:', existingColumns.length);
        return { status: 'Already migrated', count: existingColumns.length };
      }

      // Get old data from weeks
      const tx = db.transaction('weeks', 'readonly');
      const week = await tx.objectStore('weeks').get(1);
      await tx.done;

      if (!week || !week.body || week.body.length === 0) {
        console.log('No data to migrate');
        return { status: 'No data to migrate' };
      }

      // Migrate each column
      let migratedCount = 0;

      for (const oldColumn of week.body) {
        // Convert old fields to new format
        const newColumn: Record<string, any> = {
          id:
            oldColumn.ColumnId ||
            Date.now().toString() + Math.random().toString(36).substr(2, 9),
          type: oldColumn.Type,
          emojiIcon: oldColumn.EmojiIcon,
          width: oldColumn.Width,
          nameVisible:
            oldColumn.NameVisible !== undefined ? oldColumn.NameVisible : true,
          description: oldColumn.Description || '',
        };

        // Convert Chosen to days or tasks depending on type
        if (oldColumn.Chosen) {
          if (oldColumn.Type === 'todo' || oldColumn.Type === 'tasktable') {
            // For todo/tasktable: Chosen.global -> tasks
            if (oldColumn.Chosen.global) {
              newColumn.tasks = oldColumn.Chosen.global;
            }
          } else {
            // For day-based columns: Chosen -> days
            newColumn.days = oldColumn.Chosen;
          }
        }

        // Additional fields
        if (oldColumn.Options) newColumn.options = oldColumn.Options;
        if (oldColumn.TagColors) newColumn.tagColors = oldColumn.TagColors;
        if (oldColumn.CheckboxColor)
          newColumn.checkboxColor = oldColumn.CheckboxColor;
        if (oldColumn.DoneTags) newColumn.doneTags = oldColumn.DoneTags;

        await db.put('columns', newColumn);
        migratedCount++;
      }

      console.log('Migration completed:', migratedCount, 'columns');
      return { status: 'Migration completed', count: migratedCount };
    } catch (error) {
      console.error('Error during migration:', error);
      return {
        status: 'Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Clear all columns (for testing purposes)
   * @returns Promise with operation result
   */
  async clearAllColumns(): Promise<{ status: string; message?: string }> {
    try {
      const db = await dbPromise;
      const tx = db.transaction('columns', 'readwrite');
      await tx.objectStore('columns').clear();
      await tx.done;
      console.log('All columns cleared');
      return { status: 'All columns cleared' };
    } catch (error) {
      console.error('Error clearing columns:', error);
      return {
        status: 'Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export a singleton instance
export const columnService = new ColumnService();
