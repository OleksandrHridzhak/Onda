export const getColorForOption = (
  option: string,
  index: number,
  tagColors: Record<string, string>,
  colorOrder: string[],
): string => {
  if (tagColors[option]) return tagColors[option];
  return colorOrder[index % colorOrder.length];
};

export const handleOptionChange = (
  option: string,
  selectedOptions: string[],
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>,
  onChange: (value: string) => void,
): void => {
  setSelectedOptions((prevOptions) => {
    const updatedOptions = prevOptions.includes(option)
      ? prevOptions.filter((opt) => opt !== option)
      : [...prevOptions, option];
    onChange(updatedOptions.join(', '));
    return updatedOptions;
  });
};
