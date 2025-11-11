import { Download, Upload } from 'lucide-react';
import SettingsTemplate from '../SettingsTemplate';
import { BubbleBtn } from '../../shared/BubbleBtn';
import { exportData, importData } from '../../../services/indexedDB';
import { useState } from 'react';

export default function DataSection() {
  const [status, setStatus] = useState('');

  const handleExportData = async () => {
    try {
      setStatus('Exporting...');
      const data = await exportData();

      // Створюємо файл для скачування
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

      setStatus('✅ Export successful!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      setStatus('❌ Export failed!');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleImportData = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setStatus('Importing...');

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const result = await importData(data);

          if (result.status === 'success') {
            setStatus('✅ Import successful! Reloading...');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            setStatus(`❌ Import failed: ${result.message}`);
            setTimeout(() => setStatus(''), 3000);
          }
        } catch (error) {
          console.error('Error parsing imported data:', error);
          setStatus('❌ Invalid file format!');
          setTimeout(() => setStatus(''), 3000);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing data:', error);
      setStatus('❌ Import failed!');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <SettingsTemplate title="Data Management">
      <div className="flex flex-col gap-2">
        <span className={`text-sm text-textTableValues`}>
          Export Data / Import Data
        </span>
        <div className="flex flex-row gap-2">
          <BubbleBtn onClick={handleExportData}>
            <Upload className="w-4 h-4 mr-3" />
            Export All Data
          </BubbleBtn>

          <BubbleBtn
            onClick={() => document.getElementById('import-file').click()}
          >
            <Download className="w-4 h-4 mr-3" />
            Import Data
          </BubbleBtn>

          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleImportData}
            style={{ display: 'none' }}
          />
        </div>
        {status && (
          <span
            className={`text-sm ${status.includes('✅') ? 'text-green-500' : 'text-red-500'}`}
          >
            {status}
          </span>
        )}
      </div>
    </SettingsTemplate>
  );
}
