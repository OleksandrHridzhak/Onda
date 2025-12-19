export const handleTagChange = (
  tag: string,
  selectedTags: string[],
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>,
  onChange: (value: string) => void,
): void => {
  setSelectedTags((prevTags) => {
    const updatedTags = prevTags.includes(tag)
      ? prevTags.filter((t) => t !== tag)
      : [...prevTags, tag];
    onChange(updatedTags.join(', '));
    return updatedTags;
  });
};
