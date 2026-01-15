export interface CalendarEntry {
    id: string;
    title: string;
    color: string;
    date: string;
    startTime: string;
    endTime: string;
    repeatDays?: string[];
    repeatFrequency?: 'daily' | 'weekly' | null;
}
