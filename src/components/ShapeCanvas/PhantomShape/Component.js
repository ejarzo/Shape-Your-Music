import React from 'react';
import PropTypes from 'prop-types';

import Color from 'color';
import { Group, Circle, Line } from 'react-konva';

const propTypes = {
  points: PropTypes.array.isRequired,
  color: PropTypes.string.isRequired,
  activeTool: PropTypes.string.isRequired,
  drawingState: PropTypes.string.isRequired,
  mousePos: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

/*
  Used to show the shape that is currently being drawn. 
*/
function PhantomShapeComponent (props) {
  console.log('phantom render');
  const radius = 4;
  const strokeWidth = 2;
  const previewFillOpacity = 0.1;
  const originPoint = props.points[0] && (
    <Circle
      x={props.points[0]} 
      y={props.points[1]}
      radius={radius}
      stroke={props.color}
      strokeWidth={strokeWidth}
      fill={props.color}
    />
  );

  return props.activeTool === 'draw' && (
    <Group>
      <Circle // circle beneath cursor
        x={props.mousePos.x} 
        y={props.mousePos.y}
        radius={radius}
        fill={props.color}
        stroke={props.color}
        strokeWidth={strokeWidth}
        opacity={0.8 }
      />
      {originPoint}
      <Line // shape so far
        points={props.points}
        strokeWidth={strokeWidth}
        stroke={props.color}
        fill={Color(props.color).alpha(previewFillOpacity).toString()}
        fillEnabled={true}
        closed={props.drawingState === 'preview'}
      />
      <Line // line from previous point to cursor
        points={props.points.slice(-2).concat([props.mousePos.x, props.mousePos.y])}
        strokeWidth={strokeWidth}
        stroke={props.color}
        opacity={0.5}
      />                
    </Group>
  );
}

PhantomShapeComponent.propTypes = propTypes;

export default PhantomShapeComponent;
