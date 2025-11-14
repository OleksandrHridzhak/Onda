import { useSelector } from 'react-redux';
import { getCheckBoxColorOptions } from '../../../../utils/colorOptions';

export const useCheckboxColor = (color) => {
  const { mode } = useSelector((state) => state.theme);
  const darkMode = mode === 'dark';
  const colorOptions = getCheckBoxColorOptions({ darkMode });
  
  return colorOptions[color] || colorOptions.green;
};
