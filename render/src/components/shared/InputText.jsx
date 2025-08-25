import React from 'react';
import { useCallback } from 'react';
import { debounce } from 'lodash';

export const InputText = ({
  onChange,
  setValue,
  value,
  darkMode,
  label = 'Text',
}) => {
  const debouncedSet = useCallback(
    debounce((value) => setValue(value), 300),
    [setValue]
  );

  return (
    <div className="mb-4">
      <label
        className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}
      >
        Column Name
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => debouncedSet(onChange)}
        className={`w-full px-4 py-2 border ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200`}
        aria-label={label}
        placeholder={label}
      />
    </div>
  );
};
