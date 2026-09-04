import type { CalendarEntry } from "@onda/shared";
import type { ColorName } from "shared/lib/color";

export type { CalendarEntry };

export type CalendarViewMode = "week" | "day";

export interface EventFormData {
  id?: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color: ColorName;
  isRepeating: boolean;
  repeatDays: number[];
  repeatFrequency: "daily" | "weekly" | "biweekly";
}
