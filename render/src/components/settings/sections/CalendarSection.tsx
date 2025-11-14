import React from 'react';
import ToggleSwitch from '../ToggleSwitch';
import SettingsTemplate from '../SettingsTemplate';

interface CalendarSettings {
  notifications: boolean;
}

interface Settings {
  calendar: CalendarSettings;
}

interface CalendarSectionProps {
  settings: Settings;
  onCalendarChange: (changes: Partial<CalendarSettings>) => void;
}

export default function CalendarSection({
  settings,
  onCalendarChange,
}: CalendarSectionProps): React.ReactElement {
  return (
    <SettingsTemplate title="Calendar Settings">
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-sm text-textTableValues`}>
            Event Notifications
          </span>
          <ToggleSwitch
            checked={settings.calendar.notifications}
            onChange={(checked) => onCalendarChange({ notifications: checked })}
          />
        </div>
      </div>
    </SettingsTemplate>
  );
}
