import { Download, Upload } from 'lucide-react';

export default function DataSection({ darkTheme }) {
  const handleExportData = async () => {
    try {
      const data = await window.electronAPI.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
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
    <div className="space-y-6">
      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>
          Data Management
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              Export Data
            </span>
            <button
              onClick={handleExportData}
              className={`px-4 py-2 text-sm text-white ${darkTheme ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-xl transition-colors flex items-center gap-2 w-fit`}
            >
              <Download className="w-4 h-4" />
              Export All Data
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              Import Data
            </span>
            <label
              className={`px-4 py-2 text-sm text-white ${darkTheme ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-xl transition-colors flex items-center gap-2 w-fit cursor-pointer`}
            >
              <Upload className="w-4 h-4" />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}