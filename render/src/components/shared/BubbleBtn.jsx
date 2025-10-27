export const BubbleBtn = ({
  children,
  onClick,
  disabled = false,
  variant = 'standard',
}) => {
  const variantClass = {
    standard: 'bg-button-primary-background text-text-on-primary',
    delete: 'bg-button-danger-background text-text-on-primary',
    clear: 'bg-button-secondary-background text-button-secondary-text',
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
