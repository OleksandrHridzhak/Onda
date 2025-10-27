import SettingsTemplate from '../SettingsTemplate';

export default function HeaderSection({ settings, onHeaderChange }) {
  return (
    <SettingsTemplate title={'Header Layout'}>
      <div className="flex items-center justify-between">
        <span className={`text-sm text-text-secondary`}>Layout</span>
        <select
          value={settings.header.layout}
          onChange={(e) => onHeaderChange({ layout: e.target.value })}
          className={`block w-40 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 border-ui-border bg-ui-background text-text-secondary`}
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
