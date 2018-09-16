import React from 'react';
import PropTypes from 'prop-types';
import { ColorUtils } from 'utils/Utils';
import Radium from 'radium';

const propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  darkHover: PropTypes.bool,
  hasBorder: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

function Button(props) {
  const style = {
    backgroundColor: props.color,
    ':hover': {
      backgroundColor: props.darkHover
        ? ColorUtils.getDarker(props.color)
        : ColorUtils.getLighter(props.color),
    },
    ':active': {
      backgroundColor: props.darkHover
        ? ColorUtils.getDarker(props.color, 0.2)
        : ColorUtils.getDarker(props.color),
    },
    padding: 6,
    borderColor: ColorUtils.getDarker(props.color),
    borderStyle: 'solid',
    borderWidth: props.hasBorder ? 1 : 0,
    borderBottomWidth: props.hasBorder ? 2 : 0,
    borderRadius: props.hasBorder ? 3 : 0,
  };

  return (
    <button className={props.className} onClick={props.onClick} style={style}>
      {props.children}
    </button>
  );
}

Button.propTypes = propTypes;

export default Radium(Button);
