import ToggleSwitch from '../ToggleSwitch';

export default function CalendarSection({ settings, onCalendarChange, darkTheme }) {
  return (
    <div className="space-y-6">
      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>
          Calendar Settings
        </h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              Event Notifications
            </span>
            <ToggleSwitch
              checked={settings.calendar.notifications}
              onChange={(checked) => onCalendarChange({ notifications: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}