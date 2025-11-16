import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function ToggleSwitch({
  checked,
  onChange,
}: ToggleSwitchProps): React.ReactElement {
  return (
    <label className="relative inline-flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primaryColor transition-all duration-300 ease-in-out peer-focus:ring-2 peer-focus:ring-primaryColor peer-focus:ring-offset-2 shadow-sm" />
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out peer-checked:translate-x-5 group-hover:scale-110" />
    </label>
  );
}
