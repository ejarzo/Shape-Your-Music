import React, { useState } from 'react';
import Color from 'color';
import { /* useStrictMode, */ Circle, Text } from 'react-konva';
// useStrictMode(true);

/*
  The shape's vertexes. Can be dragged to edit the shape.
*/
function ShapeVertex(props) {
  const {
    p,
    index,
    color,
    dragBoundFunc,
    handleVertexDelete,
    handleVertexDragMove,
  } = props;
  const luminosity = Color(color).luminosity();
  const lightenAmount = 1.8 * (1 - luminosity);
  const defaultRadius = 5;
  const hoverRadius = 7;
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
    <>
      {/*<Text x={p.x + 10} y={p.y} text={index} />*/}
      <Circle
        x={p.x}
        y={p.y}
        radius={radius}
        fill={fillColor}
        stroke={color}
        strokeWidth={strokeWidth}
        draggable
        // onMouseMove={() => console.log('vertex mouse move')}
        dragBoundFunc={dragBoundFunc}
        onDragMove={handleVertexDragMove}
        onMouseOver={() => setRadius(hoverRadius)}
        onMouseOut={() => setRadius(defaultRadius)}
        onDblClick={handleVertexDelete}
      />
    </>
  );
}

export default ShapeVertex;
