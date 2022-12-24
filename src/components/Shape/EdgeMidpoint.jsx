import React, { useContext, useEffect, useRef, useState } from 'react';
import { Circle } from 'react-konva';
import { dist, getMidpoint } from '../../utils/math';
import { MousePosContext } from '../ShapeCanvas/Component';

/*
  Midpoint along a shape edge. Can be clicked on to create a new vertex
*/
function EdgeMidpoint(props) {
  const { p1, p2, color, handleMouseDown } = props;

  const ref = useRef(null);
  const mousePos = useContext(MousePosContext);
  const [isInRange, setIsInRange] = useState(false);

  const pt = getMidpoint(p1.x, p1.y, p2.x, p2.y);

  useEffect(() => {
    let absPt = pt;
    if (ref.current) {
      absPt = ref.current.getAbsolutePosition();
    }
    const isInRange = dist(absPt.x, absPt.y, mousePos.x, mousePos.y) < 160;
    setIsInRange(isInRange);
  }, [mousePos, pt]);

  const { x, y } = pt;

  const defaultRadius = 6;
  const hoverRadius = 8;
  const strokeWidth = 2;
  const [radius, setRadius] = useState(defaultRadius);

  return (
    <>
      {/*<Text x={x + 10} y={y} text={`${absPt.x}, ${absPt.y}`} />*/}
      <Circle
        ref={ref}
        x={x}
        y={y}
        radius={radius}
        onMouseDown={handleMouseDown}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={isInRange ? 0.9 : 0}
        onMouseOver={() => {
          setRadius(hoverRadius);
        }}
        onMouseOut={() => {
          setRadius(defaultRadius);
        }}
      />
    </>
  );
}

export default EdgeMidpoint;
