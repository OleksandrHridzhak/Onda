import ToggleSwitch from '../ToggleSwitch';
import SettingsTemplate from '../SettingsTemplate';
import { useSelector } from 'react-redux';

export default function TableSection({ settings, onTableChange }) {
  const { theme } = useSelector((state) => state.theme);
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
