import React from 'react';
import PropTypes from 'prop-types';
import { ColorUtils } from 'utils/Utils';
import Radium from 'radium';

const propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
};

function Button (props) {
  const baseColor = props.color || '#ddd';
  return (
    <button
      {...props}
      style={{
        backgroundColor: baseColor,
        ':hover': {
          backgroundColor: ColorUtils.getLighter(props.color),
        },
        ':active': {
          backgroundColor: ColorUtils.getDarker(props.color),
        }
      }}
    >
      {props.children}
    </button>
  );
}

Button.propTypes = propTypes;

export default Radium(Button);
