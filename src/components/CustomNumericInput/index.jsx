import React from 'react';
import PropTypes from 'prop-types';
import NumericInput from 'react-numeric-input';

import { appColors, getDarker } from 'utils/color';
import styles from './styles.module.css';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

function CustomNumericInput(props) {
  const { grayLightest, grayMedium } = appColors;
  const backgroundColor = grayLightest;
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
            background: getDarker(backgroundColor),
            outline: 'none',
          },
          btn: {
            boxShadow: 'none',
          },
          btnUp: {
            color: grayMedium,
            width: 20,
            borderRadius: 'none',
            background: 'none',
            border: 'none',
          },
          btnDown: {
            color: grayMedium,
            width: 20,
            borderRadius: 'none',
            background: 'none',
            border: 'none',
          },
          arrowUp: {
            borderBottomColor: grayMedium,
          },
          arrowDown: {
            borderTopColor: grayMedium,
          },
        }}
      />
    </div>
  );
}

CustomNumericInput.propTypes = propTypes;

export default CustomNumericInput;
