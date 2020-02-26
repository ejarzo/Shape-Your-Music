import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { themeColors, getDarker } from 'utils/color';

import CheckboxButton from 'components/CheckboxButton';
import CustomSlider from 'components/Slider';
import Button from 'components/Button';

import ColorPicker from 'components/ColorPicker';

import styles from './styles.module.css';

const propTypes = {
  panelStyle: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
  }),
  caretPosition: PropTypes.shape({
    top: PropTypes.number.isRequired,
    isLeft: PropTypes.bool.isRequired,
  }),
  colorIndex: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,

  isMuted: PropTypes.bool.isRequired,
  isSoloed: PropTypes.bool.isRequired,

  onColorChange: PropTypes.func.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  onMuteChange: PropTypes.func.isRequired,
  onSoloChange: PropTypes.func.isRequired,
  onQuantizeFactorChange: PropTypes.func.isRequired,

  // onQuantizeClick: PropTypes.func.isRequired,
  onToTopClick: PropTypes.func.isRequired,
  onToBottomClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,

  // perimeter: PropTypes.number.isRequired,
};

const Caret = ({ caretPosition, color }) => (
  <div
    className={cx({
      [styles.tooltipArrow]: true,
      [styles.arrowLeft]: caretPosition.isLeft,
      [styles.arrowRight]: !caretPosition.isLeft,
    })}
    style={{
      top: caretPosition.top,
      borderRightColor: caretPosition.isLeft ? color : 'transparent',
      borderLeftColor: !caretPosition.isLeft ? color : 'transparent',
    }}
  />
);

Caret.propTypes = {
  caretPosition: PropTypes.shape({
    top: PropTypes.number,
    isLeft: PropTypes.bool,
  }).isRequired,
  color: PropTypes.string.isRequired,
};

function ShapeEditorPopoverComponent(props) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const {
    volume,
    onVolumeChange,
    isMuted,
    onMuteChange,
    isSoloed,
    onSoloChange,
    onColorChange,
    onQuantizeFactorChange,
    onReverseClick,
    onToTopClick,
    onToBottomClick,
    onDeleteClick,
    onDuplicateClick,
    caretPosition,
    colorIndex,
    panelStyle: { width, height, top, left },
  } = props;
  const colorString = themeColors[colorIndex];
  const darkColor = getDarker(colorString, 0.2);
  const medColor = getDarker(colorString);

  return (
    <div
      className={styles.ShapeEditorPopover}
      style={{
        width,
        height,
        top,
        left,
        backgroundColor: darkColor,
        fontWeight: 'bold',
      }}
    >
      <div className={styles.sliderContainer}>
        <CustomSlider
          color={colorString}
          min={-18}
          max={0}
          value={volume}
          onChange={onVolumeChange}
        />
      </div>
      <div className={styles.buttonShort}>
        <CheckboxButton
          label="Mute"
          checked={isMuted}
          onChange={onMuteChange}
          color={colorString}
        />
      </div>
      <div className={styles.buttonShort}>
        <CheckboxButton
          label="Solo"
          checked={isSoloed}
          onChange={onSoloChange}
          color={colorString}
        />
      </div>
      <div
        className={styles.colorPickerContainer}
        style={{
          backgroundColor: colorString,
          height: isColorPickerOpen ? 61 : 30,
        }}
      >
        <Button
          color={colorString}
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
        >
          Color{' '}
          <i
            className={
              isColorPickerOpen ? 'ion-arrow-up-b' : 'ion-arrow-down-b'
            }
          />
        </Button>
        <ColorPicker
          triangle="hide"
          color={colorString}
          onChange={onColorChange}
        />
      </div>
      {/*<button onClick={onQuantizeClick}>Quantize</button>*/}
      <div className={styles.thirds}>
        <Button color={colorString} onClick={onQuantizeFactorChange(2)}>
          {'*2'}
        </Button>
        <Button color={colorString} onClick={onQuantizeFactorChange(0.5)}>
          {'/2'}
        </Button>
        <Button
          title="Reverse Direction"
          color={colorString}
          onClick={onReverseClick}
        >
          <i className="ion-arrow-swap" />
        </Button>
      </div>
      <Button color={colorString} onClick={onToTopClick}>
        To Front
      </Button>
      <Button color={colorString} onClick={onToBottomClick}>
        To Back
      </Button>
      <Button
        className={styles.duplicateButton}
        color={colorString}
        onClick={onDuplicateClick}
      >
        Duplicate
      </Button>
      <Button
        className={styles.deleteButton}
        color={medColor}
        onClick={onDeleteClick}
      >
        Delete
      </Button>

      <Caret caretPosition={caretPosition} color={darkColor} />
    </div>
  );
}

ShapeEditorPopoverComponent.propTypes = propTypes;

export default ShapeEditorPopoverComponent;
