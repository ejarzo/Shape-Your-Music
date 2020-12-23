import React, { createContext, useState } from 'react';
import cx from 'classnames';
import { THEMES } from 'utils/color';

export const ColorThemeContext = createContext({
  theme: THEMES.LIGHT,
  setTheme: () => {},
});

export const ColorThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.LIGHT);
  const isDarkMode = theme === THEMES.DARK;
  return (
    <ColorThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      <div className={cx({ 'theme--dark': isDarkMode })}>{children}</div>
    </ColorThemeContext.Provider>
  );
};
