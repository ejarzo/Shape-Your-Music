import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import { appColors, getDarker, getLighter } from 'utils/color';

const propTypes = {
  menuTop: PropTypes.bool,
  color: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

function CustomSelect(props) {
  const { white, black, grayLightest } = appColors;
  const { color } = props;
  const backgroundColor = color || grayLightest;

  const borderColor = color ? getDarker(color) : white;
  const foreground = color ? white : black;
  const fontWeight = color ? 'bold' : 'normal';

  return (
    <Select
      menuPlacement={props.menuTop ? 'top' : 'bottom'}
      styles={{
        menuPortal: base => ({ ...base, zIndex: 9999 }),
        menu: base => ({
          ...base,
          border: `2px solid ${borderColor}`,
          background: backgroundColor,
          // margin: '1px 0',
          borderRadius: 1,
          padding: 0,
          boxShadow: '-5px 0 12px 0 rgba(0,0,0,0.11)',
        }),
        menuList: base => ({
          ...base,
          padding: 0,
        }),
        container: base => ({
          ...base,
          minHeight: 28,
          padding: 0,
          height: '100%',
          width: '100%',
          border: 'none',
          outline: 'none',
        }),
        control: (base, { isFocused }) => ({
          ...base,
          boxShadow: 'none',
          height: '100%',
          width: '100%',
          minHeight: 0,
          padding: '0 8px',
          backgroundColor: isFocused
            ? getLighter(backgroundColor)
            : backgroundColor,
          border: color ? 'none' : `1px solid ${getDarker(backgroundColor)}`,
          borderRadius: !color && 1,
          '&:hover': {
            backgroundColor: getLighter(backgroundColor),
          },
        }),
        valueContainer: base => ({
          ...base,
          padding: 0,
        }),
        singleValue: base => ({
          ...base,
          fontWeight,
          color: foreground,
        }),
        dropdownIndicator: base => ({
          ...base,
          color: foreground,
          '&:hover': {
            color: foreground,
          },
        }),
        indicatorsContainer: base => ({
          ...base,
          padding: 0,
          height: '100%',
        }),
        indicatorContainer: base => ({
          ...base,
          padding: 0,
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          padding: '5px 8px',
          fontWeight,
          color: foreground,
          background: isSelected
            ? color
              ? getLighter(color, 0.3)
              : 'rgba(0, 0, 0, 0.1)'
            : isFocused && (color ? getLighter(color) : 'rgba(0, 0, 0, 0.05)'),
        }),
      }}
      menuPortalTarget={document.body}
      isSearchable={false}
      closeMenuOnScroll={true}
      // menuShouldBlockScroll={true}
      components={{
        DropdownIndicator: () => (
          <div style={{ fontSize: 15 }}>
            <i className="ion-chevron-down" />
          </div>
        ),
        IndicatorSeparator: null,
      }}
      isClearable={false}
      value={props.options.find(({ value }) => value === props.value)}
      options={props.options}
      onChange={props.onChange}
    />
  );
}

CustomSelect.propTypes = propTypes;

export default CustomSelect;
