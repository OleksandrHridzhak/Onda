export const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateKey: string): Date => {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);

    d.setDate(diff);
    d.setHours(0, 0, 0, 0);

    return d;
};

export const getWeekDates = (startDate: Date): Date[] => {
    const days: Date[] = [];
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return days;
};

export const getWeekStartKey = (date: Date): string => {
    return formatDateKey(getMonday(date));
};

export const getWeekNumber = (date: Date): number => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    normalizedDate.setDate(
        normalizedDate.getDate() + 3 - ((normalizedDate.getDay() + 6) % 7),
    );

    const firstWeek = new Date(normalizedDate.getFullYear(), 0, 4);

    return Math.round(
        ((normalizedDate.getTime() - firstWeek.getTime()) / 86400000 + 1) / 7,
    );
};
