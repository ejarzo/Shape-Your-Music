import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

const propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
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
        htmlFor={props.label.toLowerCase()}>{props.label}
      </label>
    </div>
  );
}

CheckboxButton.propTypes = propTypes;

export default CheckboxButton;
