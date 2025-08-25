import { Download, Upload } from 'lucide-react';
import SettingsTemplate from '../SettingsTemplate';
import { useSelector } from 'react-redux';
import { BubbleBtn } from '../../shared/BubbleBtn';

export default function DataSection() {
  const { theme } = useSelector((state) => state.theme);
  const handleExportData = async () => {
    try {
      const data = await window.electronAPI.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `onda-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleImportData = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          await window.electronAPI.importData(data);
          window.location.reload();
        } catch (error) {
          console.error('Error parsing imported data:', error);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing data:', error);
    }
  };

  return (
    <SettingsTemplate title="Data Management">
      <div className="flex flex-col gap-2">
        <span className={`text-sm ${theme.textTableValues}`}>
          Export Data / Import Data
        </span>
        <div className="flex flex-row  gap-2">
          <BubbleBtn onClick={handleExportData}>
            <Upload className="w-4 h-4  mr-3" />
            Export All Data
          </BubbleBtn>
          <BubbleBtn onClick={handleImportData}>
            <Download className="w-4 h-4  mr-3" />
            Import Data
          </BubbleBtn>
        </div>
      </div>
    </SettingsTemplate>
  );
}
