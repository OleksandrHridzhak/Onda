import { RxJsonSchema } from 'rxdb';
import { ColumnData } from '../../types/column.types';

export type ColumnDocument = ColumnData & {
  _id: string; // RxDB requires _id as primary key
};

export const columnSchema: RxJsonSchema<ColumnDocument> = {
  version: 0,
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      maxLength: 100,
    },
    id: {
      type: 'string',
    },
    type: {
      type: 'string',
      enum: [
        'days',
        'checkbox',
        'numberbox',
        'text',
        'multiselect',
        'multicheckbox',
        'todo',
        'tasktable',
      ],
    },
    name: {
      type: 'string',
    },
    emojiIcon: {
      type: 'string',
    },
    width: {
      type: 'number',
    },
    nameVisible: {
      type: 'boolean',
    },
    description: {
      type: 'string',
    },
    // Day-based column properties
    days: {
      type: 'object',
    },
    checkboxColor: {
      type: 'string',
    },
    options: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    tagColors: {
      type: 'object',
    },
    // Todo column properties
    todos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
          done: { type: 'boolean' },
          day: { type: 'string' },
        },
      },
    },
    globalTodos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
          done: { type: 'boolean' },
        },
      },
    },
    // TaskTable column properties
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          days: { type: 'object' },
        },
      },
    },
    doneTags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['_id', 'id', 'type', 'name'],
};
