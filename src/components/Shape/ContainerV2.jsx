import React, { PureComponent, useState, useRef, useEffect } from 'react';
import { number, string, array, bool, object, func } from 'prop-types';
import Color from 'color';
import Tone from 'tone';
import { themeColors, appColors } from 'utils/color';
import { TOOL_TYPES } from 'components/Project';

import { convertValToRange } from 'utils/math';
import {
  getPerimeterLength,
  getAveragePoint,
  forEachPoint,
  getNoteInfo,
} from 'utils/shape';

import ShapeComponent from './ComponentV2';
import withProjectContext from 'components/Project/withProjectContext';
import { SYNTH_PRESETS } from 'instrumentPresets';
import { SEND_CHANNELS } from 'utils/music';
import { useContext } from 'react';
import { ProjectContext } from 'components/Project/ProjectContextProvider';
import { useShapeAttrs } from './useShapeAttrs';
import { useShapeSynth } from './useShapeSynth';

const getPointsForFixedPerimeterLength = (points, length) => {
  const currLen = getPerimeterLength(points);
  const avgPoint = getAveragePoint(points);
  const ratio = length / currLen;

  const newPoints = points.slice();

  forEachPoint(points, (p, i) => {
    newPoints[i] = p.x * ratio + (1 - ratio) * avgPoint.x;
    newPoints[i + 1] = p.y * ratio + (1 - ratio) * avgPoint.y;
  });

  return newPoints;
};

