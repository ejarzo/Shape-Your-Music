import React from 'react';
import PropTypes from 'prop-types';
// import Radium from 'radium';
// import Color from 'color';

import styles from './styles.css';

const propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
};

function CheckboxButton (props) {
  return (
    <div>
      <input
        className={styles.checkboxButton}
        id={props.label.toLowerCase()} 
        type="checkbox" 
        checked={props.checked} 
        onChange={props.onChange}
      />
      <label
        className={styles.checkboxLabel}
        htmlFor={props.label.toLowerCase()}
        style={{
          background: props.checked
            ? '#fff'
            : props.color.darken(0.1).toString(),
          color: props.checked
            ? props.color.toString()
            : '#fff',
        }}
      >
        {props.label}
      </label>
    </div>
  );
}

CheckboxButton.propTypes = propTypes;

export default CheckboxButton;
