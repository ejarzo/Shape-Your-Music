import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Slider from 'react-rangeslider';

import CheckboxButton from 'components/CheckboxButton';
import styles from './styles.css';

const propTypes = {
  position: PropTypes.shape({
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
  }),
  arrowPosition: PropTypes.shape({
    top: PropTypes.number.isRequired,
    isLeft: PropTypes.bool.isRequired,
  }),
  // colorsList: PropTypes.array.isRequired,
  colorIndex: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  
  isMuted: PropTypes.bool.isRequired,
  isSoloed: PropTypes.bool.isRequired,
  
  // closePortal: PropTypes.func.isRequired,
  
  // onColorChange: PropTypes.func.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  onMuteChange: PropTypes.func.isRequired,
  onSoloChange: PropTypes.func.isRequired,
  onQuantizeFactorChange: PropTypes.func.isRequired,
  
  onQuantizeClick: PropTypes.func.isRequired,
  // onToTopClick: PropTypes.func.isRequired,
  // onToBottomClick: PropTypes.func.isRequired,
  // onDeleteClick: PropTypes.func.isRequired,
  
  // perimeter: PropTypes.number.isRequired,
};

const colorPicker = props => (
  <div className="row section">
    <div className="col col-12">
      <div className="shape-color-picker">
        {props.colorsList.map((color, i) => {
          const isSelected = i === props.colorIndex;
          const style = {
            backgroundColor: color,
            opacity: isSelected ? 1 : 0.3,
          };
          return (
            <div 
              key={i}
              className="shape-color-option" 
              style={style}
              onClick={props.onColorChange(i)}>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

function ShapeEditorPanelComponent (props) {
  return (
    <div
      className={styles.shapeEditorPanel}
      style={{
        left: props.position.left,
        top: props.position.top,
      }}
    >
      <div>
        <Slider
          className={'color-'+ props.colorIndex}
          orientation='vertical'
          min={-18}
          max={0}
          value={props.volume}
          onChange={props.onVolumeChange}
        />
      </div>
      <div>
        <CheckboxButton 
          label="Mute" 
          checked={props.isMuted} 
          onChange={props.onMuteChange}
        />
        <CheckboxButton 
          label="Solo" 
          checked={props.isSoloed} 
          onChange={props.onSoloChange}
        />
        <button onClick={props.onQuantizeClick}>Quantize</button>
        <button
          onClick={props.onQuantizeFactorChange(2)}>
          {'*2'}
        </button>
        <button
          onClick={props.onQuantizeFactorChange(0.5)}>
          {'/2'}
        </button>
      </div>
      <div
        className={cx({
          [styles.tooltipArrow]: true,
          [styles.arrowLeft]: props.arrowPosition.isLeft,
          [styles.arrowRight]: !props.arrowPosition.isLeft,
        })}
        style={{ top: props.arrowPosition.top }}>
      </div>
    </div>
  );
}

ShapeEditorPanelComponent.propTypes = propTypes;

export default ShapeEditorPanelComponent;
