import { useState, useEffect } from 'react';
import { Settings, LayoutGrid, CalendarDays, Table, Eye, Download } from 'lucide-react';
import TableSection from './sections/TableSection';
import UISection from './sections/UiSection';
import DataSection from './sections/DataSection';
import HeaderSection from './sections/HeaderSection';
import CalendarSection from './sections/CalendarSection';

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
        endTime: '',
      },
    },
    table: {
      columnOrder: [],
      showSummaryRow: false,
      compactMode: false,
      stickyHeader: true,
    },
    ui: {
      animations: true,
      tooltips: true,
      confirmDelete: true,
    },
    header: {
      layout: 'withWidget',
    },
    calendar: {
      notifications: true,
    },
  });

  useEffect(() => {
    window.electronAPI.getSettings().then(({ data }) => {
      setSettings((prev) => ({
        ...prev,
        ...data,
        header: data.header ?? prev.header,
        calendar: data.calendar ?? prev.calendar,
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
      autoThemeSettings: { ...settings.theme.autoThemeSettings, ...newAutoThemeSettings },
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
        return <TableSection settings={settings.table} onTableChange={handleTableChange} darkTheme={darkTheme} />;
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
        return <DataSection darkTheme={darkTheme} />;
      case 'header':
        return <HeaderSection settings={settings} onHeaderChange={handleHeaderChange} darkTheme={darkTheme} />;
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

  return (
    <div className={`font-poppins flex flex-col h-full custom-scroll ${darkTheme ? 'bg-gray-900' : 'bg-white'}`}>
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

        <div className="flex-1 overflow-y-auto p-6">{renderSection()}</div>
      </div>
    </div>
  );
}