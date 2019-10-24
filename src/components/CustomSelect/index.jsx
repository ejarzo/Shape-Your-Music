import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import { getSelectStyles } from './selectStyles';

const propTypes = {
  menuTop: PropTypes.bool,
  baseColor: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

function CustomSelect(props) {
  const { value, options, onChange, menuTop, baseColor } = props;

  return (
    <Select
      menuPlacement={menuTop ? 'top' : 'bottom'}
      styles={getSelectStyles(baseColor)}
      menuPortalTarget={document.body}
      isSearchable={false}
      closeMenuOnScroll={true} // TODO: this isn't working on horizontal scroll
      components={{
        DropdownIndicator: () => (
          <div style={{ fontSize: 15 }}>
            <i className="ion-chevron-down" />
          </div>
        ),
        IndicatorSeparator: null,
      }}
      isClearable={false}
      value={options.find(option => option.value === value)}
      options={options}
      onChange={onChange}
    />
  );
}

CustomSelect.propTypes = propTypes;

export default CustomSelect;
