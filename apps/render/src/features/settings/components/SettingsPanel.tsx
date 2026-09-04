import React, { useState, useEffect } from "react";
import { Settings, Download, X, Palette } from "lucide-react";
import { FullCloseSection } from "./sections/FullCloseSection";
import { DataSection } from "./sections/DataSection";
import { ThemeSection } from "./sections/ThemeSection";
import { PageHeader } from "shared/ui/PageHeader";

interface Section {
  id: string;
  name: string;
  icon: React.ReactElement;
  component: React.ReactElement;
}

export function SettingsPanel(): React.ReactElement {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "data";
  });

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  const sections: Section[] = [
    {
      id: "appearance",
      name: "Appearance",
      icon: <Palette className="w-4 h-4" />,
      component: <ThemeSection />,
    },
    {
      id: "data",
      name: "Data",
      icon: <Download className="w-4 h-4" />,
      component: <DataSection />,
    },
    {
      id: "fullClose",
      name: "System",
      icon: <X className="w-4 h-4" />,
      component: <FullCloseSection />,
    },
  ];

  const renderSection = (): React.ReactElement | null =>
    sections.find((s) => s.id === activeSection)?.component || null;

  return (
    <div className="font-poppins flex flex-col h-full custom-scroll bg-background">
      <PageHeader title="Settings" icon={<Settings size={22} />} />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block w-64 border-r border-border p-4">
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
                    ? "bg-backgrundHover text-text"
                    : "text-textMuted"
                }`}
              >
                {section.icon}
                <span className="ml-3">{section.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scroll">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
