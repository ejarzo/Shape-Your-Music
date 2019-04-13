import React from 'react';
import PropTypes from 'prop-types';
import { getDarker, getLighter } from 'utils/color';
import Radium from 'radium';

const propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  darkHover: PropTypes.bool,
  hasBorder: PropTypes.bool,
  href: PropTypes.bool,
  download: PropTypes.bool,
  onClick: PropTypes.func,
};

function Button(props) {
  const style = {
    backgroundColor: props.color,
    ':hover': {
      backgroundColor: props.darkHover
        ? getDarker(props.color)
        : getLighter(props.color),
      color: !props.color && '#FFF',
    },
    ':active': {
      backgroundColor: props.darkHover
        ? getDarker(props.color, 0.2)
        : getDarker(props.color),
    },
    padding: 6,
    borderColor: getDarker(props.color),
    borderStyle: 'solid',
    borderWidth: props.hasBorder ? 1 : 0,
    borderBottomWidth: props.hasBorder ? 2 : 0,
    borderRadius: props.hasBorder ? 3 : 0,
  };

  return props.href ? (
    <a
      title={props.title}
      href={props.href}
      download={props.download}
      className={props.className}
      onClick={props.onClick}
      style={style}
    >
      {props.children}
    </a>
  ) : (
    <button
      title={props.title}
      className={props.className}
      onClick={props.onClick}
      style={style}
    >
      {props.children}
    </button>
  );
}

Button.propTypes = propTypes;

export default Radium(Button);
