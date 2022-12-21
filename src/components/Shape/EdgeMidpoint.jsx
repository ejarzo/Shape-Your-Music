import React, { useState } from 'react';
// import Color from 'color';
import { /* useStrictMode, */ Circle } from 'react-konva';
// useStrictMode(true);

/*
  The shape's vertexes. Can be dragged to edit the shape.
*/
function EdgeMidpoint(props) {
  const {
    p1,
    p2,
    // index,
    color,
    handleMouseDown,
    // dragBoundFunc,
    // handleVertexDelete,
    // handleVertexDragMove,
  } = props;
  // const luminosity = Color(color).luminosity();
  // const lightenAmount = 1.8 * (1 - luminosity);
  const defaultRadius = 5;
  const hoverRadius = 7;
  const strokeWidth = 2;
  const [radius, setRadius] = useState(defaultRadius);
  // const [strokeW, setStrokeW] = useState(3);
  return (
    <>
      {/*<Text x={(p1.x + p2.x) / 2 + 10} y={(p1.y + p2.y) / 2} text={index} />*/}
      <Circle
        x={(p1.x + p2.x) / 2}
        y={(p1.y + p2.y) / 2}
        radius={radius}
        // draggable
        onMouseDown={e => {
          console.log('midpoint mouse down');
          handleMouseDown(e);
        }}
        // handleDrag={handleVertexDragMove}
        // fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={0.9}
        onMouseOver={() => {
          setRadius(hoverRadius);
          // setStrokeW(3);
        }}
        onMouseOut={() => {
          setRadius(defaultRadius);
          // setStrokeW(2);
        }}
      />
    </>
  );
}

export default EdgeMidpoint;
