import { RxJsonSchema } from 'rxdb';

export interface CalendarDocument {
  _id: string; // Always '1' for singleton calendar
  body: Array<{
    id?: string;
    date: string;
    content: string;
    [key: string]: any;
  }>;
}

export const calendarSchema: RxJsonSchema<CalendarDocument> = {
  version: 0,
  primaryKey: '_id',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      maxLength: 10,
    },
    body: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  },
  required: ['_id', 'body'],
};
