export const InputText = ({
  onChange,
  value,
  placeholder = '',
  width = 'full',
}) => {
  const widthClass = width === 'full' ? 'w-full' : `w-[${width}]`;

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`${widthClass} px-4 py-2.5 border border-ui-border bg-ui-background text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary focus:border-ui-primary text-sm transition-all duration-200`}
      placeholder={placeholder}
    />
  );
};
