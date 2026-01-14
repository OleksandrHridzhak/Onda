/**
 *  Global interfaces
 */

import { CalendarEntry } from '../../types/calendar.types';
import { Column } from '../../types/newColumn.types';
import { Setting } from '../../types/settings.types';

/**
 * Interface for the export format
 */
export interface ExportData {
    calendar: CalendarEntry[];
    settings: Setting[];
    columns: Column[];
    exportDate: string;
    version: number;
}
