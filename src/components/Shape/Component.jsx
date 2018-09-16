import React from 'react';
import PropTypes from 'prop-types';
import { Circle, Group, Line } from 'react-konva';

import Utils from 'utils/Utils';
import ShapeVertex from './ShapeVertex';
import Portal from 'react-portal';
import ShapeEditorPopover from './ShapeEditorPopover';

const propTypes = {
  project: PropTypes.shape({
    scaleObj: PropTypes.object.isRequired,
    colorsList: PropTypes.array.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    tempo: PropTypes.number.isRequired,
  }).isRequired,

  points: PropTypes.array.isRequired,
  attrs: PropTypes.object.isRequired,

  noteIndexModifier: PropTypes.number.isRequired,

  colorIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,

  isSelected: PropTypes.bool.isRequired,
  isMuted: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  soloedShapeIndex: PropTypes.number.isRequired,

  dragBoundFunc: PropTypes.func.isRequired,
  handleDrag: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  handleDragEnd: PropTypes.func.isRequired,

  handleClick: PropTypes.func.isRequired,
  handleMouseDown: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseOut: PropTypes.func.isRequired,
  handleVertexDragMove: PropTypes.func.isRequired,

  handleVolumeChange: PropTypes.func.isRequired,
  handleMuteChange: PropTypes.func.isRequired,
  handleSoloChange: PropTypes.func.isRequired,
  handleColorChange: PropTypes.func.isRequired,
  handleQuantizeClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleQuantizeFactorChange: PropTypes.func.isRequired,
  handleToTopClick: PropTypes.func.isRequired,
  handleToBottomClick: PropTypes.func.isRequired,

  averagePoint: PropTypes.object.isRequired,
  editorPosition: PropTypes.object.isRequired,
};

class ShapeComponent extends React.Component {
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
    const color = this.props.project.colorsList[this.props.colorIndex];
    let panningVal = parseInt(
      Utils.convertValToRange(
        this.props.averagePoint.x,
        0,
        window.innerWidth,
        -50,
        50
      ),
      10
    );
    if (panningVal > 0) {
      panningVal = `${panningVal} R`;
    } else if (panningVal < 0) {
      panningVal = `${Math.abs(panningVal)} L`;
    }

    const animCircle = this.props.project.isPlaying && (
      <Circle
        ref={c => (this.animCircle = c)}
        hitGraphEnabled={false}
        x={-999}
        y={-999}
        radius={6}
        strokeWidth={2}
        stroke={color}
        fill={color}
      />
    );

    const perimeter = Utils.getTotalLength(this.props.points);
    if (this.props.project.isEditMode) {
      return (
        <Group
          ref={c => (this.groupElement = c)}
          draggable
          dragBoundFunc={this.props.dragBoundFunc}
          onDragMove={this.props.handleDrag}
          onDragStart={this.props.handleDragStart}
          onDragEnd={this.props.handleDragEnd}
          opacity={this.props.attrs.opacity}
        >
          {/* shape perimeter */}
          <Line
            ref={c => (this.shapeElement = c)}
            points={this.props.points}
            fill={this.props.attrs.fill}
            lineJoin="bevel"
            stroke={this.props.attrs.stroke}
            strokeWidth={this.props.attrs.strokeWidth}
            closed
            strokeScaleEnabled={false}
            onClick={this.props.handleClick}
            onMouseDown={this.props.handleMouseDown}
            onMouseOver={this.props.handleMouseOver}
            onMouseOut={this.props.handleMouseOut}
          />

          {/* shape verteces */}
          {this.props.points.map(
            (p, i, arr) =>
              !(i % 2) && (
                <ShapeVertex
                  key={i}
                  index={i}
                  p={{
                    x: p,
                    y: arr[i + 1],
                  }}
                  onVertexDragMove={this.props.handleVertexDragMove(i)}
                  color={color}
                />
              )
          )}

          {/* node that travels around the perimeter when playing */}
          {animCircle}

          {/* tooltip that appears on drag */}
          <Portal isOpened={this.props.isDragging}>
            <div
              style={{
                textTransform: 'capitalize',
                color: '#fff',
                backgroundColor: color,
                padding: '5px',
                position: 'absolute',
                opacity: 0.8,
                top: this.props.averagePoint.y + 20,
                left: this.props.averagePoint.x - 20,
                fontSize: '0.8em',
              }}
            >
              PAN: {panningVal}
              <br />
              NOTE:{' '}
              {this.props.project.scaleObj
                .get(this.props.noteIndexModifier)
                .toString()}
            </div>
          </Portal>

          {/* editor panel that opens on shape click */}
          <Portal isOpened={this.props.isSelected}>
            <ShapeEditorPopover
              index={this.props.index}
              position={this.props.editorPosition}
              tempo={this.props.project.tempo}
              volume={this.props.volume}
              onVolumeChange={this.props.handleVolumeChange}
              isMuted={this.props.isMuted}
              onMuteChange={this.props.handleMuteChange}
              isSoloed={this.props.soloedShapeIndex === this.props.index}
              onSoloChange={this.props.handleSoloChange}
              colorIndex={this.props.colorIndex}
              colorsList={this.props.project.colorsList}
              onColorChange={this.props.handleColorChange}
              onQuantizeClick={this.props.handleQuantizeClick}
              onDeleteClick={this.props.handleDelete}
              onQuantizeFactorChange={this.props.handleQuantizeFactorChange}
              perimeter={perimeter}
              onToTopClick={this.props.handleToTopClick}
              onToBottomClick={this.props.handleToBottomClick}
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
          opacity={this.props.attrs.opacity}
        >
          <Line
            ref={c => (this.shapeElement = c)}
            strokeScaleEnabled={false}
            points={this.props.points}
            fill={this.props.attrs.fill}
            lineJoin="miter"
            stroke={color}
            strokeWidth={this.props.attrs.strokeWidth}
            closed
          />

          <ShapeVertex
            index={0}
            color={color}
            p={{
              x: this.props.points[0],
              y: this.props.points[1],
            }}
            onVertexDragMove={this.props.handleVertexDragMove(0)}
          />

          {animCircle}
        </Group>
      );
    }
  }
}

ShapeComponent.propTypes = propTypes;

export default ShapeComponent;
