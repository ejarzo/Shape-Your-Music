import React, { Component } from 'react';
import { object, string, number, array, bool } from 'prop-types';

import { dist } from 'utils/math';
import { themeColors } from 'utils/color';
import ShapeCanvasComponent from './Component';
import { TOOL_TYPES } from 'views/Project/Container';

const propTypes = {
  activeTool: string.isRequired,
  tempo: number.isRequired,
  selectedInstruments: array.isRequired,
  scaleObj: object.isRequired,

  isPlaying: bool.isRequired,
  isGridActive: bool.isRequired,
  isSnapToGridActive: bool.isRequired,
  isAutoQuantizeActive: bool.isRequired,
  quantizeLength: number.isRequired,

  colorIndex: number.isRequired,

  knobVals: array.isRequired,
};

/*
  The ShapeCanvas is canvas where the shapes are drawn
*/
class ShapeCanvas extends Component {
  constructor(props) {
    super(props);

    this.initState = {
      shapesList: [],
      deletedShapeIndeces: [],
      selectedShapeIndex: -1,
      soloedShapeIndex: -1,

      currPoints: [],
      drawingState: 'pending',
      mousePos: { x: -10, y: -10 },
      gridSize: 50,
    };

    this.state = this.initState;

    this.defaultVolume = -5;
    this.originLockRadius = 15;

    this.snapToGrid = this.snapToGrid.bind(this);
    this.clearAll = this.clearAll.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleShapeClick = this.handleShapeClick.bind(this);
    this.handleShapeDelete = this.handleShapeDelete.bind(this);

    this.handleShapeColorChange = this.handleShapeColorChange.bind(this);
    this.handleShapeVolumeChange = this.handleShapeVolumeChange.bind(this);
    this.handleShapeSoloChange = this.handleShapeSoloChange.bind(this);
    this.handleShapeMuteChange = this.handleShapeMuteChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      shapesList: this.generateRandomShapes(2, 3),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeTool === TOOL_TYPES.DRAW) {
      this.setState({
        selectedShapeIndex: -1,
      });
    }
  }

  appendShape() {
    const { colorIndex } = this.props;
    const shapesList = this.state.shapesList.slice();
    const points = this.state.currPoints.slice();
    shapesList.push({
      points,
      colorIndex,
      volume: this.defaultVolume,
      isMuted: false,
    });

    const deletedShapeIndeces = this.state.deletedShapeIndeces.slice();
    deletedShapeIndeces.push(0);

    this.setState({
      shapesList: shapesList,
      deletedShapeIndeces: deletedShapeIndeces,
      currPoints: [],
    });
  }

  canChangeTool() {
    return this.state.drawingState === 'pending';
  }

  deleteSelectedShape() {
    const { selectedShapeIndex } = this.state;
    if (selectedShapeIndex >= 0) {
      this.handleShapeDelete(selectedShapeIndex);
    }
  }

  clearAll() {
    this.setState(this.initState);
  }

  /* ============================== HANDLERS ============================== */

  handleMouseDown() {
    document.activeElement.blur();
    this.setState({
      selectedShapeIndex: -1,
    });
  }

  handleClick(e) {
    // left click
    if (e.evt.which === 1) {
      if (this.props.activeTool === TOOL_TYPES.DRAW) {
        // hovering over first point
        if (this.state.drawingState === 'preview') {
          this.appendShape();
          this.setState({
            drawingState: 'pending',
          });
        } else {
          const {
            currPoints,
            mousePos: { x, y },
          } = this.state;
          const len = currPoints.length;
          // only add point if the mouse has moved
          if (!(x === currPoints[len - 2] && y === currPoints[len - 1])) {
            const newPoints = this.state.currPoints.slice();

            newPoints.push(x, y);
            this.setState({
              currPoints: newPoints,
              drawingState: 'drawing',
            });
          }
        }
      }
    }
    // right click to cancel shape mid-draw
    else if (e.evt.which === 3) {
      if (this.state.drawingState !== 'pending') {
        this.setState({
          currPoints: [],
          drawingState: 'pending',
        });
      }
    }
  }

  handleMouseMove({ evt: { offsetX, offsetY } }) {
    let x = offsetX;
    let y = offsetY;
    const originX = this.state.currPoints[0];
    const originY = this.state.currPoints[1];

    let drawingState =
      this.state.drawingState === 'pending' ? 'pending' : 'drawing';

    // snap to grid
    x = this.snapToGrid(x);
    y = this.snapToGrid(y);

    if (this.props.activeTool === TOOL_TYPES.DRAW) {
      // snap to origin if within radius
      if (
        this.state.currPoints.length > 2 &&
        (dist(offsetX, offsetY, originX, originY) < this.originLockRadius ||
          (x === originX && y === originY))
      ) {
        x = originX;
        y = originY;
        drawingState = 'preview';
      }

      this.setState({
        mousePos: { x: x, y: y },
        drawingState: drawingState,
      });
    }
  }

  /* ====================== Shape handlers ====================== */

  handleShapeClick(index, points) {
    const { isAltPressed } = this.props;
    if (isAltPressed) {
      const newShapesList = this.state.shapesList.slice();
      const { colorIndex } = newShapesList[index];
      const newShape = {
        points: points.map(p => p + 20),
        colorIndex,
        volume: this.defaultVolume,
        isMuted: false,
      };
      newShapesList.push(newShape);
      this.setState({ shapesList: newShapesList });
    } else {
      this.setState({
        selectedShapeIndex: index,
      });
    }
  }

  handleShapeDelete(index) {
    const deletedShapeIndeces = this.state.deletedShapeIndeces.slice();
    deletedShapeIndeces[index] = true;

    this.setState({ deletedShapeIndeces });
  }

  handleShapeSoloChange(index) {
    const { soloedShapeIndex } = this.state;
    this.setState({
      soloedShapeIndex: index === soloedShapeIndex ? -1 : index,
    });
  }

  handleShapeMuteChange(index) {
    return () => {
      const shapes = this.state.shapesList.slice();
      const shape = shapes[index];
      shape.isMuted = !shape.isMuted;
      shapes[index] = shape;

      this.setState({ shapesList: shapes });
    };
  }

  handleShapeColorChange(index) {
    return colorObj => {
      const shapes = this.state.shapesList.slice();
      const shape = shapes[index];
      shape.colorIndex = themeColors.indexOf(colorObj.hex);
      shapes[index] = shape;

      this.setState({
        shapesList: shapes,
      });
    };
  }

  handleShapeVolumeChange(index) {
    return volume => {
      const shapes = this.state.shapesList.slice();
      const shape = shapes[index];
      shape.volume = volume;
      shapes[index] = shape;

      this.setState({
        shapesList: shapes,
      });
    };
  }

  /* ================================ GRID ================================ */

  snapToGrid(point) {
    const { isSnapToGridActive } = this.props;
    const { gridSize } = this.state;
    return isSnapToGridActive
      ? Math.round(point / gridSize) * gridSize
      : Math.round(point / 1) * 1;
  }

  /* =============================== TESTING ============================== */

  generateRandomShapes(nShapes, nPoints) {
    const shapesList = [];

    for (var i = 0; i < nShapes; i++) {
      const pointsList = [];
      for (var j = 0; j < nPoints * 2; j++) {
        if (j % 2) {
          pointsList.push(
            parseInt(Math.random() * (window.innerHeight - 100), 10)
          );
        } else {
          pointsList.push(
            parseInt(Math.random() * (window.innerWidth - 20) + 20, 10)
          );
        }
      }
      shapesList.push({
        points: pointsList,
        colorIndex: 0,
        volume: this.defaultVolume,
        isMuted: false,
      });
    }

    return shapesList;
  }

  /* =============================== RENDER =============================== */

  render() {
    return (
      <ShapeCanvasComponent
        height={window.innerHeight}
        width={window.innerWidth}
        gridSize={this.state.gridSize}
        isGridActive={this.props.isGridActive}
        onContentClick={this.handleClick}
        onContentMouseMove={this.handleMouseMove}
        onContentMouseDown={this.handleMouseDown}
        quantizeLength={this.props.quantizeLength}
        shapesList={this.state.shapesList}
        selectedShapeIndex={this.state.selectedShapeIndex}
        soloedShapeIndex={this.state.soloedShapeIndex}
        deletedShapeIndeces={this.state.deletedShapeIndeces}
        colorIndex={this.props.colorIndex}
        mousePos={this.state.mousePos}
        currPoints={this.state.currPoints}
        activeTool={this.props.activeTool}
        drawingState={this.state.drawingState}
        snapToGrid={this.snapToGrid}
        tempo={this.props.tempo}
        scaleObj={this.props.scaleObj}
        isPlaying={this.props.isPlaying}
        isAutoQuantizeActive={this.props.isAutoQuantizeActive}
        selectedInstruments={this.props.selectedInstruments}
        knobVals={this.props.knobVals}
        handleShapeClick={this.handleShapeClick}
        handleShapeDelete={this.handleShapeDelete}
        handleShapeSoloChange={this.handleShapeSoloChange}
        handleShapeColorChange={this.handleShapeColorChange}
        handleShapeVolumeChange={this.handleShapeVolumeChange}
        handleShapeMuteChange={this.handleShapeMuteChange}
        isAltPressed={this.props.isAltPressed}
      />
    );
  }
}

ShapeCanvas.propTypes = propTypes;

export default ShapeCanvas;
