import React from 'react';
import ToggleSwitch from '../ToggleSwitch';
import SettingsTemplate from '../SettingsTemplate';

interface TableSettings {
  showSummaryRow: boolean;
}

interface TableSectionProps {
  settings: TableSettings;
  onTableChange: (changes: Partial<TableSettings>) => void;
}

export default function TableSection({
  settings,
  onTableChange,
}: TableSectionProps): React.ReactElement {
  return (
    <SettingsTemplate title="Table Settings">
      <div className="flex items-center justify-between">
        <span className={`text-sm text-textTableValues`}>Show Summary Row</span>
        <ToggleSwitch
          checked={settings.showSummaryRow}
          onChange={(checked) => onTableChange({ showSummaryRow: checked })}
        />
      </div>
    </SettingsTemplate>
  );
}
