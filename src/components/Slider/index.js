import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const propTypes = {
  color: PropTypes.string,
};

function CustomSlider (props) {
  console.log(Slider);
  const colorObj = Color(props.color);
  const darkerColor = colorObj.darken(0.2).toString();
  const lighterColor = colorObj.lighten(0.3).toString();
  return (
    <div
      style={{
        // height: 300,
        // width: 50,
        // border: '1px solid red',
        // position: 'absolute',
        // top: 200,
        // left: 200,
        // zIndex: 100 
      }}
    >
      <Slider
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
          borderColor: 'transparent',
          borderRadius: 0,
          height: 5,
          width: '100%',
          backgroundColor: lighterColor,
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
    </div>
    
  );
}

CustomSlider.propTypes = propTypes;

export default CustomSlider;
