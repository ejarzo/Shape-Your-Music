import React from 'react';
import PropTypes from 'prop-types';
import { Circle } from 'react-konva';
import { appColors } from 'utils/color';

const propTypes = {
  gridSize: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

function Grid(props) {
  const { width, height, gridSize } = props;
  const gridDots = [];
  const color = appColors.grayDark;
  const radius = 1;
  if (!width) {
    return null;
  }

  for (let x = gridSize; x < width; x += gridSize) {
    for (let y = gridSize; y < height; y += gridSize) {
      const gridDot = (
        <Circle key={'dot' + x + y} x={x} y={y} radius={radius} fill={color} />
      );
      gridDots.push(gridDot);
    }
  }
  return gridDots;
}

Grid.propTypes = propTypes;

export default Grid;
