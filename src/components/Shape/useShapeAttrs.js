import Color from 'color';

export const useShapeAttrs = ({
  color,
  isSelected,
  soloedShapeIndex,
  isSoloed,
  isMuted,
  isEditMode,
  isHoveredOver,
}) => {
  const alphaAmount = isSelected ? 0.8 : 0.4;
  const fill = Color(color)
    .alpha(alphaAmount)
    .toString();
  let opacity = 1;
  if (soloedShapeIndex >= 0 && !isSoloed) {
    opacity = 0.4;
  }
  if (isMuted) {
    opacity = 0.2;
  }
  return {
    fill,
    opacity,
    stroke: color,
    strokeWidth: isEditMode ? (isHoveredOver ? 4 : 2) : 2,
  };
};
