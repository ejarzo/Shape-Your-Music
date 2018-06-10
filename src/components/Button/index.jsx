import React from 'react';
import PropTypes from 'prop-types';
import { ColorUtils } from 'utils/Utils';
import Radium from 'radium';

const propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
  darkHover: PropTypes.bool,
  border: PropTypes.bool,
};

function Button (props) {
  const style = {
    backgroundColor: props.color,
    ':hover': {
      backgroundColor: props.darkHover ? ColorUtils.getDarker(props.color) : ColorUtils.getLighter(props.color),
    },
    ':active': {
      backgroundColor: props.darkHover ? ColorUtils.getDarker(props.color, 0.2) : ColorUtils.getDarker(props.color),
    },
    padding: 6,
    borderColor: ColorUtils.getDarker(props.color),
    borderStyle: 'solid',
    borderWidth: props.border ? 1 : 0,
    borderBottomWidth: props.border ? 2 : 0,
    borderRadius: props.border ? 3 : 0,
  };

  return (
    <button
      {...props}
      style={style}
    >
      {props.children}
    </button>
  );
}

Button.propTypes = propTypes;

export default Radium(Button);
