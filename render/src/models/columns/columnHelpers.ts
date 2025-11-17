import { columnService } from '../../services/ColumnService';

/**
 * Column Helper Functions
 * 
 * These are convenience functions that delegate to the ColumnService
 * for serialization and deserialization of column data.
 */

/**
 * Convert JSON column data to BaseColumn instances
 * @deprecated Use columnService.deserializeColumns() directly
 */
export function deserializeColumns(jsonColumns: Record<string, any>[]) {
  return columnService.deserializeColumns(jsonColumns);
}

/**
 * Convert BaseColumn instances to JSON for storage
 * @deprecated Use columnService.serializeColumns() directly
 */
export function serializeColumns(columns: any[]) {
  return columnService.serializeColumns(columns);
}

/**
 * Update a column field and return the updated instance
 * This is a helper for immutable updates in React components
 */
export function updateColumnField(
  column: any,
  field: string,
  value: any
): any {
  const json = column.toJSON();
  json[field] = value;
  return columnService.deserializeColumns([json])[0];
}
