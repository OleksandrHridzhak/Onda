export const BubbleBtn = ({
  children,
  onClick,
  disabled = false,
  variant = 'standard',
}) => {
  const variantClass = {
    standard: 'bg-primaryColor text-white',
    delete: 'bg-bubbleBtnDelete text-white',
    clear: 'bg-bubbleBtnClear text-bubbleBtnClearText',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`items-center flex px-4 py-2.5 text-sm rounded-xl transition ${variantClass[variant]}`}
    >
      {children}
    </button>
  );
};
