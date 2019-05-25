import React from 'react';
import PropTypes from 'prop-types';

import Color from 'color';
import { Group, Circle, Line } from 'react-konva';
import { TOOL_TYPES } from 'views/Project/Container';
import withProjectContext from 'views/Project/withProjectContext';

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
function PhantomShapeComponent(props) {
  const { points, color, activeTool, mousePos, drawingState } = props;
  const radius = 4;
  const strokeWidth = 2;
  const previewFillOpacity = 0.1;
  const originPoint = points[0] && (
    <Circle
      x={points[0]}
      y={points[1]}
      radius={radius}
      stroke={color}
      strokeWidth={strokeWidth}
      fill={color}
      transformsEnabled="position"
    />
  );

  return (
    activeTool === TOOL_TYPES.DRAW && (
      <Group>
        <Circle // circle beneath cursor
          x={mousePos.x}
          transformsEnabled="position"
          y={mousePos.y}
          radius={radius}
          fill={color}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={0.8}
        />
        {originPoint}
        <Line // shape so far
          points={points}
          strokeWidth={strokeWidth}
          stroke={color}
          fill={Color(color)
            .alpha(previewFillOpacity)
            .toString()}
          fillEnabled={true}
          closed={drawingState === 'preview'}
          transformsEnabled="position"
        />
        <Line // line from previous point to cursor
          points={points.slice(-2).concat([mousePos.x, mousePos.y])}
          strokeWidth={strokeWidth}
          stroke={color}
          opacity={0.5}
          transformsEnabled="position"
        />
      </Group>
    )
  );
}

PhantomShapeComponent.propTypes = propTypes;

export default withProjectContext(PhantomShapeComponent);
