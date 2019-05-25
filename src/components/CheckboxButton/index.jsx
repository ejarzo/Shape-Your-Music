import React from 'react';
import PropTypes from 'prop-types';
import { appColors, getDarker, getLighter } from 'utils/color';
import styles from './styles.module.css';
import Radium from 'radium';

const { black, grayLightest } = appColors;
const propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
};

function CheckboxButton(props) {
  const defaultStyle = {
    backgroundColor: props.checked ? black : grayLightest,
    color: props.checked ? grayLightest : black,
    ':hover': {
      backgroundColor: !props.checked ? getLighter(grayLightest) : black,
    },
  };

  const labelStyle = props.color
    ? {
        backgroundColor: props.checked ? grayLightest : getDarker(props.color),
        color: props.checked ? props.color : grayLightest,
      }
    : defaultStyle;

  return (
    <div className={styles.inputWrapper}>
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

export default Radium(CheckboxButton);
