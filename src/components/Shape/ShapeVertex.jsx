import React, { Component } from 'react';
import Color from 'color';
import { useStrictMode, Circle } from 'react-konva';
useStrictMode(true);
/*
  The shape's vertecies. Can be dragged to edit the shape.
*/
class ShapeVertex extends Component {
  constructor(props) {
    super(props);

    const luminosity = Color(props.color).luminosity();
    this.lightenAmount = 1.8 * (1 - luminosity);

    this.defaultRadius = 4;
    this.hoverRadius = 6;
    this.strokeWidth = 2;

    this.state = {
      radius: this.defaultRadius,
      color: props.color,
    };

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOver() {
    this.setState({
      radius: this.hoverRadius,
    });
  }

  handleMouseOut() {
    this.setState({
      radius: this.defaultRadius,
    });
  }

  render() {
    // solid if first node, pale fill if not
    const fillColor =
      this.props.index === 0
        ? this.props.color
        : Color(this.props.color)
            .lighten(this.lightenAmount)
            .toString();

    return (
      <Circle
        x={this.props.p.x}
        y={this.props.p.y}
        radius={this.state.radius}
        fill={fillColor}
        stroke={this.props.color}
        strokeWidth={this.strokeWidth}
        draggable
        dragBoundFunc={this.props.dragBoundFunc}
        onDragMove={this.props.onVertexDragMove}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      />
    );
  }
}

export default ShapeVertex;
