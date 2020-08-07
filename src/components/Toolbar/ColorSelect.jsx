import React, { useState, useRef } from 'react';
import Button from 'components/Button';
import ColorPicker from 'components/ColorPicker';
import styles from './styles.module.css';
import { PROJECT_ACTIONS } from 'utils/project';
import { themeColors } from 'utils/color';
import { useProjectContext } from 'context/useProjectContext';

function ColorSelect() {
  const { activeColorIndex, dispatch } = useProjectContext();
  const [isColorPickerOpen, setColorPickerOpen] = useState(false);
  let closeTimer = useRef(false);
  const activeColor = themeColors[activeColorIndex];

  const handleColorPickerMouseEnter = () => {
    closeTimer && window.clearTimeout(closeTimer);
    setColorPickerOpen(true);
  };

  const handleColorPickerMouseLeave = () => {
    closeTimer = setTimeout(() => setColorPickerOpen(false), 150);
  };

  return (
    <div
      onMouseEnter={handleColorPickerMouseEnter}
      onMouseLeave={handleColorPickerMouseLeave}
      style={{ position: 'relative' }}
    >
      <Button hasBorder color={activeColor} />
      {isColorPickerOpen && (
        <div className={styles.colorPickerWrapper}>
          <ColorPicker
            color={activeColor}
            onChange={({ hex }) => {
              dispatch({ type: PROJECT_ACTIONS.SET_DRAW_COLOR, payload: hex });
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ColorSelect;
