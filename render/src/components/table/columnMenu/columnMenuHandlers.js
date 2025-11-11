// columnMenuHandlers.js

export const handleAddOption = (state, dispatch, column, onChangeOptions) => {
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
      state.doneTags
    );
  }
};

export const handleRemoveOption = (state, dispatch, column, onChangeOptions, option) => {
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

export const handleEditOption = (state, dispatch, column, onChangeOptions, oldOption, newOption) => {
  dispatch({ type: 'EDIT_OPTION', payload: { oldOption, newOption } });
  const isInOptions = state.options.includes(oldOption);
  const isInDoneTags = state.doneTags.includes(oldOption);
  if (isInOptions) {
    const newOptions = state.options.map((opt) =>
      opt === oldOption ? newOption : opt
    );
    const newColors = {
      ...state.optionColors,
      [newOption]: state.optionColors[oldOption],
    };
    delete newColors[oldOption];
    onChangeOptions(column.id, newOptions, newColors, state.doneTags);
  } else if (isInDoneTags) {
    const newDoneTags = state.doneTags.map((tag) =>
      tag === oldOption ? newOption : tag
    );
    const newColors = {
      ...state.optionColors,
      [newOption]: state.optionColors[oldOption],
    };
    delete newColors[oldOption];
    onChangeOptions(column.id, state.options, newColors, newDoneTags);
  }
};

export const handleColorChange = (state, dispatch, column, onChangeOptions, option, color) => {
  dispatch({ type: 'CHANGE_OPTION_COLOR', payload: { option, color } });
  onChangeOptions(
    column.id,
    state.options,
    { ...state.optionColors, [option]: color },
    state.doneTags
  );
};

export const handleSave = async (
  state,
  dispatch,
  column,
  onRename,
  onChangeIcon,
  onChangeDescription,
  onToggleTitleVisibility,
  onChangeOptions,
  onChangeCheckboxColor,
  onChangeWidth,
  onClose
) => {
  dispatch({ type: 'SET_SAVING', payload: true });
  try {
    if (state.name !== column.description) {
      await onRename(column.id, state.name);
    }

    if (state.selectedIcon !== column.emojiIcon) {
      await onChangeIcon(column.id, state.selectedIcon);
    }

    if (state.description !== column.description) {
      await onChangeDescription(column.id, state.description);
    }

    if (state.showTitle !== (column.descriptionVisible !== false)) {
      await onToggleTitleVisibility(column.id, state.showTitle);
    }

    const isMultiOption = [
      'multi-select',
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
        state.doneTags
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

export const handleWidthChange = (dispatch, onChangeWidth, column, e) => {
  const newWidth = e.target.value;
  dispatch({ type: 'SET_WIDTH', payload: newWidth });
  if (onChangeWidth) {
    onChangeWidth(column.id, newWidth);
  }
};