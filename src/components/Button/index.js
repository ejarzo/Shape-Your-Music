import React from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import Radium from 'radium';

const propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
};

function Button (props) {
  const baseColor = props.color || '#ddd';
  const backgroundColorObj = Color(baseColor);
  return (
    <button
      {...props}
      style={{
        backgroundColor: backgroundColorObj.toString(),
        ':hover': {
          backgroundColor: backgroundColorObj.lighten(0.1),
        },
        ':active': {
          backgroundColor: backgroundColorObj.darken(0.1),
        }
      }}
    >
      {props.children}
    </button>
  );
}

Button.propTypes = propTypes;

export default Radium(Button);
