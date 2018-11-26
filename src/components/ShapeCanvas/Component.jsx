import React from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Group } from 'react-konva';
import Shape from 'components/Shape';
import PhantomShape from './PhantomShape';
import Grid from './Grid';
import { themeColors } from 'utils/color';

const propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onContentClick: PropTypes.func.isRequired,
  onContentMouseMove: PropTypes.func.isRequired,
  onContentMouseDown: PropTypes.func.isRequired,

  gridDots: PropTypes.array,
  quantizeLength: PropTypes.number.isRequired,

  shapesList: PropTypes.array.isRequired,
  selectedShapeIndex: PropTypes.number.isRequired,
  soloedShapeIndex: PropTypes.number.isRequired,
  deletedShapeIndeces: PropTypes.array.isRequired,

  colorIndex: PropTypes.number.isRequired,

  mousePos: PropTypes.object.isRequired,
  currPoints: PropTypes.array.isRequired,
  activeTool: PropTypes.string.isRequired,
  drawingState: PropTypes.string.isRequired,
  snapToGrid: PropTypes.func.isRequired,

  tempo: PropTypes.number.isRequired,
  scaleObj: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isAutoQuantizeActive: PropTypes.bool.isRequired,

  selectedInstruments: PropTypes.array.isRequired,
  knobVals: PropTypes.array.isRequired,

  handleShapeClick: PropTypes.func.isRequired,
  handleShapeDelete: PropTypes.func.isRequired,
  handleShapeSolo: PropTypes.func.isRequired,
};

function ShapeCanvasComponent(props) {
  const {
    snapToGrid,
    activeTool,
    scaleObj,
    isPlaying,
    isAutoQuantizeActive,
    selectedShapeIndex,
    soloedShapeIndex,
    selectedInstruments,
    knobVals,
    tempo,
    // handlers
    handleShapeClick,
    handleShapeDelete,
    handleShapeColorChange,
    handleShapeVolumeChange,
    handleShapeSoloChange,
    handleShapeMuteChange,
  } = props;

  return (
    <div
      id="holder"
      onContextMenu={e => {
        e.preventDefault();
      }}
    >
      <Stage
        width={props.width}
        height={props.height}
        onContentClick={props.onContentClick}
        onContentMouseMove={props.onContentMouseMove}
        onContentMouseDown={props.onContentMouseDown}
        quantizeLength={props.quantizeLength}
      >
        {props.isGridActive && (
          <Layer>
            <Group>
              <Grid
                width={props.width}
                height={props.height}
                gridSize={props.gridSize}
                isGridActive={props.isGridActive}
              />
            </Group>
          </Layer>
        )}

        <Layer>
          <Group>
            {props.shapesList.map((shape, index) => {
              const { points, colorIndex, volume, isMuted } = shape;
              return (
                !props.deletedShapeIndeces[index] && (
                  <Shape
                    key={index}
                    index={index}
                    volume={volume}
                    isMuted={isMuted}
                    points={points}
                    snapToGrid={snapToGrid}
                    activeTool={activeTool}
                    scaleObj={scaleObj}
                    isPlaying={isPlaying}
                    isAutoQuantizeActive={isAutoQuantizeActive}
                    isSelected={index === selectedShapeIndex}
                    soloedShapeIndex={soloedShapeIndex}
                    colorIndex={colorIndex}
                    selectedInstruments={selectedInstruments}
                    knobVals={knobVals}
                    handleClick={handleShapeClick}
                    handleDelete={handleShapeDelete}
                    handleColorChange={handleShapeColorChange}
                    handleVolumeChange={handleShapeVolumeChange}
                    handleSoloChange={handleShapeSoloChange}
                    handleMuteChange={handleShapeMuteChange}
                    tempo={tempo}
                  />
                )
              );
            })}
          </Group>
        </Layer>

        <Layer>
          <PhantomShape
            mousePos={props.mousePos}
            points={props.currPoints}
            activeTool={props.activeTool}
            color={themeColors[props.colorIndex]}
            drawingState={props.drawingState}
          />
        </Layer>
      </Stage>
    </div>
  );
}

ShapeCanvasComponent.propTypes = propTypes;

export default ShapeCanvasComponent;
