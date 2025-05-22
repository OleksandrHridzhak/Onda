import { useState, useEffect } from 'react';
import { Settings, Bell, LayoutGrid, CalendarDays, Monitor, Shield, User, Table, Palette, Eye, Download, Upload } from 'lucide-react';

export default function SettingsDashboard({ darkTheme, setDarkTheme }) {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'table';
  });
  const [settings, setSettings] = useState({
    theme: {
      accentColor: 'blue',
      darkMode: true,
      autoThemeSettings: {
        enabled: false,
        startTime: '',
        endTime: ''
      }
    },
    table: {
      columnOrder: [],
      showSummaryRow: false,
      compactMode: false,
      stickyHeader: true
    },
    ui: {
      animations: true,
      tooltips: true,
      confirmDelete: true
    },
    header: {
      layout: 'withWidget'
    },
    calendar: { 
      notifications: true
    }
  });

  useEffect(() => {
    window.electronAPI.getSettings().then(({ data }) => {
      setSettings(prev => ({
        ...prev,
        ...data,
        header: data.header ?? prev.header,
        calendar: data.calendar ?? prev.calendar
      }));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const sections = [
    { id: 'table', name: 'Table', icon: <Table className="w-4 h-4" /> },
    { id: 'ui', name: 'Interface', icon: <Eye className="w-4 h-4" /> },
    { id: 'data', name: 'Data', icon: <Download className="w-4 h-4" /> },
    { id: 'header', name: 'Header', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'calendar', name: 'Calendar', icon: <CalendarDays className="w-4 h-4" /> },
  ];

  const handleAutoThemeChange = (newAutoThemeSettings) => {
    const updatedTheme = {
      ...settings.theme,
      autoThemeSettings: { ...settings.theme.autoThemeSettings, ...newAutoThemeSettings }
    };
    handleThemeChange(updatedTheme);
  };

  const handleThemeChange = async (newTheme) => {
    const updatedSettings = { ...settings, theme: { ...settings.theme, ...newTheme } };
    setSettings(updatedSettings);
    await window.electronAPI.updateTheme(newTheme);
    if (newTheme.autoThemeSettings?.enabled === true) {
      window.location.reload();
    }
  };

  const handleTableChange = async (newTable) => {
    const updatedSettings = { ...settings, table: { ...settings.table, ...newTable } };
    setSettings(updatedSettings);
    await window.electronAPI.updateTableSettings(newTable);
    window.dispatchEvent(new CustomEvent('table-settings-changed', { detail: newTable }));
  };

  const handleUIChange = async (newUI) => {
    const updatedSettings = { ...settings, ui: { ...settings.ui, ...newUI } };
    setSettings(updatedSettings);
    await window.electronAPI.updateUISettings(newUI);
  };

  const handleHeaderChange = async (newHeader) => {
    const updatedSettings = { ...settings, header: { ...settings.header, ...newHeader } };
    setSettings(updatedSettings);
    await window.electronAPI.updateSettings(updatedSettings);
    window.dispatchEvent(new CustomEvent('header-settings-changed', { detail: newHeader }));
  };

  const handleCalendarChange = async (newCalendar) => {
    const updatedSettings = { ...settings, calendar: { ...settings.calendar, ...newCalendar } };
    setSettings(updatedSettings);
    await window.electronAPI.updateSettings(updatedSettings);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'table':
        return (
          <TableSection
            settings={settings.table}
            onTableChange={handleTableChange}
            darkTheme={darkTheme}
          />
        );
      case 'ui':
        return (
          <UISection
            settings={settings}
            onUIChange={handleUIChange}
            darkTheme={darkTheme}
            onThemeChange={handleThemeChange}
            setDarkTheme={setDarkTheme}
            autoThemeSettings={settings.theme.autoThemeSettings}
            onAutoThemeChange={handleAutoThemeChange}
          />
        );
      case 'data':
        return (
          <DataSection
            darkTheme={darkTheme}
          />
        );
      case 'header':
        return (
          <div className="space-y-6">
            <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
              <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Header Layout</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Layout</span>
                  <select
                    value={settings.header.layout}
                    onChange={(e) => handleHeaderChange({ layout: e.target.value })}
                    className={`block w-40 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${darkTheme ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border-gray-200 bg-white text-gray-600'}`}
                  >
                    <option value="default">Default</option>
                    <option value="withWidget">With Widget</option>
                    <option value="bothWidgets">Both widgets</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <CalendarSection
            settings={settings}
            onCalendarChange={handleCalendarChange}
            darkTheme={darkTheme}
          />
        );
      default:
        return null;
    }
  };

  const TableSection = ({ settings, onTableChange, darkTheme }) => (
    <div className="space-y-6">
      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Table Settings</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Show Summary Row</span>
            <ToggleSwitch 
              checked={settings.showSummaryRow} 
              onChange={(checked) => onTableChange({ showSummaryRow: checked })} 
            />
          </div>
        </div>
      </div>
    </div>
  );

  const UISection = ({ settings, onUIChange, darkTheme, onThemeChange, setDarkTheme, autoThemeSettings, onAutoThemeChange }) => (
    <div className="space-y-6">
      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Interface Settings</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Dark Theme</span>
            <ToggleSwitch 
              checked={settings.theme.darkMode} 
              onChange={(checked) => {
                onThemeChange({ darkMode: checked });
                setDarkTheme(checked);
              }} 
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Auto Theme Switcher</span>
            <ToggleSwitch
              checked={autoThemeSettings.enabled}
              onChange={(checked) => onAutoThemeChange({ enabled: checked })}
            />
          </div>

          {autoThemeSettings.enabled && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Start of Day</label>
                <input
                  type="time"
                  value={autoThemeSettings.startTime}
                  onChange={(e) => onAutoThemeChange({ startTime: e.target.value })}
                  className={`w-32 rounded-md text-m px-2 py-1 ${darkTheme ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-600 border border-gray-300'}`}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>End of Day</label>
                <input
                  type="time"
                  value={autoThemeSettings.endTime}
                  onChange={(e) => onAutoThemeChange({ endTime: e.target.value })}
                  className={`w-32 rounded-md text-m px-2 py-1 ${darkTheme ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-600 border border-gray-300'}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CalendarSection = ({ settings, onCalendarChange, darkTheme }) => (
    <div className="space-y-6">
      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Calendar Settings</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Event Notifications</span>
            <ToggleSwitch 
              checked={settings.calendar.notifications} 
              onChange={(checked) => onCalendarChange({ notifications: checked })} 
            />
          </div>
        </div>
      </div>
    </div>
  );

  const DataSection = ({ darkTheme }) => {
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
          <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Data Management</h3>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col gap-2">
              <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Export Data</span>
              <button
                onClick={handleExportData}
                className={`px-4 py-2 text-sm text-white ${darkTheme ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-xl transition-colors flex items-center gap-2 w-fit`}
              >
                <Download className="w-4 h-4" />
                Export All Data
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Import Data</span>
              <label className={`px-4 py-2 text-sm text-white ${darkTheme ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-xl transition-colors flex items-center gap-2 w-fit cursor-pointer`}>
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
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300 ease-in-out" />
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
    </label>
  );

  return (
    <div className={`font-poppins flex flex-col h-full custom-scroll ${darkTheme ? 'bg-gray-900' : 'bg-white'}`}>
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: ${darkTheme ? 'rgba(55, 65, 81, 0.3)' : 'rgba(241, 241, 241, 0.3)'};
          border-radius: 500px;
          margin: 4px 0;
          transition: background 0.2s ease;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: ${darkTheme ? 'rgba(156, 163, 175, 0.8)' : 'rgba(156, 163, 175, 0.6)'};
          border-radius: 100px;
          border: 2px solid ${darkTheme ? 'rgba(55, 65, 81, 0.3)' : 'rgba(241, 241, 241, 0.3)'};
          transition: background 0.2s ease, border 0.2s ease;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: ${darkTheme ? 'rgba(107, 114, 128, 1)' : 'rgba(107, 114, 128, 0.8)'};
        }
        .custom-scroll::-webkit-scrollbar-thumb:active {
          background: ${darkTheme ? 'rgba(75, 85, 99, 1)' : 'rgba(75, 85, 99, 0.9)'};
        }
        .custom-scroll {
          scrollbar-color: ${
            darkTheme
              ? 'rgba(156, 163, 175, 0.8) rgba(55, 65, 81, 0.3)'
              : 'rgba(156, 163, 175, 0.6) rgba(241, 241, 241, 0.3)'
          };
          scrollbar-width: thin;
        }
      `}</style>

      <div className={`sticky top-0 z-10 ${darkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 py-6`}>
        <h1 className={`text-xl font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'} flex items-center`}>
          <Settings className="w-5 h-5 mr-2" />
          Settings
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-64 border-r ${darkTheme ? 'border-gray-700' : 'border-gray-200'} p-4`}>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeSection === section.id
                    ? darkTheme
                      ? 'bg-gray-700 text-white'
                      : 'bg-blue-50 text-blue-600'
                    : darkTheme
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {section.icon}
                <span className="ml-3">{section.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}