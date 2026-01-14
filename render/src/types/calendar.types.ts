export interface CalendarEntry {
    id: number;
    title: string;
    color: string;
    date: string;
    startTime: string;
    endTime: string;
    repeatDays: string[];
    repeatFrequency: 'daily' | 'weekly' | null;
}
