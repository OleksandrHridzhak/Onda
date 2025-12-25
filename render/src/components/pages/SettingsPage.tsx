import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Settings, Download, X } from 'lucide-react';
import FullCloseSection from '../features/Settings/sections/FullCloseSection';
import DataSection from '../features/Settings/sections/DataSection';
import { settingsService } from '../../services/settingsDB';

interface ThemeSettings {
  accentColor: string;
  darkMode: boolean;
  autoThemeSettings: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

interface TableSettings {
  columnOrder: unknown[];
  showSummaryRow: boolean;
  compactMode: boolean;
  stickyHeader: boolean;
}

interface UiSettings {
  animations: boolean;
  tooltips: boolean;
  confirmDelete: boolean;
}

interface HeaderSettings {
  layout: string;
}

interface CalendarSettings {
  notifications: boolean;
}

interface AppSettings {
  theme: ThemeSettings;
  table: TableSettings;
  ui: UiSettings;
  header: HeaderSettings;
  calendar: CalendarSettings;
}

interface RootState {
  newTheme: {
    themeMode: string;
  };
}

interface Section {
  id: string;
  name: string;
  icon: React.ReactElement;
  component: React.ReactElement;
}

export default function SettingsDashboard(): React.ReactElement {
  const { themeMode } = useSelector((state: RootState) => state.newTheme);
  const darkMode = themeMode === 'dark';

  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'table';
  });
  const [settings, setSettings] = useState<AppSettings>({
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
    settingsService
      .getSettings()
      .then(({ data }) => {
        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
            header: data.header ?? prev.header,
            calendar: data.calendar ?? prev.calendar,
          }));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const sections: Section[] = [
    {
      id: 'data',
      name: 'Data',
      icon: <Download className="w-4 h-4" />,
      component: <DataSection />,
    },
    {
      id: 'fullClose',
      name: 'System',
      icon: <X className="w-4 h-4" />,
      component: <FullCloseSection />,
    },
  ];

  const renderSection = (): React.ReactElement | null =>
    sections.find((s) => s.id === activeSection)?.component || null;

  return (
    <div
      className={`font-poppins flex flex-col h-full custom-scroll bg-background`}
    >
      <div
        className={`sticky top-0 z-20 bg-tableBodyBg border-b border-border`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
            <div
              className={`hidden sm:flex p-2 sm:p-3 rounded-2xl bg-hoverBg items-center justify-center`}
            >
              <Settings className="w-5 h-5 text-primaryColor" />
            </div>
            <h1 className="text-lg sm:text-xl font-medium text-text leading-tight truncate">
              Settings
            </h1>
          </div>
        </div>
      </div>

      {/* Mobile sections nav (tabs) - visible only on small screens */}
      <div className="md:hidden bg-tableBodyBg border-b border-border">
        <nav
          role="tablist"
          aria-label="Settings sections"
          className="flex gap-2 overflow-x-auto px-4 py-2"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              role="tab"
              aria-selected={activeSection === section.id}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-settingsSectionSelectorBg text-text'
                  : 'text-textTableValues'
              }`}
            >
              {section.icon}
              <span className="ml-2 text-sm">{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`hidden md:block w-64 border-r border-border p-4`}>
          <nav
            className="space-y-1"
            role="tablist"
            aria-label="Settings sections"
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                role="tab"
                aria-selected={activeSection === section.id}
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

        <div
          className={`flex-1 overflow-y-auto p-4 md:p-6 ${
            darkMode ? 'custom-scroll-y-dark' : 'custom-scroll-y-light'
          }`}
        >
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
