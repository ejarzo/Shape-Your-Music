import React from 'react';
import PropTypes from 'prop-types';
import { getDarker, appColors } from 'utils/color';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const propTypes = {
  color: PropTypes.string,
};

function CustomSlider(props) {
  const darkerColor = getDarker(props.color, 0.2);
  const { vertical = true, label = 'Volume', defaultValue = 30 } = props;
  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <Slider
        {...props}
        vertical={vertical}
        defaultValue={defaultValue}
        trackStyle={{
          backgroundColor: props.color,
          borderRadius: 0,
          width: '100%',
          height: !vertical && '100%',
          margin: 0,
          padding: 0,
          left: 0,
        }}
        handleStyle={{
          border: 'none',
          borderRadius: 0,
          height: vertical ? 6 : '100%',
          width: vertical ? '100%' : 6,
          backgroundColor: appColors.white,
          margin: 0,
          padding: 0,
        }}
        railStyle={{
          margin: 0,
          padding: 0,
          backgroundColor: darkerColor,
          width: '100%',
          height: '100%',
          borderRadius: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          textAlign: 'center',
          width: '100%',
          height: !vertical && '100%',
          display: !vertical && 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          top: vertical ? 5 : 0,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <span>{label}</span>
      </div>
    </div>
  );
}

CustomSlider.propTypes = propTypes;

export default CustomSlider;
