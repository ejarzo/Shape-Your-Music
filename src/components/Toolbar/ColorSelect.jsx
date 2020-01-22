import React, { useState, useRef } from 'react';
import Button from 'components/Button';
import ColorPicker from 'components/ColorPicker';
import styles from './styles.module.css';

function ColorSelect({ activeColor, handleColorChange }) {
  const [isColorPickerOpen, setColorPickerOpen] = useState(false);
  let closeTimer = useRef(false);

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
          <ColorPicker color={activeColor} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
}

export default ColorSelect;
