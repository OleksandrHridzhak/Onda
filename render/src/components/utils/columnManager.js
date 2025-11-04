import { ColumnFactory } from './columnClasses';

/**
 * Column Manager
 * Provides utilities for managing column instances
 */
export class ColumnManager {
  /**
   * Convert a plain column object to a Column class instance
   */
  static toColumnInstance(columnData) {
    return ColumnFactory.fromJSON(columnData);
  }

  /**
   * Convert an array of plain column objects to Column class instances
   */
  static toColumnInstances(columnsData) {
    return columnsData.map(data => this.toColumnInstance(data)).filter(Boolean);
  }

  /**
   * Convert a Column class instance back to a plain object
   */
  static toPlainObject(columnInstance) {
    if (columnInstance && typeof columnInstance.toJSON === 'function') {
      return columnInstance.toJSON();
    }
    return columnInstance;
  }

  /**
   * Convert an array of Column instances to plain objects
   */
  static toPlainObjects(columnInstances) {
    return columnInstances.map(instance => this.toPlainObject(instance));
  }

  /**
   * Create a new column of the specified type
   */
  static createColumn(type, config = {}) {
    return ColumnFactory.createColumn(type, config);
  }

  /**
   * Validate a column instance
   */
  static validateColumn(columnInstance) {
    if (!columnInstance || typeof columnInstance.validate !== 'function') {
      return false;
    }
    return columnInstance.validate();
  }

  /**
   * Update a column value for a specific day
   */
  static updateColumnValue(columnInstance, day, value) {
    if (columnInstance && typeof columnInstance.updateValue === 'function') {
      columnInstance.updateValue(day, value);
      return true;
    }
    return false;
  }

  /**
   * Get a column value for a specific day
   */
  static getColumnValue(columnInstance, day) {
    if (columnInstance && typeof columnInstance.getValue === 'function') {
      return columnInstance.getValue(day);
    }
    return '';
  }

  /**
   * Clone a column instance
   */
  static cloneColumn(columnInstance) {
    const plainObject = this.toPlainObject(columnInstance);
    return this.toColumnInstance(plainObject);
  }

  /**
   * Merge column configuration with existing column
   */
  static mergeColumnConfig(columnInstance, config) {
    const currentData = this.toPlainObject(columnInstance);
    const mergedData = { ...currentData, ...config };
    return this.toColumnInstance(mergedData);
  }
}

/**
 * Column Utilities
 * Provides additional utility functions for columns
 */
export class ColumnUtils {
  /**
   * Check if a column type supports options
   */
  static supportsOptions(columnType) {
    return ['multi-select', 'multicheckbox', 'todo', 'tasktable'].includes(columnType);
  }

  /**
   * Check if a column type supports tag colors
   */
  static supportsTagColors(columnType) {
    return ['multi-select', 'multicheckbox', 'todo', 'tasktable'].includes(columnType);
  }

  /**
   * Check if a column type supports checkbox color
   */
  static supportsCheckboxColor(columnType) {
    return columnType === 'checkbox';
  }

  /**
   * Check if a column is a global column (not day-specific)
   */
  static isGlobalColumn(columnType) {
    return ['todo', 'tasktable'].includes(columnType);
  }

  /**
   * Get the appropriate cell component for a column type
   */
  static getCellComponentName(columnType) {
    const componentMap = {
      'checkbox': 'CheckboxCell',
      'numberbox': 'NumberCell',
      'multi-select': 'TagsCell',
      'text': 'NotesCell',
      'multicheckbox': 'MultiCheckboxCell',
      'todo': 'TodoCell',
      'tasktable': 'TaskTableCell',
    };
    return componentMap[columnType] || 'NotesCell';
  }

  /**
   * Calculate summary for a column
   */
  static calculateSummary(column, tableData, DAYS) {
    const columnData = ColumnManager.toPlainObject(column);
    
    if (columnData.Type === 'checkbox') {
      return DAYS.reduce(
        (sum, day) => sum + (tableData[day]?.[columnData.ColumnId] ? 1 : 0),
        0
      );
    } else if (columnData.Type === 'numberbox') {
      return DAYS.reduce(
        (sum, day) => sum + (parseFloat(tableData[day]?.[columnData.ColumnId]) || 0),
        0
      );
    } else if (columnData.Type === 'multi-select' || columnData.Type === 'multicheckbox') {
      return DAYS.reduce((sum, day) => {
        const tags = tableData[day]?.[columnData.ColumnId];
        if (typeof tags === 'string' && tags.trim() !== '') {
          return sum + tags.split(', ').filter((tag) => tag.trim() !== '').length;
        }
        return sum;
      }, 0);
    } else if (columnData.Type === 'todo') {
      const todos = columnData.Chosen?.global || [];
      const completed = todos.filter((todo) => todo.completed).length;
      return `${completed}/${todos.length}`;
    } else if (columnData.Type === 'tasktable') {
      return `${columnData.DoneTags?.length || 0}/${(columnData.Options?.length || 0) + (columnData.DoneTags?.length || 0)}`;
    }
    return columnData.Type === 'days' ? '' : '-';
  }

  /**
   * Get default width style for a column
   */
  static getWidthStyle(column) {
    const columnData = ColumnManager.toPlainObject(column);
    
    if (columnData.Type === 'days') {
      return { width: '120px', minWidth: '120px' };
    }
    if (columnData.Type === 'filler') {
      return { width: 'auto', minWidth: '0px' };
    }
    return { 
      width: `${columnData.Width}px`, 
      minWidth: `${columnData.Width}px` 
    };
  }
}

export default { ColumnManager, ColumnUtils };
