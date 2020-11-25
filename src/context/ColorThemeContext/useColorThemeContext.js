import { useContext } from 'react';

import { ColorThemeContext } from './ColorThemeContextProvider';

export const useColorThemeContext = () => {
  const colorThemeContext = useContext(ColorThemeContext);
  return colorThemeContext;
};
