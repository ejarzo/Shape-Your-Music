import React from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Group } from 'react-konva';
import Shape from 'components/Shape';
import PhantomShape from './PhantomShape';
import Grid from './Grid';
import { themeColors } from 'utils/color';
import { TOOL_TYPES } from 'views/Project/Container';
import { DRAWING_STATES } from './Container';

import ProjectContextConsumer from 'views/Project/ProjectContextConsumer';
import ProjectContextProvider from 'views/Project/ProjectContextProvider';

const propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onContentClick: PropTypes.func.isRequired,
  onContentMouseMove: PropTypes.func.isRequired,
  onContentMouseDown: PropTypes.func.isRequired,

  gridDots: PropTypes.array,

  shapesList: PropTypes.array.isRequired,
  selectedShapeIndex: PropTypes.number.isRequired,
  soloedShapeIndex: PropTypes.number.isRequired,
  deletedShapeIndeces: PropTypes.array.isRequired,

  mousePos: PropTypes.object.isRequired,
  currPoints: PropTypes.array.isRequired,

  handleShapeClick: PropTypes.func.isRequired,
  handleShapeDelete: PropTypes.func.isRequired,
  handleShapeSoloChange: PropTypes.func.isRequired,
};

function ShapeCanvasComponent(props) {
  const {
    width,
    height,
    getShapeRef,
    removeShapeRef,
    currPoints,
    snapToGrid,
    gridSize,
    mousePos,
    drawingState,
    shapesList,
    selectedShapeIndex,
    soloedShapeIndex,
    deletedShapeIndeces,
    onContentClick,
    onContentMouseMove,
    onContentMouseDown,
    handleShapeClick,
    handleShapeDelete,
    handleShapeColorChange,
    handleShapeVolumeChange,
    handleShapeSoloChange,
    handleShapeMuteChange,
    stageRef,
  } = props;

  /* 
    NOTE: hack to propagate context through the Konva Stage
  */
  return (
    <ProjectContextConsumer>
      {projectContext => {
        const {
          activeTool,
          isAltPressed,
          isGridActive,
          activeColorIndex,
        } = projectContext;
        const isEditMode = activeTool === TOOL_TYPES.EDIT;

        return (
          <div
            id="holder"
            style={{ cursor: isEditMode && isAltPressed && 'copy' }}
            onContextMenu={e => {
              e.preventDefault();
            }}
          >
            <Stage
              ref={stageRef}
              width={width}
              height={height}
              onContentClick={onContentClick}
              onContentMouseMove={onContentMouseMove}
              onContentMouseDown={onContentMouseDown}
            >
              <ProjectContextProvider value={projectContext}>
                {isGridActive && (
                  <Layer>
                    <Group>
                      <Grid width={width} height={height} gridSize={gridSize} />
                    </Group>
                  </Layer>
                )}

                <Layer>
                  <Group>
                    {shapesList.map((shape, index) => {
                      const {
                        points,
                        colorIndex,
                        volume,
                        isMuted,
                        quantizeFactor,
                      } = shape;
                      return (
                        !deletedShapeIndeces[index] && (
                          <Shape
                            getShapeRef={getShapeRef}
                            removeShapeRef={removeShapeRef}
                            key={index}
                            index={index}
                            volume={volume}
                            isMuted={isMuted}
                            initialQuantizeFactor={quantizeFactor}
                            initialPoints={points}
                            isSelected={index === selectedShapeIndex}
                            soloedShapeIndex={soloedShapeIndex}
                            colorIndex={colorIndex}
                            snapToGrid={snapToGrid}
                            handleClick={handleShapeClick}
                            handleDelete={handleShapeDelete}
                            handleColorChange={handleShapeColorChange}
                            handleVolumeChange={handleShapeVolumeChange}
                            handleSoloChange={handleShapeSoloChange}
                            handleMuteChange={handleShapeMuteChange}
                          />
                        )
                      );
                    })}
                  </Group>
                </Layer>

                <Layer>
                  <PhantomShape
                    mousePos={mousePos}
                    points={currPoints}
                    drawingState={drawingState}
                    closed={drawingState === DRAWING_STATES.PREVIEW}
                    color={themeColors[activeColorIndex]}
                  />
                </Layer>
              </ProjectContextProvider>
            </Stage>
          </div>
        );
      }}
    </ProjectContextConsumer>
  );
}

ShapeCanvasComponent.propTypes = propTypes;

export default ShapeCanvasComponent;
