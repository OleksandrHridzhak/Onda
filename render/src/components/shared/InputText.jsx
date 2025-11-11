export const InputText = ({
  onChange,
  value,
  darkMode = false,
  placeholder = '',
  width = 'full',
}) => {
  const widthClass = width === 'full' ? 'w-full' : `w-[${width}]`;

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`${widthClass}  px-4 py-2.5 border ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200`}
      placeholder={placeholder}
    />
  );
};
