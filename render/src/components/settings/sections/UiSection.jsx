import ToggleSwitch from '../ToggleSwitch';

export default function UISection({
  settings,
  onUIChange,
  darkTheme,
  onThemeChange,
  setDarkTheme,
  autoThemeSettings,
  onAutoThemeChange,
}) {
  return (
    <div className="space-y-6">
      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>
          Interface Settings
        </h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              Dark Theme
            </span>
            <ToggleSwitch
              checked={settings.theme.darkMode}
              onChange={(checked) => {
                onThemeChange({ darkMode: checked });
                setDarkTheme(checked);
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              Auto Theme Switcher
            </span>
            <ToggleSwitch
              checked={autoThemeSettings.enabled}
              onChange={(checked) => onAutoThemeChange({ enabled: checked })}
            />
          </div>

          {autoThemeSettings.enabled && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                  Start of Day
                </label>
                <input
                  type="time"
                  value={autoThemeSettings.startTime}
                  onChange={(e) => onAutoThemeChange({ startTime: e.target.value })}
                  className={`w-32 rounded-md text-m px-2 py-1 ${darkTheme ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-600 border border-gray-300'}`}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                  End of Day
                </label>
                <input
                  type="time"
                  value={autoThemeSettings.endTime}
                  onChange={(e) => onAutoThemeChange({ endTime: e.target.value })}
                  className={`w-32 rounded-md text-m px-2 py-1 ${darkTheme ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-600 border border-gray-300'}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}