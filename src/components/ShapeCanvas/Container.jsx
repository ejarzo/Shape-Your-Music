import React, { Component } from 'react';
import { object, string, number, array, bool, func } from 'prop-types';

import { convertValToRange, dist } from 'utils/math';
import { themeColors } from 'utils/color';
import ShapeCanvasComponent from './Component';
import { TOOL_TYPES } from 'utils/project';

import withProjectContext from 'components/Project/withProjectContext';
import Tone from 'tone';

export const DRAWING_STATES = {
  PENDING: 'pending', // not currently drawing
  PREVIEW: 'preview', // mouse is hovered over final position, showing a preview of the finished shape
  DRAWING: 'drawing', // drawing but not previewing
};

/* Setup Tone Listener */
Tone.Listener.upX = 0;
Tone.Listener.upY = 0;
Tone.Listener.upZ = 1;
Tone.Listener.forwardX = 1;
Tone.Listener.forwardY = 1;
Tone.Listener.forwardZ = 0;

const updateToneListener = (x, y) => {
  Tone.Listener.setPosition(x, y, 40);
};

const propTypes = {
  onMount: func.isRequired,
  // Context
  activeTool: string.isRequired,
  tempo: number.isRequired,
  scaleObj: object.isRequired,
  isPlaying: bool.isRequired,
  isGridActive: bool.isRequired,
  isSnapToGridActive: bool.isRequired,
  isAutoQuantizeActive: bool.isRequired,
  isProximityModeActive: bool.isRequired,
  activeColorIndex: number.isRequired,
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
      drawingState: DRAWING_STATES.PENDING,
      mousePos: { x: -10, y: -10 },
      gridSize: 50,
    };

    this.shapeRefs = [];

    this.state = this.initState;

    this.defaultVolume = -5;
    this.originLockRadius = 15;

    this.snapToGrid = this.snapToGrid.bind(this);
    this.clearAll = this.clearAll.bind(this);

    this.getShapesList = this.getShapesList.bind(this);
    this.getScreenshot = this.getScreenshot.bind(this);
    this.duplicateShape = this.duplicateShape.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDrag = this.handleMouseDrag.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleShapeClick = this.handleShapeClick.bind(this);
    this.handleShapeDelete = this.handleShapeDelete.bind(this);

    this.handleShapeColorChange = this.handleShapeColorChange.bind(this);
    this.handleShapeVolumeChange = this.handleShapeVolumeChange.bind(this);
    this.handleShapeSoloChange = this.handleShapeSoloChange.bind(this);
    this.handleShapeMuteChange = this.handleShapeMuteChange.bind(this);
  }

  componentDidMount() {
    const { onMount, initShapesList } = this.props;
    console.log('initshapeslist', initShapesList);
    onMount(this);
    this.setState({
      shapesList: initShapesList || [],
    });
    // this.setState({
    //   shapesList: this.generateRandomShapes(2, 4),
    // });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.activeTool === TOOL_TYPES.DRAW) {
      this.setState({
        selectedShapeIndex: -1,
      });
    }
  }

  getScreenshot() {
    const resizedCanvas = document.createElement('canvas');
    const resizedContext = resizedCanvas.getContext('2d');

    const windowAspectRatio = window.innerHeight / window.innerWidth;
    const width = 300;
    const height = width * windowAspectRatio;
    resizedCanvas.width = `${width}`;
    resizedCanvas.height = `${height}`;

    const canvas = document.getElementsByTagName('canvas')[0];

    resizedContext.drawImage(canvas, 0, 0, width, height);
    const myResizedData = resizedCanvas.toDataURL();
    return myResizedData;
  }

  getShapesList() {
    const shapesList = this.state.shapesList.slice();
    const { deletedShapeIndeces } = this.state;

    /* Get absolute points for each shape */
    shapesList.forEach((shape, i) => {
      if (deletedShapeIndeces[i]) return;
      const { points, quantizeFactor } = this.shapeCanvas.getShapeState(i);
      shapesList[i].points = points;
      shapesList[i].quantizeFactor = quantizeFactor;
    });

    return shapesList.filter((_, i) => !deletedShapeIndeces[i]);
  }

  appendShape() {
    const { activeColorIndex } = this.props;
    const shapesList = this.state.shapesList.slice();
    const points = this.state.currPoints.slice();
    shapesList.push({
      points,
      colorIndex: activeColorIndex,
      volume: this.defaultVolume,
      isMuted: false,
    });

    const deletedShapeIndeces = this.state.deletedShapeIndeces.slice();
    deletedShapeIndeces.push(0);

    this.setState({
      shapesList,
      deletedShapeIndeces,
      currPoints: [],
    });
  }

  canChangeTool() {
    return this.state.drawingState === DRAWING_STATES.PENDING;
  }

  cancelInProgressShape() {
    const { drawingState } = this.state;
    if (drawingState !== DRAWING_STATES.PENDING) {
      this.setState({
        currPoints: [],
        drawingState: DRAWING_STATES.PENDING,
      });
    }
  }

  getShapeMIDINoteEvents() {
    console.log(this.shapeCanvas);
    const midiSequences = this.shapeCanvas.getShapeMIDISequences();
    return midiSequences;
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

  duplicateShape(index, points) {
    const { shapesList } = this.state;

    const newShapesList = shapesList.slice();
    const { colorIndex } = newShapesList[index];
    const newShape = {
      points: points.map(p => p + 20),
      colorIndex,
      volume: this.defaultVolume,
      isMuted: false,
    };
    newShapesList.push(newShape);
    this.setState({ shapesList: newShapesList });
  }
  /* ============================== HANDLERS ============================== */

  handleMouseDown() {
    document.activeElement.blur();
    this.setState({
      selectedShapeIndex: -1,
    });
  }

  handleClick(e) {
    const { activeTool } = this.props;
    const { drawingState } = this.state;

    // left click
    if (e.evt.which === 1) {
      if (activeTool === TOOL_TYPES.DRAW) {
        // hovering over first point
        if (drawingState === DRAWING_STATES.PREVIEW) {
          this.appendShape();
          this.setState({
            drawingState: DRAWING_STATES.PENDING,
          });
        } else {
          const {
            currPoints,
            mousePos: { x, y },
          } = this.state;
          const len = currPoints.length;
          // only add point if the mouse has moved
          if (!(x === currPoints[len - 2] && y === currPoints[len - 1])) {
            const newPoints = currPoints.slice();

            newPoints.push(x, y);
            this.setState({
              currPoints: newPoints,
              drawingState: DRAWING_STATES.DRAWING,
            });
          }
        }
      }
    }
    // right click to cancel shape mid-draw
    else if (e.evt.which === 3) {
      this.cancelInProgressShape();
    }
  }

  handleMouseDrag({ evt }) {
    const { isProximityModeActive } = this.props;
    const { clientX, clientY } = evt;
    const x = clientX;
    const y = clientY - 80;
    if (isProximityModeActive) {
      updateToneListener(x, y);
    }
    this.setState({
      mousePos: { x, y },
    });
  }

  handleMouseMove({ evt: { offsetX, offsetY } }) {
    const { activeTool, isProximityModeActive } = this.props;
    const { drawingState, currPoints } = this.state;

    let x = offsetX;
    let y = offsetY;

    if (isProximityModeActive) {
      updateToneListener(x, y);
    }

    const originX = this.state.currPoints[0];
    const originY = this.state.currPoints[1];

    let newDrawingState =
      drawingState === DRAWING_STATES.PENDING
        ? DRAWING_STATES.PENDING
        : DRAWING_STATES.DRAWING;

    // snap to grid
    x = this.snapToGrid(x);
    y = this.snapToGrid(y);

    if (activeTool === TOOL_TYPES.DRAW) {
      // snap to origin if within radius
      if (
        currPoints.length > 2 &&
        (dist(offsetX, offsetY, originX, originY) < this.originLockRadius ||
          (x === originX && y === originY))
      ) {
        x = originX;
        y = originY;
        newDrawingState = DRAWING_STATES.PREVIEW;
      }

      this.setState({
        mousePos: { x: x, y: y },
        drawingState: newDrawingState,
      });
    } else {
      this.setState({
        mousePos: { x: offsetX, y: offsetY },
      });
    }
  }

  /* ====================== Shape handlers ====================== */

  handleShapeClick(index, points) {
    const { isAltPressed } = this.props;
    if (isAltPressed) {
      this.duplicateShape(index, points);
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
    for (let i = 0; i < nShapes; i++) {
      const pointsList = [];
      for (let j = 0; j < nPoints * 2; j++) {
        const rand = Math.random();
        if (j % 2) {
          const y = convertValToRange(
            rand,
            0,
            1,
            window.innerHeight * 0.2,
            window.innerHeight * 0.8
          );
          pointsList.push(y);
        } else {
          const x = convertValToRange(
            rand,
            0,
            1,
            window.innerWidth * 0.1,
            window.innerWidth * 0.9
          );
          pointsList.push(parseInt(x));
        }
      }
      shapesList.push({
        points: pointsList,
        colorIndex: Math.floor(Math.random() * 5),
        volume: this.defaultVolume,
        isMuted: false,
      });
    }

    return shapesList;
  }

  /* =============================== RENDER =============================== */

  render() {
    const {
      gridSize,
      shapesList,
      selectedShapeIndex,
      soloedShapeIndex,
      deletedShapeIndeces,
      mousePos,
      currPoints,
      drawingState,
    } = this.state;

    return (
      <ShapeCanvasComponent
        ref={c => (this.shapeCanvas = c)}
        height={window.innerHeight - 80}
        width={window.innerWidth}
        gridSize={gridSize}
        onContentClick={this.handleClick}
        onContentMouseMove={this.handleMouseMove}
        onDragMove={this.handleMouseDrag}
        onContentMouseDown={this.handleMouseDown}
        shapesList={shapesList}
        selectedShapeIndex={selectedShapeIndex}
        soloedShapeIndex={soloedShapeIndex}
        deletedShapeIndeces={deletedShapeIndeces}
        mousePos={mousePos}
        currPoints={currPoints}
        drawingState={drawingState}
        snapToGrid={this.snapToGrid}
        handleShapeClick={this.handleShapeClick}
        handleShapeDelete={this.handleShapeDelete}
        handleShapeSoloChange={this.handleShapeSoloChange}
        handleShapeColorChange={this.handleShapeColorChange}
        handleShapeVolumeChange={this.handleShapeVolumeChange}
        handleShapeMuteChange={this.handleShapeMuteChange}
        handleShapeDuplicate={this.duplicateShape}
      />
    );
  }
}

ShapeCanvas.propTypes = propTypes;

export default withProjectContext(ShapeCanvas);
