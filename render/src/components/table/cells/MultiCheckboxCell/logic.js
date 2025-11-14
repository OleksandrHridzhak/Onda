export const getColorForOption = (option, index, tagColors, colorOrder) => {
  if (tagColors[option]) return tagColors[option];
  return colorOrder[index % colorOrder.length];
};

export const handleOptionChange = (option, selectedOptions, setSelectedOptions, onChange) => {
  setSelectedOptions((prevOptions) => {
    const updatedOptions = prevOptions.includes(option)
      ? prevOptions.filter((opt) => opt !== option)
      : [...prevOptions, option];
    onChange(updatedOptions.join(', '));
    return updatedOptions;
  });
};
