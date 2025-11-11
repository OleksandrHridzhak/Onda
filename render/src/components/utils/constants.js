import { Home, Calendar1, Settings } from 'lucide-react';

// Navigation items for sidebar
export const sideBarItems = [
  { name: 'home', icon: Home, path: '/' },
  { name: 'calendar', icon: Calendar1, path: '/calendar' },
  { name: 'settings', icon: Settings, path: '/settings' },
];

// Column width constraints
export const COLUMN_WIDTH_MIN = 50;
export const COLUMN_WIDTH_MAX = 1000;

// Days of the week
export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Default column widths by type
export const DEFAULT_COLUMN_WIDTHS = {
  days: 120,
  checkbox: 50,
  numberbox: 50,
  text: 130,
  todo: 150,
  tasktable: 150,
  'multi-select': 150,
  multicheckbox: 50,
};
