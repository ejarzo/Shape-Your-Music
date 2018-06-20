import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ColorUtils } from 'utils/Utils';

import CheckboxButton from 'components/CheckboxButton';
import CustomSlider from 'components/Slider';
import Button from 'components/Button';
import styles from './styles.module.css';
import ColorPicker from 'components/ColorPicker';

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

class ShapeEditorPopoverComponent extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isColorPickerOpen: false,
    };

    this.handleToggleColorPickerClick = this.handleToggleColorPickerClick.bind(this);
  }

  handleToggleColorPickerClick () {
    this.setState({
      isColorPickerOpen: !this.state.isColorPickerOpen
    });
  }

  render () {
    const colorString = this.props.colorsList[this.props.colorIndex];
    const darkColor = ColorUtils.getDarker(colorString, 0.2);
    const medColor = ColorUtils.getDarker(colorString);
    const { width, height, top, left } = this.props.panelStyle;
    return (
      <div
        className={styles.ShapeEditorPopover}
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
            value={this.props.volume}
            onChange={this.props.onVolumeChange}
          />
        </div>
        <div className={styles.buttonShort}>
          <CheckboxButton
            label="Mute" 
            checked={this.props.isMuted}
            onChange={this.props.onMuteChange}
            color={colorString}
          />
        </div>
        <div className={styles.buttonShort}>
          <CheckboxButton
            label="Solo"
            checked={this.props.isSoloed}
            onChange={this.props.onSoloChange}
            color={colorString}
          />
        </div>
        <div
          className={styles.colorPickerContainer}
          style={{
            backgroundColor: colorString,
            height: this.state.isColorPickerOpen ? 61 : 30,
          }}
        >
          <Button
            color={colorString}
            onClick={this.handleToggleColorPickerClick}
          >
            Color <i className={this.state.isColorPickerOpen
              ? 'ion-arrow-up-b'
              : 'ion-arrow-down-b'}
            />
          </Button>
          <ColorPicker
            triangle="hide"
            color={colorString}
            colors={this.props.colorsList}
            onChange={this.props.onColorChange}
          />
        </div>
        {/*<button onClick={this.props.onQuantizeClick}>Quantize</button>*/}
        <Button
          color={colorString}
          onClick={this.props.onQuantizeFactorChange(2)}
        >
          {'*2'}
        </Button>
        <Button
          color={colorString}
          onClick={this.props.onQuantizeFactorChange(0.5)}
        >
          {'/2'}
        </Button>
        <Button
          color={colorString}
          onClick={this.props.onToTopClick}
        >
          To Front
        </Button>
        <Button
          color={colorString}
          onClick={this.props.onToBottomClick}
        >
          To Back
        </Button>
        <Button
          color={medColor}
          className={styles.deleteButton}
          onClick={this.props.onDeleteClick}
        >
          Delete
        </Button>

        <Caret caretPosition={this.props.caretPosition} color={darkColor} />
      </div>
    );
  }
}

ShapeEditorPopoverComponent.propTypes = propTypes;

export default ShapeEditorPopoverComponent;
