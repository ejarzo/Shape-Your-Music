import React, { Component } from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import { convertValToRange } from 'utils/math';
import { appColors } from 'utils/color';
import { describeArc } from './utils';
import styles from './styles.module.css';

const propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  paramName: PropTypes.string.isRequired,
};

class Knob extends Component {
  constructor(props) {
    super(props);

    this.color = appColors.white;
    this.knobRadius = 15;
    this.knobStrokeWidth = 6;
    this.topArcStrokeWidth = 2;
    this.topArcRadius = this.knobRadius + this.topArcStrokeWidth + 1;
    this.startAngle = -137;
    this.endAngle = 137;

    this.dragStart = {
      x: 0,
      y: 0,
    };

    this.svgStyle = {
      height: 2 * (this.knobRadius + this.knobStrokeWidth),
      width: 2 * (this.knobRadius + this.knobStrokeWidth),
    };

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDragStart(e) {
    this.dragStart = {
      x: e.clientX,
      y: e.clientY,
      value: this.props.value,
    };
  }

  handleDrag(e) {
    const xDiff = e.clientX - this.dragStart.x;
    const yDiff = (e.clientY - this.dragStart.y) * -1;
    let newVal = this.dragStart.value + yDiff + xDiff;

    if (newVal > 100) {
      newVal = 100;
    }
    if (newVal < 0) {
      newVal = 0;
    }

    this.props.onChange(newVal);
  }

  render() {
    return (
      <div className={styles.knobContainer}>
        <div tabIndex="0" style={{ height: 42 }}>
          <Draggable
            axis="both"
            position={{ x: 0, y: 0 }}
            bounds={{ left: 0, top: 0, right: 0, bottom: 0 }}
            onStart={this.handleDragStart}
            onDrag={this.handleDrag}
            onStop={this.handleDragStop}
          >
            <svg className={styles.knobSvg} style={this.svgStyle}>
              {/* background static arc */}
              <path
                fill="none"
                stroke={this.color}
                strokeWidth={this.topArcStrokeWidth}
                d={describeArc(
                  this.knobRadius + this.knobStrokeWidth,
                  this.knobRadius + this.knobStrokeWidth,
                  this.topArcRadius,
                  this.startAngle,
                  this.endAngle
                )}
              />

              {/* dynamic arc */}
              <path
                fill="none"
                stroke={this.color}
                strokeWidth={this.knobStrokeWidth}
                d={describeArc(
                  this.knobRadius + this.knobStrokeWidth,
                  this.knobRadius + this.knobStrokeWidth,
                  this.knobRadius,
                  this.startAngle,
                  convertValToRange(
                    this.props.value,
                    0,
                    100,
                    this.startAngle,
                    this.endAngle
                  )
                )}
              />
            </svg>
          </Draggable>
        </div>
        <span className={styles.knobTitle}>{this.props.paramName}</span>
      </div>
    );
  }
}

Knob.propTypes = propTypes;

export default Knob;
