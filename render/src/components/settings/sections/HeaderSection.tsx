import React from 'react';
import SettingsTemplate from '../SettingsTemplate';

interface HeaderSettings {
  layout: string;
}

interface Settings {
  header: HeaderSettings;
}

interface HeaderSectionProps {
  settings: Settings;
  onHeaderChange: (changes: Partial<HeaderSettings>) => void;
}

export default function HeaderSection({
  settings,
  onHeaderChange,
}: HeaderSectionProps): React.ReactElement {
  return (
    <SettingsTemplate title={'Header Layout'}>
      <div className="flex items-center justify-between">
        <span className={`text-sm text-textTableValues`}>Layout</span>
        <select
          value={settings.header.layout}
          onChange={(e) => onHeaderChange({ layout: e.target.value })}
          className={`block w-40 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 border-border bg-background text-textTableValues`}
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
