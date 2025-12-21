import React, { useState } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import SettingsTemplate from '../SettingsTemplate';
import { BubbleBtn } from '../../shared/BubbleBtn';
import { exportData, importData } from '../../../services/indexedDB';
import { clearAllData } from '../../../services/dbMigration';
import { ConfirmModal } from '../../shared/ConfirmModal';

export default function DataSection(): React.ReactElement {
  const [status, setStatus] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);

  const handleExportData = async (): Promise<void> => {
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

  const handleImportData = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setStatus('Importing...');

      const reader = new FileReader();
      reader.onload = async (e): Promise<void> => {
        try {
          const result = e.target?.result;
          if (typeof result !== 'string') return;

          const data = JSON.parse(result);
          const importResult = await importData(data);

          if (importResult.status === 'success') {
            setStatus('✅ Import successful! Reloading...');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            setStatus(`❌ Import failed: ${importResult.message}`);
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

  const handleClearAllData = async (): Promise<void> => {
    try {
      setShowClearModal(false);

      const result = await clearAllData();

      if (result.status === 'success') {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error clearing data:', error);
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
            onClick={() => document.getElementById('import-file')?.click()}
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

      <div className="flex flex-col gap-2 mt-6">
        <span className={`text-sm text-textTableValues`}>Danger Zone</span>
        <div className="flex flex-row gap-2">
          <BubbleBtn onClick={() => setShowClearModal(true)} variant="delete">
            <Trash2 className="w-4 h-4 mr-3" />
            Clear All Data
          </BubbleBtn>
        </div>
      </div>

      {showClearModal && (
        <ConfirmModal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          onConfirm={handleClearAllData}
          title="Clear All Data?"
          message="This will permanently delete all your columns, tasks, calendar events, and settings. This action cannot be undone. Are you sure?"
          confirmText="Yes, Clear Everything"
          cancelText="Cancel"
        />
      )}
    </SettingsTemplate>
  );
}
