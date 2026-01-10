/**
 * Calendar Event Schema for RxDB
 *
 * Stores calendar events with their time, repetition, and display settings.
 */

// Calendar event type definition
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  isRepeating: boolean;
  repeatDays: number[];
  repeatFrequency: string;
  updatedAt: number;
}

export type CalendarEventDocument = CalendarEvent & {
  toJSON: () => CalendarEvent;
};
export type CalendarEventCollection = any;

export const calendarEventSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    title: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    startTime: {
      type: 'string',
    },
    endTime: {
      type: 'string',
    },
    color: {
      type: 'string',
    },
    isRepeating: {
      type: 'boolean',
    },
    repeatDays: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    repeatFrequency: {
      type: 'string',
    },
    updatedAt: {
      type: 'number',
    },
  },
  required: [
    'id',
    'title',
    'date',
    'startTime',
    'endTime',
    'color',
    'isRepeating',
    'repeatDays',
    'repeatFrequency',
    'updatedAt',
  ],
} as const;
