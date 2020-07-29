import React, { useState, useRef, useContext } from 'react';
import Button from 'components/Button';
import ColorPicker from 'components/ColorPicker';
import styles from './styles.module.css';
import { ProjectContext } from 'components/Project/ProjectContextProvider';
import { ACTIONS } from 'components/Project';
import { themeColors } from 'utils/color';

function ColorSelect() {
  const { activeColorIndex, dispatch } = useContext(ProjectContext);
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
              dispatch({ type: ACTIONS.SET_DRAW_COLOR, payload: hex });
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ColorSelect;
