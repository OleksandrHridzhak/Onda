// columnMenuReducer.js
export const initialState = (column) => ({
  name: column.description,
  selectedIcon: column.emojiIcon || '',
  description: column.description || '',
  showTitle: column.descriptionVisible !== false,
  options: column.options || [],
  doneTags: column.doneTags || [],
  optionColors: column.tagColors || {},
  checkboxColor: column.checkboxColor || 'green',
  newOption: '',
  Chosen: column.Chosen,
  width: column.width ? parseInt(column.width) : '',
  isIconSectionExpanded: false,
  isColorMenuOpen: {},
  isSaving: false,
});

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_SELECTED_ICON':
      return {
        ...state,
        selectedIcon: action.payload,
        isIconSectionExpanded: false,
      };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_SHOW_TITLE':
      return { ...state, showTitle: action.payload };
    case 'SET_NEW_OPTION':
      return { ...state, newOption: action.payload };
    case 'SET_WIDTH':
      return { ...state, width: action.payload };
    case 'TOGGLE_ICON_SECTION':
      return { ...state, isIconSectionExpanded: !state.isIconSectionExpanded };
    case 'TOGGLE_COLOR_MENU':
      return {
        ...state,
        isColorMenuOpen: {
          ...state.isColorMenuOpen,
          [action.payload]: !state.isColorMenuOpen[action.payload],
        },
      };
    case 'SET_CHECKBOX_COLOR':
      return {
        ...state,
        checkboxColor: action.payload,
        isColorMenuOpen: { ...state.isColorMenuOpen, checkbox: false },
      };
    case 'ADD_OPTION':
      if (
        state.newOption.trim() &&
        !state.options.includes(state.newOption.trim()) &&
        !state.doneTags.includes(state.newOption.trim())
      ) {
        const newOptions = [...state.options, state.newOption.trim()];
        const newColors = {
          ...state.optionColors,
          [state.newOption.trim()]: 'blue',
        };
        return {
          ...state,
          options: newOptions,
          optionColors: newColors,
          newOption: '',
        };
      }
      return state;
    case 'REMOVE_OPTION':
      const isInOptions = state.options.includes(action.payload);
      const isInDoneTags = state.doneTags.includes(action.payload);
      if (isInOptions) {
        console.log('U USED REMOVE OPTION REDUCER');
        const newOptions = state.options.filter(
          (opt) => opt !== action.payload
        );
        const newColors = { ...state.optionColors };
        delete newColors[action.payload];
        return { ...state, options: newOptions, optionColors: newColors };
      } else if (isInDoneTags) {
        const newDoneTags = state.doneTags.filter(
          (tag) => tag !== action.payload
        );
        const newColors = { ...state.optionColors };
        delete newColors[action.payload];
        return { ...state, doneTags: newDoneTags, optionColors: newColors };
      }
      return state;
    case 'EDIT_OPTION':
      const { oldOption, newOption } = action.payload;
      const isInOptionsEdit = state.options.includes(oldOption);
      const isInDoneTagsEdit = state.doneTags.includes(oldOption);
      if (isInOptionsEdit) {
        const newOptions = state.options.map((opt) =>
          opt === oldOption ? newOption : opt
        );
        const newColors = {
          ...state.optionColors,
          [newOption]: state.optionColors[oldOption],
        };
        delete newColors[oldOption];
        return { ...state, options: newOptions, optionColors: newColors };
      } else if (isInDoneTagsEdit) {
        const newDoneTags = state.doneTags.map((tag) =>
          tag === oldOption ? newOption : tag
        );
        const newColors = {
          ...state.optionColors,
          [newOption]: state.optionColors[oldOption],
        };
        delete newColors[oldOption];
        return { ...state, doneTags: newDoneTags, optionColors: newColors };
      }
      return state;
    case 'CHANGE_OPTION_COLOR':
      const { option, color } = action.payload;
      return {
        ...state,
        optionColors: { ...state.optionColors, [option]: color },
      };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'RESET':
      return initialState(action.payload);
    default:
      return state;
  }
};
