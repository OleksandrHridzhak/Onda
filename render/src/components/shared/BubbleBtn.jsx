export const BubbleBtn = ({
  children,
  onClick,
  disabled = false,
  variant = 'standard',
}) => {
  const variantClass = {
    standard: 'bg-bubbleBtnStandard hover:bg-bubbleBtnStandardHover text-white',
    delete: 'bg-bubbleBtnDelete hover:bg-bubbleBtnDeleteHover text-white',
    clear: 'bg-bubbleBtnClear hover:bg-bubbleBtnClearHover text-bubbleBtnClearText',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`items-center flex px-4 py-2.5 text-sm rounded-xl transition-colors ${variantClass[variant]}`}
    >
      {children}
    </button>
  );
};
