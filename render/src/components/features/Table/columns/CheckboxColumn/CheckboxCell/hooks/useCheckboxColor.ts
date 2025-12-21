import { useSelector } from 'react-redux';
import {
  getCheckBoxColorOptions,
  CheckBoxColorOption,
} from '../../../../../../../utils/colorOptions';

interface RootState {
  newTheme: {
    themeMode: string;
  };
}

export const useCheckboxColor = (color: string): CheckBoxColorOption => {
  const { themeMode } = useSelector((state: RootState) => state.newTheme);
  const darkMode = themeMode === 'dark';
  const colorOptions = getCheckBoxColorOptions({ darkMode });

  return colorOptions[color] || colorOptions.green;
};
