import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

const propTypes = {
  iconClassName: PropTypes.string,
  children: PropTypes.node,
};

function Button(props) {
  const style = {
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

  return (
    <button onClick={props.onClick} style={style}>
      {props.iconClassName ? (
        <i style={{ fontSize: '1.6em' }} className={props.iconClassName} />
      ) : (
        props.children
      )}
    </button>
  );
}

Button.propTypes = propTypes;

export default Radium(Button);
