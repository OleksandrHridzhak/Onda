import React, { useRef, useEffect } from "react";

import { icons as allIcons, getIconComponent } from "../utils/icons";

export const IconSelector = ({
  selectedIcon,
  setSelectedIcon,
  isIconSectionExpanded,
  setIsIconSectionExpanded,
  icons = allIcons,
  darkMode,
}) => {
  const ref = useRef(null);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsIconSectionExpanded(false);
      }
    };
    if (isIconSectionExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
        className={`w-12 h-12 flex items-center justify-center rounded-xl border ${
          darkMode
            ? "border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800"
            : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
        aria-expanded={isIconSectionExpanded}
        aria-label="Select icon"
      >
        {selectedIcon ? getIconComponent(selectedIcon, 24) : <span className="text-sm">Select</span>}
      </button>

      {isIconSectionExpanded && (
        <div
          className={`absolute top-full w-96 left-0 mt-1 z-50 overflow-y-auto border rounded-lg shadow-lg
            ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}
            flex flex-wrap gap-1`}
          style={{ maxWidth: containerMaxWidth }}
        >
          {icons.map((icon) => (
            <button
              key={icon.name}
              onClick={() => {
                setSelectedIcon(icon.name);
                setIsIconSectionExpanded(false);
              }}
              className={`flex items-center justify-center rounded-lg
                ${
                  selectedIcon === icon.name
                    ? darkMode
                      ? "bg-gray-700 text-gray-100"
                      : "bg-gray-100 text-gray-900"
                    : darkMode
                      ? "text-gray-100 hover:bg-gray-700"
                      : "text-gray-800 hover:bg-gray-100"
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
