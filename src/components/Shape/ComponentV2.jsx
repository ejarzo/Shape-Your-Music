import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import { Circle, Group, Line } from 'react-konva';
import Portal from 'react-portal';

import { getPerimeterLength, getPanningValText } from 'utils/shape';
import { convertValToRange } from 'utils/math';
import { themeColors, appColors } from 'utils/color';

import ShapeVertex from './ShapeVertex';
import ShapeEditorPopover from './ShapeEditorPopover';
import { TOOL_TYPES } from 'utils/project';
import styles from './styles.module.css';
import { useProjectContext } from 'context/useProjectContext';

function ShapeComponent(props, ref) {
  const shapeFillRef = useRef();
  const groupRef = useRef();
  const progressDotRef = useRef();

  /* Functions used to control lower level access on shape */
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

  const { scaleObj, isPlaying, activeTool } = useProjectContext();
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
    handleVertexDelete,
    handleReverseClick,
    handleDuplicateClick,
  } = props;

  const color = themeColors[colorIndex];
  const isEditMode = activeTool === TOOL_TYPES.EDIT;
  const perimeter = getPerimeterLength(points);
  const startingNoteString = scaleObj.get(noteIndexModifier + 1).toString();
  let panningVal = parseInt(
    convertValToRange(averagePoint.x, 0, window.innerWidth, -50, 50),
    10
  );
  const panningValText = getPanningValText(panningVal);

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
                p={{ x: p, y: arr[i + 1] }}
                handleVertexDragMove={handleVertexDragMove(i)}
                handleVertexDelete={handleVertexDelete(i)}
                color={color}
              />
            )
        )}

        {/* node that travels around the perimeter when playing */}
        {progressDot}

        {/* tooltip that appears on drag */}
        <Portal isOpened={isDragging}>
          <div
            className={styles.shapeDraggingInfo}
            style={{
              backgroundColor: color,
              top: averagePoint.y + 40,
              left: averagePoint.x - 40,
            }}
          >
            <div>
              {`PAN: ${panningValText}`}
              <br />
              {`NOTE: ${startingNoteString}`}
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
            className={styles.shapeDraggingInfo}
            style={{
              backgroundColor: color,
              top: averagePoint.y + 40,
              left: averagePoint.x - 20,
            }}
          >
            {'Loading samples...'}
          </div>
        </Portal>

        <ShapeVertex
          index={0}
          color={color}
          p={{
            x: points[0],
            y: points[1],
          }}
          handleVertexDragMove={handleVertexDragMove(0)}
          handleVertexDelete={handleVertexDelete(0)}
        />

        {progressDot}
      </Group>
    );
  }
}

export default forwardRef(ShapeComponent);
