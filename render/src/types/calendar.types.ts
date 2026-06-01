import type { ColorName } from '../utils/colorOptions';

export interface CalendarEntry {
    id: string;
    title: string;
    color: ColorName;
    date: string;
    startTime: string;
    endTime: string;
    isRepeating?: boolean;
    repeatDays?: number[];
    repeatFrequency?: 'daily' | 'weekly' | 'biweekly' | null;
}
