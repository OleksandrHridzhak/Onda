export const handleTagChange = (tag, selectedTags, setSelectedTags, onChange) => {
  setSelectedTags((prevTags) => {
    const updatedTags = prevTags.includes(tag)
      ? prevTags.filter((t) => t !== tag)
      : [...prevTags, tag];
    onChange(updatedTags.join(', '));
    return updatedTags;
  });
};
