import React from 'react';
import PropTypes from 'prop-types';
import { ColorUtils } from 'utils/Utils';
import styles from './styles.module.css';

const propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
};

function CheckboxButton (props) {
  const defaultStyle = {
    background: props.checked
      ? '#242424'
      : '#f1f1f1',
    color: props.checked
      ? '#f1f1f1'
      : '#242424',
    // border: '1px solid #eee',
  };

  const labelStyle = props.color
    ? {
      background: props.checked
        ? '#f1f1f1'
        : ColorUtils.getDarker(props.color),
      color: props.checked
        ? props.color
        : '#f1f1f1',
      // border: '1px solid props.color',
    }
    : defaultStyle;

  return (
    <div style={{height: '100%'}}>
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
        style={labelStyle}
      >
        {props.label}
      </label>
    </div>
  );
}

CheckboxButton.propTypes = propTypes;

export default CheckboxButton;
