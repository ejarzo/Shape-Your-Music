import { useColorThemeContext } from 'context/ColorThemeContext/useColorThemeContext';
import React from 'react';
import { appColors } from 'utils/color';

function PageContainer({ children, style }) {
  const { isDarkMode } = useColorThemeContext();
  return (
    <div
      style={{
        flex: 1,
        background: isDarkMode && appColors.black,
        ...style,
        color: isDarkMode && appColors.grayLightest,
      }}
    >
      <div style={{ padding: '40px 15px', maxWidth: 1000, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
