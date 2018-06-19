import React from 'react';
import PropTypes from 'prop-types';
import { GithubPicker } from 'react-color';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  colors: PropTypes.array.isRequired,
  activeColorIndex: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  triangle: PropTypes.string
};

function ColorPicker (props) {
  return (
    <div>
      <GithubPicker
        style={{
          borderRadius: 0,
        }}
        onChange={props.onChange}
        color={props.color}
        colors={props.colors}
        width="100%"
        triangle={props.triangle}
      />
    </div>
  );
}

ColorPicker.propTypes = propTypes;

export default ColorPicker;
