import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ShapeEditorPanelComponent from './Component';

const propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

/*
  Shape Editor Panel: appears when a shape is clicked on.
  Used to adjust/mix the shape
*/
class ShapeEditorPanel extends Component {
  constructor (props) {
    super(props);

    const width = 225;
    const height = 260;
    const xPad = 23;
    const yPad = 20;
    let { x, y } = this.props.position;
    y += yPad;

    let caretTop = 40;
    let isLeft = true;

    if (x + width + xPad > window.innerWidth) {
      isLeft = false;
      x = x - width - xPad;
    } else {
      x = x + xPad;
    }

    // keep on screen
    if (y + height > window.innerHeight) {
      y = window.innerHeight - height - 15;
      caretTop = this.props.position.y - y + 70;
      if (caretTop > height - 20) {
        caretTop = height - 20;
      }
    }

    this.state = {
      panelStyle: {
        width,
        height,
        left: x,
        top: y,
      },
      caretPosition: {
        top: caretTop,
        isLeft,
      }
    };
  }

  render () {
    return (
      <ShapeEditorPanelComponent
        {...this.props}
        panelStyle={this.state.panelStyle}
        caretPosition={this.state.caretPosition}
      />
    );
  }
}

ShapeEditorPanel.propTypes = propTypes;

export default ShapeEditorPanel;
