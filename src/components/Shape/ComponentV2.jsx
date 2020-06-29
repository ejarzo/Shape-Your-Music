import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  useContext,
} from 'react';
import { Circle, Group, Line } from 'react-konva';

import { getPerimeterLength } from 'utils/shape';
import { convertValToRange } from 'utils/math';
import { themeColors, appColors } from 'utils/color';

import ShapeVertex from './ShapeVertex';
import Portal from 'react-portal';
import ShapeEditorPopover from './ShapeEditorPopover';
import { TOOL_TYPES } from 'components/Project';
import { ProjectContext } from 'components/Project/ProjectContextProvider';

function ShapeComponent(props, ref) {
  const shapeFillRef = useRef();
  const groupRef = useRef();
  const progressDotRef = useRef();

  useImperativeHandle(ref, () => ({
    getAbsolutePosition: () => shapeFillRef.current.getAbsolutePosition(),
    moveToTop: () => {
      groupRef.current.moveToTop();
    },
    moveToBottom: () => {
      groupRef.current.moveToBottom();
    },
    flashFill: fill => {
      if (!shapeFillRef.current) return;
      shapeFillRef.current.setAttrs({ fill: appColors.white });
      shapeFillRef.current.to({ fill, duration: 0.2 });
    },
    setProgressDotAttrs: attrs => {
      if (!progressDotRef.current) return;
      progressDotRef.current.setAttrs(attrs);
    },
    setProgressDotTo: to => {
      if (!progressDotRef.current) return;
      progressDotRef.current.to(to);
    },
  }));

  const { scaleObj, isPlaying, activeTool } = useContext(ProjectContext);
  const {
    // shape
    index,
    editorPosition,
    volume,
    isMuted,
    isSoloed,
    colorIndex,
    averagePoint,
    points,
    dragBoundFunc,
    attrs,
    isDragging,
    noteIndexModifier,
    isSelected,
    isBuffering,
    // handlers
    handleVolumeChange,
    handleMuteChange,
    handleSoloChange,
    handleColorChange,
    handleDelete,
    handleQuantizeFactorChange,
    handleToTopClick,
    handleToBottomClick,
    handleClick,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleMouseDown,
    handleMouseOver,
    handleMouseOut,
    handleVertexDragMove,
    handleReverseClick,
    handleDuplicateClick,
  } = props;

  const color = themeColors[colorIndex];
  let panningVal = parseInt(
    convertValToRange(averagePoint.x, 0, window.innerWidth, -50, 50),
    10
  );

  if (panningVal > 0) {
    panningVal = `${panningVal} R`;
  } else if (panningVal < 0) {
    panningVal = `${Math.abs(panningVal)} L`;
  }

  const progressDot = isPlaying && (
    <Circle
      key="progress-dot"
      ref={progressDotRef}
      hitGraphEnabled={false}
      transformsEnabled="position"
      x={-999}
      y={-999}
      radius={6}
      strokeWidth={2}
      stroke={color}
      fill={color}
    />
  );

  const isEditMode = activeTool === TOOL_TYPES.EDIT;
  const perimeter = getPerimeterLength(points);
  const startingNoteString = scaleObj.get(noteIndexModifier + 1).toString();

  if (isEditMode) {
    return (
      <Group
        key="shapeGroup"
        ref={groupRef}
        draggable
        dragBoundFunc={dragBoundFunc}
        onDragMove={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        opacity={attrs.opacity}
        transformsEnabled="position"
      >
        {/* shape perimeter */}
        <Line
          key="shapeLine"
          ref={shapeFillRef}
          points={points}
          fill={attrs.fill}
          lineJoin="bevel"
          stroke={attrs.stroke}
          strokeWidth={attrs.strokeWidth}
          closed
          strokeScaleEnabled={false}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          transformsEnabled="position"
        />

        {/* shape verteces */}
        {points.map(
          (p, i, arr) =>
            !(i % 2) && (
              <ShapeVertex
                dragBoundFunc={dragBoundFunc}
                key={i}
                index={i}
                p={{
                  x: p,
                  y: arr[i + 1],
                }}
                onVertexDragMove={handleVertexDragMove(i)}
                color={color}
              />
            )
        )}

        {/* node that travels around the perimeter when playing */}
        {progressDot}

        {/* tooltip that appears on drag */}
        <Portal isOpened={isDragging}>
          <div
            style={{
              textTransform: 'capitalize',
              color: appColors.white,
              backgroundColor: color,
              fontWeight: 'bold',
              padding: '5px',
              position: 'absolute',
              opacity: 0.8,
              top: averagePoint.y + 40,
              left: averagePoint.x - 40,
              fontSize: '0.8em',
              borderRadius: 2,
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            }}
          >
            <div>
              PAN: {panningVal}
              <br />
              NOTE: {startingNoteString}
            </div>
          </div>
        </Portal>

        {/* editor panel that opens on shape click */}
        <Portal isOpened={isSelected}>
          <ShapeEditorPopover
            index={index}
            position={editorPosition}
            colorIndex={colorIndex}
            volume={volume}
            perimeter={perimeter}
            isMuted={isMuted}
            isSoloed={isSoloed}
            // handlers
            onSoloChange={handleSoloChange}
            onMuteChange={handleMuteChange}
            onVolumeChange={handleVolumeChange}
            onColorChange={handleColorChange(index)}
            onQuantizeFactorChange={handleQuantizeFactorChange}
            onReverseClick={handleReverseClick}
            onToTopClick={handleToTopClick}
            onToBottomClick={handleToBottomClick}
            onDeleteClick={() => handleDelete(index)}
            onDuplicateClick={handleDuplicateClick}
          />
        </Portal>
      </Group>
    );
  } else {
    return (
      <Group
        key="shapeGroup"
        ref={groupRef}
        hitGraphEnabled={false}
        draggable={false}
        opacity={attrs.opacity}
        transformsEnabled="position"
      >
        <Line
          key="shapeLine"
          ref={shapeFillRef}
          strokeScaleEnabled={false}
          transformsEnabled="position"
          points={points}
          fill={attrs.fill}
          lineJoin="miter"
          stroke={color}
          strokeWidth={attrs.strokeWidth}
          closed
        />

        {/* loading indicator */}
        <Portal isOpened={isBuffering}>
          <div
            style={{
              textTransform: 'capitalize',
              color: appColors.white,
              backgroundColor: color,
              fontWeight: 'bold',
              padding: '2px',
              position: 'absolute',
              opacity: 0.8,
              top: averagePoint.y + 40,
              left: averagePoint.x - 20,
              fontSize: '0.6em',
              borderRadius: 2,
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            }}
          >
            Loading samples...
          </div>
        </Portal>

        <ShapeVertex
          index={0}
          color={color}
          p={{
            x: points[0],
            y: points[1],
          }}
          onVertexDragMove={handleVertexDragMove(0)}
        />

        {progressDot}
      </Group>
    );
  }
  // }
}

export default forwardRef(ShapeComponent);
