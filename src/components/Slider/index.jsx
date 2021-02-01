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
  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <Slider
        {...props}
        vertical
        defaultValue={30}
        trackStyle={{
          backgroundColor: props.color,
          borderRadius: 0,
          width: '100%',
          margin: 0,
          padding: 0,
          left: 0,
          // transition: 'all 0.1s'
        }}
        handleStyle={{
          border: 'none',
          borderRadius: 0,
          height: 3,
          width: '100%',
          backgroundColor: appColors.white,
          margin: 0,
          padding: 0,
          // transition: 'all 0.1s'
        }}
        railStyle={{
          margin: 0,
          padding: 0,
          backgroundColor: darkerColor,
          width: '100%',
          borderRadius: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          textAlign: 'center',
          width: '100%',
          color: 'white',
          top: 5,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <span>Volume</span>
      </div>
    </div>
  );
}

CustomSlider.propTypes = propTypes;

export default CustomSlider;
