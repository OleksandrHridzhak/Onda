export const handleToggle = (
  checked: boolean,
  onChange: (value: boolean) => void,
): void => {
  onChange(!checked);
};
