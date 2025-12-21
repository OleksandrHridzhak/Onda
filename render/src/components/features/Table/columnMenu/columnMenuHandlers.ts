// columnMenuHandlers.ts

interface State {
  newOption: string;
  options: string[];
  doneTags: string[];
  optionColors: Record<string, string>;
  name: string;
  selectedIcon: string;
  description: string;
  showTitle: boolean;
  checkboxColor: string;
  width: number;
}

interface Column {
  id: string;
  name: string;
  emojiIcon?: string;
  description?: string;
  nameVisible?: boolean;
  type: string;
  options?: string[];
  tagColors?: Record<string, string>;
  doneTags?: string[];
  checkboxColor?: string;
  width?: number;
}

type Action =
  | { type: 'ADD_OPTION' }
  | { type: 'REMOVE_OPTION'; payload: string }
  | { type: 'EDIT_OPTION'; payload: { oldOption: string; newOption: string } }
  | { type: 'CHANGE_OPTION_COLOR'; payload: { option: string; color: string } }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_WIDTH'; payload: number };

export const handleAddOption = (
  state: State,
  dispatch: React.Dispatch<Action>,
  column: Column,
  onChangeOptions: (
    id: string,
    options: string[],
    colors: Record<string, string>,
    doneTags: string[],
  ) => void,
): void => {
  dispatch({ type: 'ADD_OPTION' });
  if (
    state.newOption.trim() &&
    !state.options.includes(state.newOption.trim()) &&
    !state.doneTags.includes(state.newOption.trim())
  ) {
    onChangeOptions(
      column.id,
      [...state.options, state.newOption.trim()],
      { ...state.optionColors, [state.newOption.trim()]: 'blue' },
      state.doneTags,
    );
  }
};

export const handleRemoveOption = (
  state: State,
  dispatch: React.Dispatch<Action>,
  column: Column,
  onChangeOptions: (
    id: string,
    options: string[],
    colors: Record<string, string>,
    doneTags: string[],
  ) => void,
  option: string,
): void => {
  dispatch({ type: 'REMOVE_OPTION', payload: option });
  const isInOptions = state.options.includes(option);
  const isInDoneTags = state.doneTags.includes(option);
  if (isInOptions) {
    const newOptions = state.options.filter((opt) => opt !== option);
    const newColors = { ...state.optionColors };
    delete newColors[option];
    onChangeOptions(column.id, newOptions, newColors, state.doneTags);
  } else if (isInDoneTags) {
    const newDoneTags = state.doneTags.filter((tag) => tag !== option);
    const newColors = { ...state.optionColors };
    delete newColors[option];
    onChangeOptions(column.id, state.options, newColors, newDoneTags);
  }
};

export const handleEditOption = (
  state: State,
  dispatch: React.Dispatch<Action>,
  column: Column,
  onChangeOptions: (
    id: string,
    options: string[],
    colors: Record<string, string>,
    doneTags: string[],
  ) => void,
  oldOption: string,
  newOption: string,
): void => {
  dispatch({ type: 'EDIT_OPTION', payload: { oldOption, newOption } });
  const isInOptions = state.options.includes(oldOption);
  const isInDoneTags = state.doneTags.includes(oldOption);
  if (isInOptions) {
    const newOptions = state.options.map((opt) =>
      opt === oldOption ? newOption : opt,
    );
    const newColors = {
      ...state.optionColors,
      [newOption]: state.optionColors[oldOption],
    };
    delete newColors[oldOption];
    onChangeOptions(column.id, newOptions, newColors, state.doneTags);
  } else if (isInDoneTags) {
    const newDoneTags = state.doneTags.map((tag) =>
      tag === oldOption ? newOption : tag,
    );
    const newColors = {
      ...state.optionColors,
      [newOption]: state.optionColors[oldOption],
    };
    delete newColors[oldOption];
    onChangeOptions(column.id, state.options, newColors, newDoneTags);
  }
};

export const handleColorChange = (
  state: State,
  dispatch: React.Dispatch<Action>,
  column: Column,
  onChangeOptions: (
    id: string,
    options: string[],
    colors: Record<string, string>,
    doneTags: string[],
  ) => void,
  option: string,
  color: string,
): void => {
  dispatch({ type: 'CHANGE_OPTION_COLOR', payload: { option, color } });
  onChangeOptions(
    column.id,
    state.options,
    { ...state.optionColors, [option]: color },
    state.doneTags,
  );
};

export const handleSave = async (
  state: State,
  dispatch: React.Dispatch<Action>,
  column: Column,
  onRename: (id: string, name: string) => void | Promise<void>,
  onChangeIcon: (id: string, icon: string) => void | Promise<void>,
  onChangeDescription: (
    id: string,
    description: string,
  ) => void | Promise<void>,
  onToggleTitleVisibility: (
    id: string,
    visible: boolean,
  ) => void | Promise<void>,
  onChangeOptions: (
    id: string,
    options: string[],
    colors: Record<string, string>,
    doneTags: string[],
  ) => void | Promise<void>,
  onChangeCheckboxColor: (id: string, color: string) => void | Promise<void>,
  onChangeWidth:
    | ((id: string, width: number) => void | Promise<void>)
    | undefined,
  onClose: () => void,
): Promise<void> => {
  dispatch({ type: 'SET_SAVING', payload: true });
  try {
    if (state.name !== column.name) {
      await onRename(column.id, state.name);
    }

    if (state.selectedIcon !== column.emojiIcon) {
      await onChangeIcon(column.id, state.selectedIcon);
    }

    if (state.description !== column.description) {
      await onChangeDescription(column.id, state.description);
    }

    if (state.showTitle !== (column.nameVisible !== false)) {
      await onToggleTitleVisibility(column.id, state.showTitle);
    }

    const isMultiOption = [
      'multiselect',
      'todo',
      'multicheckbox',
      'tasktable',
    ].includes(column.type);
    const optionsChanged =
      JSON.stringify(state.options) !== JSON.stringify(column.options) ||
      JSON.stringify(state.optionColors) !== JSON.stringify(column.tagColors) ||
      JSON.stringify(state.doneTags) !== JSON.stringify(column.doneTags);

    if (isMultiOption && optionsChanged) {
      await onChangeOptions(
        column.id,
        state.options,
        state.optionColors,
        state.doneTags,
      );
    }

    if (
      column.type === 'checkbox' &&
      state.checkboxColor !== column.checkboxColor
    ) {
      await onChangeCheckboxColor(column.id, state.checkboxColor);
    }

    if (onChangeWidth && state.width !== column.width) {
      await onChangeWidth(column.id, state.width);
    }
  } catch (err) {
    console.error('Error saving column changes:', err);
  } finally {
    dispatch({ type: 'SET_SAVING', payload: false });
    onClose();
  }
};

export const handleWidthChange = (
  dispatch: React.Dispatch<Action>,
  onChangeWidth: ((id: string, width: number) => void) | undefined,
  column: Column,
  e: React.ChangeEvent<HTMLInputElement>,
): void => {
  const newWidth = parseInt(e.target.value, 10);
  dispatch({ type: 'SET_WIDTH', payload: newWidth });
  if (onChangeWidth) {
    onChangeWidth(column.id, newWidth);
  }
};
