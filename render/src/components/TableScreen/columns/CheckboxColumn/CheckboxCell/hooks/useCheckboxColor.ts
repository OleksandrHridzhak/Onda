import { useSelector } from 'react-redux';
import {
  getCheckBoxColorOptions,
  CheckBoxColorOption,
} from '../../../../../utils/colorOptions';

interface RootState {
  theme: {
    mode: string;
  };
}

export const useCheckboxColor = (color: string): CheckBoxColorOption => {
  const { mode } = useSelector((state: RootState) => state.theme);
  const darkMode = mode === 'dark';
  const colorOptions = getCheckBoxColorOptions({ darkMode });

  return colorOptions[color] || colorOptions.green;
};
