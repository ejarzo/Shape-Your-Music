import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

import styles from './styles.module.css';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

function TempoInput(props) {
  const { value, onChange } = props;
  return (
    <Draggable
      axis="x"
      position={{ x: 0 }}
      bounds={{ left: 0, top: 0, right: 0, bottom: 0 }}
      onDrag={e => {
        onChange(value + Math.floor(e.movementX / 2));
      }}
    >
      <div title="Tempo" className={styles.wrapper}>
        <span className={styles.value}>{value}</span>
      </div>
    </Draggable>
  );
}

TempoInput.propTypes = propTypes;

export default TempoInput;
