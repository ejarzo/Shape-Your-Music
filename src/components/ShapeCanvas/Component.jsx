import React from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Group } from 'react-konva';
import Shape from 'components/Shape';
import PhantomShape from './PhantomShape';

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

  colorsList: PropTypes.array.isRequired,
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
        <Layer>
          <Group>{props.gridDots}</Group>
        </Layer>

        <Layer>
          <Group>
            {props.shapesList.map(
              (points, index) =>
                !props.deletedShapeIndeces[index] && (
                  <Shape
                    key={index}
                    index={index}
                    points={points}
                    snapToGrid={props.snapToGrid}
                    activeTool={props.activeTool}
                    scaleObj={props.scaleObj}
                    isPlaying={props.isPlaying}
                    isAutoQuantizeActive={props.isAutoQuantizeActive}
                    isSelected={index === props.selectedShapeIndex}
                    soloedShapeIndex={props.soloedShapeIndex}
                    colorsList={props.colorsList}
                    colorIndex={props.colorIndex}
                    selectedInstruments={props.selectedInstruments}
                    knobVals={props.knobVals}
                    onShapeClick={props.handleShapeClick}
                    onDelete={props.handleShapeDelete} // TODO
                    onSoloChange={props.handleShapeSolo(index)}
                    tempo={props.tempo}
                  />
                )
            )}
          </Group>
        </Layer>

        <Layer>
          <PhantomShape
            mousePos={props.mousePos}
            points={props.currPoints}
            activeTool={props.activeTool}
            color={props.colorsList[props.colorIndex]}
            drawingState={props.drawingState}
          />
        </Layer>
      </Stage>
    </div>
  );
}

ShapeCanvasComponent.propTypes = propTypes;

export default ShapeCanvasComponent;
