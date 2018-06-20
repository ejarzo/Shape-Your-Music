import React from 'react';
import PropTypes from 'prop-types';
import NumericInput from 'react-numeric-input';

import { ColorUtils } from 'utils/Utils';
import styles from './styles.module.css';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

function CustomNumericInput (props) {
  // TODO theme
  const backgroundColor = '#f1f1f1';
  return (
    <div className={styles.wrapper}>
      <NumericInput
        {...props}
        min={1} 
        max={100}
        style={{
          input: {
            lineHeight: '10',
            padding: 'none',
            height: '100%',
            width: '100%',
            background: backgroundColor,
          },
          'input:focus': {
            background: ColorUtils.getDarker(backgroundColor),
            outline: 'none'
          },
          btn: {
            boxShadow: 'none'
          },
          btnUp: {
            color: '#222',
            width: 20,
            borderRadius: 'none',
            background: 'none',
            border: 'none',
          },
          btnDown: {
            color: '#222',
            width: 20,
            borderRadius: 'none',
            background: 'none',
            border: 'none',
          },
          arrowUp: {
            borderBottomColor: '#222'
          },
          arrowDown: {
            borderTopColor: '#222'
          }
        }} 
      />
    </div>
  );
}

CustomNumericInput.propTypes = propTypes;

export default CustomNumericInput;
