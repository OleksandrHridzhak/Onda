export const handleNumberChange = (
  value: string,
  onChange: (value: string) => void,
): void => {
  onChange(value);
};

export const getInputStyles = () => ({
  MozAppearance: 'textfield' as const,
});
