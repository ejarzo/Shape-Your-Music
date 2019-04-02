import React from 'react';
import { number, bool, string, object, func, array } from 'prop-types';
import { Circle, Group, Line } from 'react-konva';

import { getPerimeterLength } from 'utils/shape';
import { convertValToRange } from 'utils/math';
import { themeColors, appColors } from 'utils/color';

import ShapeVertex from './ShapeVertex';
import Portal from 'react-portal';
import ShapeEditorPopover from './ShapeEditorPopover';
import withProjectContext from 'views/Project/withProjectContext';
import { TOOL_TYPES } from 'views/Project/Container';

const propTypes = {
  scaleObj: object.isRequired,
  activeTool: string.isRequired,
  isPlaying: bool.isRequired,
  tempo: number.isRequired,

  points: array.isRequired,
  attrs: object.isRequired,

  noteIndexModifier: number.isRequired,

  colorIndex: number.isRequired,
  index: number.isRequired,
  volume: number.isRequired,

  isSelected: bool.isRequired,
  isMuted: bool.isRequired,
  isDragging: bool.isRequired,
  isSoloed: bool.isRequired,

  dragBoundFunc: func.isRequired,
  handleDrag: func.isRequired,
  handleDragStart: func.isRequired,
  handleDragEnd: func.isRequired,

  handleClick: func.isRequired,
  handleMouseDown: func.isRequired,
  handleMouseOver: func.isRequired,
  handleMouseOut: func.isRequired,
  handleVertexDragMove: func.isRequired,

  handleVolumeChange: func.isRequired,
  handleMuteChange: func.isRequired,
  handleSoloChange: func.isRequired,
  handleColorChange: func.isRequired,
  handleDelete: func.isRequired,
  handleQuantizeFactorChange: func.isRequired,
  handleToTopClick: func.isRequired,
  handleToBottomClick: func.isRequired,
  handleReverseClick: func.isRequired,

  averagePoint: object.isRequired,
  editorPosition: object.isRequired,
};

class ShapeComponent extends React.Component {
  componentDidMount() {
    const { onMount } = this.props;
    onMount(this);
  }

  getShapeElement() {
    return this.shapeElement;
  }

  getGroupElement() {
    return this.groupElement;
  }

  getAnimCircle() {
    return this.animCircle;
  }

  render() {
    const {
      // project context
      scaleObj,
      isPlaying,
      activeTool,
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
    } = this.props;

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

    const animCircle = isPlaying && (
      <Circle
        ref={c => (this.animCircle = c)}
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

    if (isEditMode) {
      return (
        <Group
          ref={c => (this.groupElement = c)}
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
            ref={c => (this.shapeElement = c)}
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
          {animCircle}

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
                top: averagePoint.y + 20,
                left: averagePoint.x - 20,
                fontSize: '0.8em',
                borderRadius: 2,
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              }}
            >
              PAN: {panningVal}
              <br />
              NOTE: {scaleObj.get(noteIndexModifier).toString()}
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
            />
          </Portal>
        </Group>
      );
    } else {
      return (
        <Group
          ref={c => (this.groupElement = c)}
          hitGraphEnabled={false}
          draggable={false}
          opacity={attrs.opacity}
          transformsEnabled="position"
        >
          <Line
            ref={c => (this.shapeElement = c)}
            strokeScaleEnabled={false}
            transformsEnabled="position"
            points={points}
            fill={attrs.fill}
            lineJoin="miter"
            stroke={color}
            strokeWidth={attrs.strokeWidth}
            closed
          />

          <ShapeVertex
            index={0}
            color={color}
            p={{
              x: points[0],
              y: points[1],
            }}
            onVertexDragMove={handleVertexDragMove(0)}
          />

          {animCircle}
        </Group>
      );
    }
  }
}

ShapeComponent.propTypes = propTypes;

export default withProjectContext(ShapeComponent);
