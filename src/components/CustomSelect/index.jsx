import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import { ColorUtils } from 'utils/Utils';
import styles from './styles.css';

const propTypes = {
  color: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  synthParams: PropTypes.object.isRequired,
  instNamesList: PropTypes.array.isRequired,
};

function CustomSelect (props) {
  const darkerColor = ColorUtils.getDarker(props.color);

  const arrowRenderer = ({ isOpen }) => (
    <div
      style={{
        color: '#fff',
        fontSize: 15,
      }}
    >
      {isOpen
        ? <i className="ion-chevron-up" />
        : <i className="ion-chevron-down" />
      }
    </div>
  );
  arrowRenderer.propTypes = { isOpen: PropTypes.bool };

  return (
    <Select
      {...props}
      className={styles.customSelect}
      wrapperStyle={{ height: '100%' }}
      menuContainerStyle={{
        marginBottom: 'none',
        background: 'transparent'
      }}
      optionClassName={styles.option}
      valueRenderer={value => (
        <div style={{
          backgroundColor: props.color,
          color: '#fff',
          border: 0,
          height: '100%',
          padding: 3,
        }}>
          {value.label}
        </div>
      )}
      arrowRenderer={arrowRenderer}
      menuStyle={{
        border: `2px solid ${darkerColor}`,
        background: props.color,
        margin: -3,
        boxShadow: '-5 0 12px 0 rgba(0,0,0,0.11)'
      }}
      searchable={false}
      clearable={false}
      value={props.synthParams.name.value}
      options={props.instNamesList}
      onChange={props.onChange}
    />
  );
}

CustomSelect.propTypes = propTypes;

export default CustomSelect;
