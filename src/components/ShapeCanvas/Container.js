import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Circle } from 'react-konva';

import Utils from 'utils/Utils.js';
import ShapeCanvasComponent from './Component';

const propTypes = {
  activeTool: PropTypes.string.isRequired,
  tempo: PropTypes.number.isRequired,
  selectedInstruments: PropTypes.array.isRequired,
  scaleObj: PropTypes.object.isRequired,
  
  isPlaying: PropTypes.bool.isRequired,
  isGridActive: PropTypes.bool.isRequired,
  isSnapToGridActive: PropTypes.bool.isRequired,
  isAutoQuantizeActive: PropTypes.bool.isRequired,
  quantizeLength: PropTypes.number.isRequired,
  
  colorIndex: PropTypes.number.isRequired,
  colorsList: PropTypes.array.isRequired,

  knobVals: PropTypes.array.isRequired,
};

/*
  The ShapeCanvas is canvas where the shapes are drawn
*/
class ShapeCanvas extends Component {
  constructor (props) {
    super(props);

    this.state = {
      shapesList: [],
      deletedShapeIndeces: [],
      selectedShapeIndex: -1,

      currPoints: [],
      drawingState: 'pending',
      mousePos: { x: 0, y: 0 },
      gridSize: 50,
    };

    this.originLockRadius = 15;
    this.gridDots = this.createGrid();

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleShapeClick = this.handleShapeClick.bind(this);
    this.handleShapeDelete = this.handleShapeDelete.bind(this);
    this.snapToGrid = this.snapToGrid.bind(this);
    
    this.clearAll = this.clearAll.bind(this);
  }

  componentDidMount () {
    // this.setState({
    //   shapesList: this.generateRandomShapes(10, 20)
    // });
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeTool === 'draw') {
      this.setState({
        selectedShapeIndex: -1
      });
    }
  }

  appendShape () {
    const shapesList = this.state.shapesList.slice();
    const points = this.state.currPoints.slice();
    shapesList.push(points);
    
    const deletedShapeIndeces = this.state.deletedShapeIndeces.slice();
    deletedShapeIndeces.push(0);

    this.setState({
      shapesList: shapesList,
      deletedShapeIndeces: deletedShapeIndeces,
      currPoints: []
    });
  }

  canChangeTool () {
    return this.state.drawingState === 'pending';
  }

  deleteSelectedShape () {
    if (this.state.selectedShapeIndex >= 0) {
      this.handleShapeDelete(this.state.selectedShapeIndex);
    }
  }

  clearAll () {
    this.setState({
      shapesList: [],
      deletedShapeIndeces: []
    });
  }

  /* ============================== HANDLERS ============================== */
    
  handleMouseDown () {
    document.activeElement.blur();
    this.setState({
      selectedShapeIndex: -1
    });
  }

  handleClick (e) {
    // this.props.closeColorPicker();

    // left click
    if (e.evt.which === 1) {
      if (this.props.activeTool === 'draw') {
        // hovering over first point
        if (this.state.drawingState === 'preview') {
          this.appendShape();
          this.setState({
            drawingState: 'pending'
          });
        } else {
          const newPoints = this.state.currPoints.slice();
          newPoints.push(this.state.mousePos.x, this.state.mousePos.y);
          this.setState({
            currPoints: newPoints,
            drawingState: 'drawing'
          });
        }
      }
    }
    // right click to cancel shape mid-draw
    else if (e.evt.which === 3) {
      if (this.state.drawingState !== 'pending') {
        this.setState({
          currPoints: [],
          drawingState: 'pending'
        });
      }
    }
  }

  handleMouseMove (e) {
    let x = e.evt.offsetX;
    let y = e.evt.offsetY;
    const originX = this.state.currPoints[0];
    const originY = this.state.currPoints[1];
    
    let drawingState = this.state.drawingState === 'pending' ? 'pending' : 'drawing';
    
    // snap to grid
    x = this.snapToGrid(x);
    y = this.snapToGrid(y);

    if (this.props.activeTool === 'draw') {
      // snap to origin if within radius
      if (this.state.currPoints.length > 2 && (Utils.dist(e.evt.offsetX, e.evt.offsetY, originX, originY) < this.originLockRadius
          || (x === originX && y === originY))) {
        x = originX;
        y = originY;
        drawingState = 'preview';
      }
    
      this.setState({
        mousePos: { x: x, y: y },
        drawingState: drawingState
      });
    }
  }

  handleShapeClick (index) {
    this.setState({
      selectedShapeIndex: index
    });
  }

  handleShapeDelete (index) {
    const deletedShapeIndeces = this.state.deletedShapeIndeces.slice();
    deletedShapeIndeces[index] = true;
     
    this.setState({
      deletedShapeIndeces: deletedShapeIndeces
    });
  }

  /* ================================ GRID ================================ */

  createGrid () {
    const gridDots = [];
    const color = '#999';
    const radius = 1;

    for (let x = this.state.gridSize; x < window.innerWidth; x += this.state.gridSize) {
      for (let y = this.state.gridSize; y < window.innerHeight; y += this.state.gridSize) {
        const gridDot = (
          <Circle 
            key={'dot'+x+y}
            x={x}
            y={y}
            radius={radius}
            fill={color}>
          </Circle>
        );
        gridDots.push(gridDot);
      }
    }
    return gridDots;
  }

  snapToGrid (point) {
    return this.props.isSnapToGridActive ? 
      Math.round(point / this.state.gridSize) * this.state.gridSize : 
      Math.round(point / 1) * 1;
  }

  /* =============================== TESTING ============================== */

  generateRandomShapes (nShapes, nPoints) {
    const shapesList = [];

    for (var i = 0; i < nShapes; i++) {
      const pointsList = [];
      for (var j = 0; j < nPoints * 2; j++) {
        if (j % 2) {
          pointsList.push(parseInt(Math.random() * (window.innerHeight - 100), 10));
        } else {
          pointsList.push(parseInt(Math.random() * (window.innerWidth - 20) + 20, 10));
        }
      }
      shapesList.push(pointsList);
    }
    
    return shapesList;
  }
  
  /* =============================== RENDER =============================== */

  render () {
    const gridDots = this.props.isGridActive ? this.gridDots : null;

    return (
      <ShapeCanvasComponent 
        height={window.innerHeight}
        width={window.innerWidth}
        onContentClick={this.handleClick}
        onContentMouseMove={this.handleMouseMove}
        onContentMouseDown={this.handleMouseDown}
        gridDots={gridDots}
        quantizeLength={this.props.quantizeLength}

        shapesList={this.state.shapesList}
        selectedShapeIndex={this.state.selectedShapeIndex}
        deletedShapeIndeces={this.state.deletedShapeIndeces}
        
        colorsList={this.props.colorsList}
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
      />
    );
  }
}

ShapeCanvas.propTypes = propTypes;

export default ShapeCanvas;
