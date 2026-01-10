/**
 * Columns Order Schema for RxDB
 *
 * Stores the order of columns in the table as a single document.
 */

// Columns order type definition
export interface ColumnsOrder {
  id: string;
  columnIds: string[];
  updatedAt: number;
}

export type ColumnsOrderDocument = ColumnsOrder & {
  toJSON: () => ColumnsOrder;
};
export type ColumnsOrderCollection = any;

export const columnsOrderSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    columnIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    updatedAt: {
      type: 'number',
    },
  },
  required: ['id', 'columnIds', 'updatedAt'],
} as const;