function ShapeContainerV2(props) {
  console.log('shape render');
  const { activeTool, isAutoQuantizeActive, scaleObj } = useContext(
    ProjectContext
  );

  const {
    index,
    volume,
    colorIndex,
    soloedShapeIndex,
    isMuted,
    isSelected,
    handleClick,
    handleColorChange,
    handleVolumeChange,
    handleDelete,
    handleSoloChange,
    handleMuteChange,
    handleShapeDuplicate,
    initialPoints,
    initialQuantizeFactor,
    snapToGrid,
  } = props;

  const [state, setState] = useState({
    points: initialPoints,
    quantizeFactor: initialQuantizeFactor || 1,
    averagePoint: { x: 0, y: 0 },
    firstNoteIndex: 1,
    noteIndexModifier: 0,
    editorX: 0,
    editorY: 0,
    animCircleX: 0,
    animCircleY: 0,
  });

  const { points, noteIndexModifier, averagePoint, editorX, editorY } = state;

  const [isHoveredOver, setIsHoveredOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const shapeRef = useRef();

  const quantizeLength = 500;
  const color = themeColors[colorIndex];
  const isSoloed = soloedShapeIndex === index;
  const isEditMode = activeTool === TOOL_TYPES.EDIT;
  const shapeAttrs = useShapeAttrs({
    color,
    isSelected,
    isMuted,
    isSoloed,
    soloedShapeIndex,
    isEditMode,
    isHoveredOver,
  });

  // const { isBuffering } = useShapeSynth();

  useEffect(() => {
    if (!isEditMode) {
      setIsHoveredOver(false);
    }
  }, [isEditMode]);

  // TODO set volume
  // TODO set mute

  /* Hover */
  const handleMouseDown = e => {
    setState(s => ({ ...s, editorX: e.evt.offsetX, editorY: e.evt.offsetY }));
  };

  /* Drag */
  const handleDrag = () => {
    setState(s => {
      const absPos = shapeRef.current.getAbsolutePosition();
      const avgPoint = getAveragePoint(s.points);
      const x = parseInt(absPos.x + avgPoint.x, 10);
      const y = parseInt(absPos.y + avgPoint.y, 10);
      const noteIndexVal = parseInt(
        convertValToRange(y, 0, window.innerHeight, 5, -7),
        10
      );
      return {
        ...s,
        averagePoint: { x, y },
        noteIndexModifier: noteIndexVal,
      };
    });
  };

  const dragBoundFunc = ({ x, y }) => ({
    x: snapToGrid(x),
    y: snapToGrid(y),
  });

  const handleVertexDragMove = i => e => {
    setState(s => {
      const { x, y } = e.target.position();
      let points = s.points.slice();
      points[i] = snapToGrid(x);
      points[i + 1] = snapToGrid(y);

      if (isAutoQuantizeActive) {
        points = getPointsForFixedPerimeterLength(
          points,
          quantizeLength * s.quantizeFactor
        );
      }
      return { ...s, points };
    });
  };

  const handleToTopClick = () => {
    shapeRef.current.moveToTop();
    // hack to update Konva layout following imperative changes
    setIsHoveredOver(true);
    setIsHoveredOver(false);
  };

  const handleToBottomClick = () => {
    shapeRef.current.moveToBottom();
    // hack to update Konva layout following imperative changes
    setIsHoveredOver(true);
    setIsHoveredOver(false);
  };

  const handleQuantizeFactorChange = factor => {
    return () => {
      setState(s => {
        const { points, quantizeFactor } = s;
        if (
          (factor < 1 && quantizeFactor >= 0.25) ||
          (factor > 1 && quantizeFactor <= 4)
        ) {
          const newPerim = isAutoQuantizeActive
            ? factor * quantizeFactor * quantizeLength
            : getPerimeterLength(points) * factor;
          const newPoints = getPointsForFixedPerimeterLength(points, newPerim);

          // TODO
          // setNoteEvents(scaleObj, newPoints);

          return {
            ...s,
            points: newPoints,
            quantizeFactor: factor * quantizeFactor,
          };
        }
        return s;
      });
    };
  };

  const getAbsolutePoints = () => {
    const { x, y } = shapeRef.current.getAbsolutePosition();
    const absolutePoints = points.map((p, i) => (i % 2 === 0 ? p + x : p + y));
    return absolutePoints;
  };

  // TODO test
  const handleReverseClick = () => {
    setState(s => {
      const { points } = s;
      const reversed = [points[0], points[1]];
      for (let i = points.length - 2; i >= 2; i -= 2) {
        reversed.push(points[i]);
        reversed.push(points[i + 1]);
      }

      // TODO
      // this.setNoteEvents(scaleObj, reversed);

      return { ...s, points: reversed };
    });
  };

  return (
    <ShapeComponent
      // TODO: revisit ref methods
      ref={shapeRef}
      index={index}
      points={points}
      attrs={shapeAttrs}
      volume={volume}
      colorIndex={colorIndex}
      noteIndexModifier={noteIndexModifier}
      isDragging={isDragging}
      isSelected={isSelected}
      isMuted={isMuted}
      isSoloed={isSoloed}
      // isBuffering={isBuffering}
      averagePoint={averagePoint}
      editorPosition={{ x: editorX, y: editorY }}
      // shape event handlers
      dragBoundFunc={dragBoundFunc}
      handleDrag={handleDrag}
      handleDragStart={() => setIsDragging(true)}
      handleDragEnd={() => setIsDragging(false)}
      handleClick={() => {
        // pass points if needed for duplication
        const absolutePoints = getAbsolutePoints();
        handleClick(index, absolutePoints);
      }}
      handleMouseDown={handleMouseDown}
      handleMouseOver={() => setIsHoveredOver(true)}
      handleMouseOut={() => setIsHoveredOver(false)}
      handleVertexDragMove={handleVertexDragMove}
      // editor panel handlers
      handleColorChange={handleColorChange}
      //  handleQuantizeClick={() => 'handleQuantizeClick'}
      handleDelete={handleDelete}
      handleQuantizeFactorChange={handleQuantizeFactorChange}
      handleVolumeChange={handleVolumeChange(index)}
      handleMuteChange={handleMuteChange(index)}
      handleSoloChange={() => handleSoloChange(index)}
      handleToTopClick={handleToTopClick}
      handleToBottomClick={handleToBottomClick}
      handleReverseClick={handleReverseClick}
      handleDuplicateClick={() => {
        // pass points if needed for duplication
        const absolutePoints = getAbsolutePoints();
        handleShapeDuplicate(index, absolutePoints);
      }}
    />
  );
}

export default React.memo(ShapeContainerV2);
