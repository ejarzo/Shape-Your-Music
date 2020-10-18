import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
} from 'react';
import { themeColors, appColors } from 'utils/color';
import { TOOL_TYPES } from 'utils/project';
import { ProjectContext } from 'components/Project/ProjectContextProvider';

import { convertValToRange } from 'utils/math';
import {
  getPerimeterLength,
  getAveragePoint,
  getPointsForFixedPerimeterLength,
  convertPointsToMIDINoteEvents,
} from 'utils/shape';

import { useShapeAttrs } from './useShapeAttrs';
import { useShapeSynth } from './useShapeSynth';
import ShapeComponent from './ComponentV2';

function ShapeContainerV2(props, ref) {
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
    panVal: 0,
  });

  const {
    points,
    noteIndexModifier,
    averagePoint,
    editorX,
    editorY,
    firstNoteIndex,
    quantizeFactor,
    panVal,
  } = state;

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

  /* 
    Executes every time a note plays.
    Animates the perimeter Dot to move around the shape as it plays
  */
  const isPlayingAnimator = useCallback(
    (val, dur) => () => {
      const { pIndex } = val;

      const xFrom = points[pIndex - 2];
      const yFrom = points[pIndex - 1];
      const xTo = pIndex >= points.length ? points[0] : points[pIndex];
      const yTo = pIndex >= points.length ? points[1] : points[pIndex + 1];

      const shapeFill = shapeAttrs.fill;
      if (!shapeRef.current) return;
      shapeRef.current.flashFill(shapeFill);
      shapeRef.current.setProgressDotAttrs({
        x: xFrom,
        y: yFrom,
        fill: appColors.white,
        radius: 8,
      });
      shapeRef.current.setProgressDotTo({
        x: xTo,
        y: yTo,
        duration: dur,
      });
      shapeRef.current.setProgressDotTo({
        radius: 5,
        fill: themeColors[colorIndex],
        duration: 0.3,
      });
    },
    [points, colorIndex, shapeAttrs.fill]
  );

  const { isBuffering } = useShapeSynth({
    colorIndex,
    volume,
    isPlayingAnimator,
    points,
    noteIndexModifier,
    firstNoteIndex,
    isMuted,
    isSoloed,
    panVal,
  });

  // ======================= HOOKS =======================

  useEffect(() => {
    // initializes starting note
    handleDrag();
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      setIsHoveredOver(false);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isAutoQuantizeActive) {
      setState(s => {
        const newPoints = getPointsForFixedPerimeterLength(
          s.points,
          quantizeLength * s.quantizeFactor
        );

        return { ...s, points: newPoints };
      });
    }
  }, [isAutoQuantizeActive]);

  useImperativeHandle(ref, () => ({
    getSaveDataState: () => {
      return {
        points: getAbsolutePoints(),
        quantizeFactor,
      };
    },
    getMIDINoteEvents: () =>
      convertPointsToMIDINoteEvents({
        firstNoteIndex,
        points,
        scaleObj,
        noteIndexModifier,
      }),
  }));

  // ====================== HANDLERS ======================

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
      const panVal = convertValToRange(x, 0, window.innerWidth, -1, 1);
      const noteIndexVal = parseInt(
        convertValToRange(y, 0, window.innerHeight, 5, -7),
        10
      );
      return {
        ...s,
        panVal,
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

  const resetHover = () => {
    // hack to update Konva layout following imperative changes
    setIsHoveredOver(true);
    setIsHoveredOver(false);
  };

  const handleToTopClick = () => {
    shapeRef.current.moveToTop();
    resetHover();
  };

  const handleToBottomClick = () => {
    shapeRef.current.moveToBottom();
    resetHover();
  };

  const handleQuantizeFactorChange = factor => () => {
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
        return {
          ...s,
          points: newPoints,
          quantizeFactor: factor * quantizeFactor,
        };
      }
      return s;
    });
  };

  const getAbsolutePoints = () => {
    const { x, y } = shapeRef.current.getAbsolutePosition();
    const absolutePoints = points.map((p, i) => (i % 2 === 0 ? p + x : p + y));
    return absolutePoints;
  };

  const handleReverseClick = () => {
    setState(s => {
      const { points } = s;
      const reversed = [points[0], points[1]];
      for (let i = points.length - 2; i >= 2; i -= 2) {
        reversed.push(points[i]);
        reversed.push(points[i + 1]);
      }
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
      isBuffering={isBuffering}
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

export default memo(forwardRef(ShapeContainerV2));
