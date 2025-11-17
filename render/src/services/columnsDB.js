import { columnService } from './ColumnService';

/**
 * Legacy API - Kept for backward compatibility
 * All functions now delegate to the unified ColumnService
 * 
 * @deprecated Use columnService directly instead
 */

/**
 * Get all columns
 * @deprecated Use columnService.getAllColumns() instead
 */
export async function getAllColumns() {
  return columnService.getAllColumns();
}

/**
 * Get column by id
 * @deprecated Use columnService.getColumnById() instead
 */
export async function getColumnById(columnId) {
  return columnService.getColumnById(columnId);
}

/**
 * Add new column
 * @deprecated Use columnService.addColumn() instead
 */
export async function addColumn(columnData) {
  return columnService.addColumn(columnData);
}

/**
 * Update column by id
 * @deprecated Use columnService.updateColumn() instead
 */
export async function updateColumn(columnData) {
  return columnService.updateColumn(columnData);
}

/**
 * Delete column by id
 * @deprecated Use columnService.deleteColumn() instead
 */
export async function deleteColumn(columnId) {
  return columnService.deleteColumn(columnId);
}

/**
 * Clear all columns (for testing)
 * @deprecated Use columnService.clearAllColumns() instead
 */
export async function clearAllColumns() {
  return columnService.clearAllColumns();
}

/**
 * Migrate columns from legacy weeks.body to separate storage
 * @deprecated Use columnService.migrateColumnsFromWeeks() instead
 */
export async function migrateColumnsFromWeeks() {
  return columnService.migrateColumnsFromWeeks();
}

/**
 * Update column order
 * @deprecated Use columnService.updateColumnsOrder() instead
 */
export async function updateColumnsOrder(columnIds) {
  return columnService.updateColumnsOrder(columnIds);
}

/**
 * Get column order
 * @deprecated Use columnService.getColumnsOrder() instead
 */
export async function getColumnsOrder() {
  return columnService.getColumnsOrder();
}
