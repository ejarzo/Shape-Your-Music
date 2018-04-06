import React from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const propTypes = {
  color: PropTypes.string,
};

function CustomSlider (props) {
  const colorObj = Color(props.color);
  const darkerColor = colorObj.darken(0.2).toString();
  // const lighterColor = colorObj.lighten(0.3).toString();
  return (
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
        backgroundColor: '#fff',
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
  );
}

CustomSlider.propTypes = propTypes;

export default CustomSlider;
