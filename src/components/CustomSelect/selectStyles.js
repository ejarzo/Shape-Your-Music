import { appColors, getDarker, getLighter } from 'utils/color';

export const getSelectStyles = baseColor => {
  const { white, black, grayLightest } = appColors;

  const backgroundColor = baseColor || grayLightest;
  const borderColor = baseColor ? getDarker(baseColor) : white;
  const foreground = baseColor ? white : black;
  const fontWeight = baseColor ? 'bold' : 'normal';

  const getOptionBackground = ({ isFocused, isSelected }) => {
    const selectedColor = baseColor
      ? getLighter(baseColor, 0.3)
      : 'rgba(0, 0, 0, 0.1)';
    const focusedColor = baseColor
      ? getLighter(baseColor)
      : 'rgba(0, 0, 0, 0.05)';
    return isSelected ? selectedColor : isFocused && focusedColor;
  };

  return {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menu: base => ({
      ...base,
      border: `2px solid ${borderColor}`,
      background: backgroundColor,
      borderRadius: 1,
      padding: 0,
      boxShadow: `-2px 0 12px 0 rgba(0,0,0,0.11)`,
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
      border: baseColor ? 'none' : `1px solid ${getDarker(backgroundColor)}`,
      borderRadius: !baseColor && 1,
      '&:hover': {
        backgroundColor: getLighter(backgroundColor),
      },
    }),
    menuList: base => ({ ...base, padding: 0 }),
    valueContainer: base => ({ ...base, padding: 0 }),
    singleValue: base => ({ ...base, fontWeight, color: foreground }),
    indicatorsContainer: base => ({ ...base, padding: 0, height: '100%' }),
    indicatorContainer: base => ({ ...base, padding: 0 }),
    dropdownIndicator: base => ({
      ...base,
      color: foreground,
      '&:hover': {
        color: foreground,
      },
    }),
    option: (base, state) => ({
      ...base,
      padding: '5px 8px',
      fontWeight,
      color: foreground,
      background: getOptionBackground(state),
    }),
  };
};
