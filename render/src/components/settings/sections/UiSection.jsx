import ToggleSwitch from '../ToggleSwitch';
import SettingsTemplate from '../SettingsTemplate';
import { useSelector } from 'react-redux';

export default function UISection({
  settings,
  onThemeChange,
  onAutoThemeChange,
}) {
  const { mode } = useSelector((state) => state.newTheme);
  const darkTheme = mode === 'dark';

  const handleAccentColorChange = (e) => {
    onThemeChange({ accentColor: e.target.value });
  };

  return (
    <SettingsTemplate title="UI Settings">
      <div className="flex items-center justify-between">
        <span className={`text-sm text-textTableValues`}>Dark Theme</span>
        <ToggleSwitch
          checked={settings.theme.darkMode}
          onChange={(checked) => {
            onThemeChange({ darkMode: checked });
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className={`text-sm text-textTableValues`}>Accent Color</span>
        <select
          value={settings.theme.accentColor}
          onChange={handleAccentColorChange}
          className={`w-32 rounded-md text-m px-2 py-1 ${
            darkTheme
              ? 'bg-gray-800 text-gray-200 border border-gray-700'
              : 'bg-white text-gray-600 border border-gray-300'
          }`}
        >
          <option value="standard">Standard</option>
          <option value="forest">Forest</option>
          <option value="ocean">Ocean</option>
        </select>
      </div>
    </SettingsTemplate>
  );
}
