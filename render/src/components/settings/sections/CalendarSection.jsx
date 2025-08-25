import ToggleSwitch from '../ToggleSwitch';
import { useSelector } from 'react-redux';
import SettingsTemplate from '../SettingsTemplate';

export default function CalendarSection({ settings, onCalendarChange }) {
  const {theme} = useSelector((state) => state.theme);
  
  return (
    <SettingsTemplate title="Calendar Settings">
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm text-gray-400`}>
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