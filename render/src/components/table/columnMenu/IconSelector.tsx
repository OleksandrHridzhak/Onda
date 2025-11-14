import React, { useRef, useEffect } from 'react';

import { icons as allIcons, getIconComponent, Icon } from '../../utils/icons';

interface IconSelectorProps {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  isIconSectionExpanded: boolean;
  setIsIconSectionExpanded: (expanded: boolean) => void;
  icons?: Icon[];
  darkMode?: boolean;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  setSelectedIcon,
  isIconSectionExpanded,
  setIsIconSectionExpanded,
  icons = allIcons,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsIconSectionExpanded(false);
      }
    };
    if (isIconSectionExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isIconSectionExpanded, setIsIconSectionExpanded]);

  const iconSizePx = 50;
  const gapPx = 4;
  const maxIconsInRow = 7;
  const containerMaxWidth = maxIconsInRow * (iconSizePx + gapPx);

  return (
    <div className="relative mb-4" ref={ref}>
      <button
        onClick={() => setIsIconSectionExpanded(!isIconSectionExpanded)}
        className={`w-12 h-12 flex items-center justify-center rounded-xl border border-border bg-background text-text hover:bg-hoverBg focus:outline-none focus:ring-2 focus:ring-primaryColor transition-all duration-200`}
        aria-expanded={isIconSectionExpanded}
        aria-label="Select icon"
      >
        {selectedIcon ? (
          getIconComponent(selectedIcon, 24)
        ) : (
          <span className="text-sm">Select</span>
        )}
      </button>

      {isIconSectionExpanded && (
        <div
          className={`absolute top-full w-96 left-0 mt-1 z-50 overflow-y-auto border rounded-lg shadow-lg bg-background border-border flex flex-wrap gap-1`}
          style={{ maxWidth: containerMaxWidth }}
        >
          {icons.map((icon) => (
            <button
              key={icon.name}
              onClick={() => {
                setSelectedIcon(icon.name);
                setIsIconSectionExpanded(false);
              }}
              className={`flex items-center justify-center rounded-lg ${
                selectedIcon === icon.name
                  ? 'bg-hoverBg text-text'
                  : 'text-text hover:bg-hoverBg'
              } transition-colors duration-200`}
              aria-label={`Select ${icon.name} icon`}
              type="button"
              style={{ width: `${iconSizePx}px`, height: `${iconSizePx}px` }}
            >
              {getIconComponent(icon.name, 24)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
