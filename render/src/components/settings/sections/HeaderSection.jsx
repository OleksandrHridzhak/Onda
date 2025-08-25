import { useSelector } from 'react-redux';
import SettingsTemplate from '../SettingsTemplate';

export default function HeaderSection({ settings, onHeaderChange}) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <SettingsTemplate title={'Header Layout'}>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${theme.textTableValues}`}>
            Layout
          </span>
          <select
            value={settings.header.layout}
            onChange={(e) => onHeaderChange({ layout: e.target.value })}
            className={`block w-40 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${theme.border} ${theme.background} ${theme.textTableValues}`}
          >
            <option value="default">Default</option>
            <option value="withWidget">With Widget</option>
            <option value="bothWidgets">Both widgets</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>
    </SettingsTemplate>
  );
}