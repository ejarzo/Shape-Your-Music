import React from 'react';
import PropTypes from 'prop-types';
import { ColorUtils } from 'utils/Utils';
import Radium from 'radium';

import styles from './styles.css';

const propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
};

function Button (props) {
  // const baseColor = props.color || '#ddd';

  const colorStyle = {
    backgroundColor: props.color,
    ':hover': {
      backgroundColor: ColorUtils.getLighter(props.color),
    },
    ':active': {
      backgroundColor: ColorUtils.getDarker(props.color),
    },
  };

  const expandStyle = {
    backgroundColor: 'transparent',
    transform: 'scale3d(1,1,1)',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale3d(1.2,1.2,1)',
    },
    ':active': {
      transform: 'scale3d(0.9,0.9,1)',
      backgroundColor: 'transparent',
    },
  };

  const style = props.color ? colorStyle : expandStyle;
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
