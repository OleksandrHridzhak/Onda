/**
 * Column Schema for RxDB
 *
 * Stores table columns with their properties and unique data.
 * The uniqueProperties field is flexible to accommodate different column types.
 */

// Column type definition
export interface Column {
  id: string;
  name: string;
  type: string;
  emojiIcon: string;
  nameVisible: boolean;
  width: number;
  description?: string;
  uniqueProperties: Record<string, unknown>;
  updatedAt: number;
}

export type ColumnDocument = Column & { toJSON: () => Column };
export type ColumnCollection = any;

export const columnSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    emojiIcon: {
      type: 'string',
    },
    nameVisible: {
      type: 'boolean',
    },
    width: {
      type: 'number',
    },
    description: {
      type: 'string',
    },
    uniqueProperties: {
      type: 'object',
      additionalProperties: true,
    },
    updatedAt: {
      type: 'number',
    },
  },
  required: [
    'id',
    'name',
    'type',
    'emojiIcon',
    'nameVisible',
    'width',
    'uniqueProperties',
    'updatedAt',
  ],
} as const;
