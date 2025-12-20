export const startEditing = (
  value: string,
  setIsEditing: (isEditing: boolean) => void,
  setTempValue: (value: string) => void,
): void => {
  setIsEditing(true);
  setTempValue(value);
};
