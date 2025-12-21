/**
 * Types for table columns
 * Simple TypeScript interfaces instead of classes
 */

export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type ColumnType =
  | 'days'
  | 'checkbox'
  | 'numberbox'
  | 'text'
  | 'multiselect'
  | 'multicheckbox'
  | 'todo'
  | 'tasktable';

/**
 * Base column structure
 */
export interface BaseColumnData {
  id: string;
  type: ColumnType;
  name: string;
  emojiIcon: string;
  width: number;
  nameVisible: boolean;
  description: string;
}

/**
 * Column with data by days (checkbox, numberbox, text, multiselect, multicheckbox)
 */
export interface DayBasedColumnData extends BaseColumnData {
  type: 'checkbox' | 'numberbox' | 'text' | 'multiselect' | 'multicheckbox';
  days: Record<Day, string>;

  // Optional fields for specific types
  checkboxColor?: string; // For checkbox
  options?: string[]; // For multiselect, multicheckbox
  tagColors?: Record<string, string>; // For multiselect, multicheckbox
}

/**
 * Todo column
 */
export interface TodoColumnData extends BaseColumnData {
  type: 'todo';
  todos: Array<{
    id: string;
    text: string;
    done: boolean;
    day?: Day;
  }>;
  globalTodos: Array<{
    id: string;
    text: string;
    done: boolean;
  }>;
}

/**
 * TaskTable column
 */
export interface TaskTableColumnData extends BaseColumnData {
  type: 'tasktable';
  tasks: Array<{
    id: string;
    name: string;
    days: Record<Day, string>;
  }>;
  doneTags: string[];
  tagColors: Record<string, string>;
}

/**
 * Days column (special column for day names)
 */
export interface DaysColumnData extends BaseColumnData {
  type: 'days';
}

/**
 * Union type for all column types
 */
export type ColumnData =
  | DaysColumnData
  | DayBasedColumnData
  | TodoColumnData
  | TaskTableColumnData;
