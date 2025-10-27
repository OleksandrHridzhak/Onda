import ToggleSwitch from '../ToggleSwitch';
import SettingsTemplate from '../SettingsTemplate';

export default function UISection({ settings, onThemeChange, onAutoThemeChange }) {
  const handleAccentColorChange = (e) => {
    onThemeChange({ accentColor: e.target.value });
  };

  return (
    <SettingsTemplate title="UI Settings">
      <div className="flex items-center justify-between">
        <span className={`text-sm text-text-secondary`}>Dark Theme</span>
        <ToggleSwitch
          checked={settings.theme.darkMode}
          onChange={(checked) => {
            onThemeChange({ darkMode: checked });
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className={`text-sm text-text-secondary`}>Accent Color</span>
        <select
          value={settings.theme.accentColor}
          onChange={handleAccentColorChange}
          className={`w-32 rounded-md text-m px-2 py-1 bg-ui-background text-text-secondary border border-ui-border`}
        >
          <option value="standard">Standard</option>
          <option value="forest">Forest</option>
          <option value="ocean">Ocean</option>
        </select>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className={`text-sm text-text-secondary`}>
          Auto Theme Switcher
        </span>
        <ToggleSwitch
          checked={settings.theme.autoThemeSettings.enabled}
          onChange={(checked) => onAutoThemeChange({ enabled: checked })}
        />
      </div>

      {settings.theme.autoThemeSettings.enabled && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className={`text-sm text-text-secondary`}>
              Start of Day
            </label>
            <input
              type="time"
              value={settings.theme.autoThemeSettings.startTime}
              onChange={(e) => onAutoThemeChange({ startTime: e.target.value })}
              className={`w-32 rounded-md text-m px-2 py-1 bg-ui-background text-text-secondary border border-ui-border`}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className={`text-sm text-text-secondary`}>
              End of Day
            </label>
            <input
              type="time"
              value={settings.theme.autoThemeSettings.endTime}
              onChange={(e) => onAutoThemeChange({ endTime: e.target.value })}
              className={`w-32 rounded-md text-m px-2 py-1 bg-ui-background text-text-secondary border border-ui-border`}
            />
          </div>
        </div>
      )}
    </SettingsTemplate>
  );
}
