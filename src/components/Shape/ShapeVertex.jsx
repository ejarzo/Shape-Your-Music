import React, { useState } from 'react';
import Color from 'color';
import { /* useStrictMode, */ Circle } from 'react-konva';
// useStrictMode(true);

/*
  The shape's vertexes. Can be dragged to edit the shape.
*/
function ShapeVertex(props) {
  const { p, index, color, dragBoundFunc, onVertexDragMove } = props;
  const luminosity = Color(color).luminosity();
  const lightenAmount = 1.8 * (1 - luminosity);
  const defaultRadius = 4;
  const hoverRadius = 6;
  const strokeWidth = 2;
  const [radius, setRadius] = useState(defaultRadius);

  // solid if first node, pale fill if not
  const fillColor =
    index === 0
      ? color
      : Color(color)
          .lighten(lightenAmount)
          .toString();

  return (
    <Circle
      x={p.x}
      y={p.y}
      radius={radius}
      fill={fillColor}
      stroke={color}
      strokeWidth={strokeWidth}
      draggable
      dragBoundFunc={dragBoundFunc}
      onDragMove={onVertexDragMove}
      onMouseOver={() => setRadius(hoverRadius)}
      onMouseOut={() => setRadius(defaultRadius)}
    />
  );
}

export default ShapeVertex;
