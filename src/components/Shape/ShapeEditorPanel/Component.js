import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Color from 'color';

import CheckboxButton from 'components/CheckboxButton';
import CustomSlider from 'components/Slider';
import Button from 'components/Button';
import styles from './styles.css';

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
  colorsList: PropTypes.array.isRequired,
  colorIndex: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  
  isMuted: PropTypes.bool.isRequired,
  isSoloed: PropTypes.bool.isRequired,
  
  
  // onColorChange: PropTypes.func.isRequired,
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

const Caret = props => (
  <div
    className={cx({
      [styles.tooltipArrow]: true,
      [styles.arrowLeft]: props.caretPosition.isLeft,
      [styles.arrowRight]: !props.caretPosition.isLeft,
    })}
    style={{
      top: props.caretPosition.top,
      borderRightColor: props.caretPosition.isLeft ? props.color : 'transparent',
      borderLeftColor: !props.caretPosition.isLeft ? props.color : 'transparent',
    }}>
  </div>
);

Caret.propTypes = {
  caretPosition: PropTypes.shape({
    top: PropTypes.number,
    isLeft: PropTypes.bool,
  }).isRequired,
  color: PropTypes.string.isRequired,
};

function ShapeEditorPanelComponent (props) {
  const colorString = props.colorsList[props.colorIndex];
  const color = Color(colorString);
  const darkColor = color.darken(0.2).toString();
  const { width, height, top, left } = props.panelStyle;
  return (
    <div
      className={styles.shapeEditorPanel}
      style={{
        width,
        height,
        top,
        left,
        backgroundColor: darkColor,
      }}
    >
      <div className={styles.sliderContainer}>
        <CustomSlider
          color={colorString}
          min={-18}
          max={0}
          value={props.volume}
          onChange={props.onVolumeChange}
        />
      </div>
      <div className={styles.buttonShort}>
        <CheckboxButton
          label="Mute" 
          checked={props.isMuted}
          onChange={props.onMuteChange}
          color={color}
        />
      </div>
      <div className={styles.buttonShort}>
        <CheckboxButton
          label="Solo"
          checked={props.isSoloed}
          onChange={props.onSoloChange}
          color={color}
        />
      </div>
      {/*<button onClick={props.onQuantizeClick}>Quantize</button>*/}
      <Button color={color.toString()}
        onClick={props.onQuantizeFactorChange(2)}>
        {'*2'}
      </Button>
      <Button color={color.toString()}
        onClick={props.onQuantizeFactorChange(0.5)}>
        {'/2'}
      </Button>
      <Button color={color.toString()} onClick={props.onToTopClick}>To Front</Button>
      <Button color={color.toString()} onClick={props.onToBottomClick}>To Back</Button>
      <Button color={color.darken(0.1).toString()} className={styles.deleteButton} onClick={props.onDeleteClick}>Delete</Button>

      <Caret caretPosition={props.caretPosition} color={darkColor} />
    </div>
  );
}

ShapeEditorPanelComponent.propTypes = propTypes;

export default ShapeEditorPanelComponent;
