export interface CalendarEntry {
    id: string;
    title: string;
    color: string;
    date: string;
    startTime: string;
    endTime: string;
    isRepeating?: boolean;
    repeatDays?: number[];
    repeatFrequency?: 'daily' | 'weekly' | 'biweekly' | null;
}
