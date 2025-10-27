import ToggleSwitch from '../ToggleSwitch';
import SettingsTemplate from '../SettingsTemplate';

export default function TableSection({ settings, onTableChange }) {
  return (
    <SettingsTemplate title="Table Settings">
      <div className="flex items-center justify-between">
        <span className={`text-sm text-text-secondary`}>
          Show Summary Row
        </span>
        <ToggleSwitch
          checked={settings.showSummaryRow}
          onChange={(checked) => onTableChange({ showSummaryRow: checked })}
        />
      </div>
    </SettingsTemplate>
  );
}
