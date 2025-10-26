import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Settings,
  LayoutGrid,
  CalendarDays,
  Table,
  Eye,
  Download,
} from 'lucide-react';
import TableSection from './sections/TableSection';
import UISection from './sections/UiSection';
import DataSection from './sections/DataSection';
import HeaderSection from './sections/HeaderSection';
import CalendarSection from './sections/CalendarSection';
import { settingsService } from '../../services/settingsDB';

export default function SettingsDashboard() {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'table';
  });
  const [settings, setSettings] = useState({
    theme: {
      accentColor: 'standard',
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
    settingsService.getSettings()
      .then(({ data }) => {
        setSettings((prev) => ({
          ...prev,
          ...data,
          header: data.header ?? prev.header,
          calendar: data.calendar ?? prev.calendar,
        }));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const handleSettingsChange = async (section, newSettings) => {
    const updatedSettings = {
      ...settings,
      [section]:
        section === 'theme' && newSettings.autoThemeSettings
          ? {
              ...settings.theme,
              ...newSettings,
              autoThemeSettings: {
                ...settings.theme.autoThemeSettings,
                ...newSettings.autoThemeSettings,
              },
            }
          : { ...settings[section], ...newSettings },
    };

    setSettings(updatedSettings);

    switch (section) {
      case 'theme':
        await settingsService.updateTheme(updatedSettings.theme);
        if (
          newSettings.darkMode !== undefined ||
          newSettings.accentColor !== undefined ||
          newSettings.autoThemeSettings?.enabled !== undefined
        ) {
          window.location.reload();
        }
        break;
      case 'table':
        await settingsService.updateSettingsSection(newSettings, 'table');
        break;
      case 'ui':
        await settingsService.updateSettingsSection(newSettings, 'ui');
        break;
      case 'header':
        await settingsService.updateSettingsSection(newSettings, 'header');
        break;
      case 'calendar':
        await settingsService.updateSettings(updatedSettings);
        break;
      default:
        break;
    }
  };

  const sections = [
    {
      id: 'table',
      name: 'Table',
      icon: <Table className="w-4 h-4" />,
      component: (
        <TableSection
          settings={settings.table}
          onTableChange={(newTable) => handleSettingsChange('table', newTable)}
        />
      ),
    },
    {
      id: 'ui',
      name: 'Interface',
      icon: <Eye className="w-4 h-4" />,
      component: (
        <UISection
          settings={settings}
          onUIChange={(newUI) => handleSettingsChange('ui', newUI)}
          onThemeChange={(newTheme) => handleSettingsChange('theme', newTheme)}
          onAutoThemeChange={(newAutoThemeSettings) =>
            handleSettingsChange('theme', {
              autoThemeSettings: newAutoThemeSettings,
            })
          }
        />
      ),
    },
    {
      id: 'data',
      name: 'Data',
      icon: <Download className="w-4 h-4" />,
      component: <DataSection />,
    },
    {
      id: 'header',
      name: 'Header',
      icon: <LayoutGrid className="w-4 h-4" />,
      component: (
        <HeaderSection
          settings={settings}
          onHeaderChange={(newHeader) =>
            handleSettingsChange('header', newHeader)
          }
        />
      ),
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: <CalendarDays className="w-4 h-4" />,
      component: (
        <CalendarSection
          settings={settings}
          onCalendarChange={(newCalendar) =>
            handleSettingsChange('calendar', newCalendar)
          }
        />
      ),
    },
  ];

  const renderSection = () =>
    sections.find((s) => s.id === activeSection)?.component || null;

  return (
    <div
      className={`font-poppins flex flex-col h-full custom-scroll bg-background`}
    >
      <div
        className={`sticky top-0 z-10 bg-background border-border border-b px-8 py-6`}
      >
        <h1
          className={`text-xl font-medium text-textTableValues flex items-center`}
        >
          <Settings className="w-5 h-5 mr-2" />
          Settings
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-64 border-r border-border p-4`}>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeSection === section.id
                    ? `bg-settingsSectionSelectorBg text-text`
                    : `text-textTableValues`
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
