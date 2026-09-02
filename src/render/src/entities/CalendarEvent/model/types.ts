import type { ColorName } from 'shared/lib/color';

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
