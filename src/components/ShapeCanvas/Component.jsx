import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import ShapesWrapper from './ShapesWrapper';
import PhantomShape from './PhantomShape';
import Grid from './Grid';
import { appColors, themeColors } from 'utils/color';
import { TOOL_TYPES } from 'utils/project';
import { DRAWING_STATES } from './Container';

import ProjectContextProvider from 'components/Project/ProjectContextProvider';
import { useProjectContext } from 'context/useProjectContext';
import { useColorThemeContext } from 'context/ColorThemeContext/useColorThemeContext';

function ShapeCanvasComponent(props, ref) {
  const {
    width,
    height,
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
    handleShapeDuplicate,
  } = props;
  const shapesGroupRef = useRef({});

  const { isDarkMode } = useColorThemeContext();

  useImperativeHandle(ref, () => ({
    getShapeState: shapesGroupRef.current.getShapeState,
    getShapeMIDISequences: shapesGroupRef.current.getShapeMIDISequences,
  }));

  /* 
  NOTE: hack to propagate context through the Konva Stage
  */
  const projectContext = useProjectContext();
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
      style={{
        cursor: isEditMode && isAltPressed && 'copy',
        background: isDarkMode ? appColors.black : appColors.grayLight,
      }}
      onContextMenu={e => {
        e.preventDefault();
      }}
    >
      <Stage
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
              <ShapesWrapper
                ref={shapesGroupRef}
                shapesList={shapesList}
                deletedShapeIndeces={deletedShapeIndeces}
                selectedShapeIndex={selectedShapeIndex}
                soloedShapeIndex={soloedShapeIndex}
                snapToGrid={snapToGrid}
                handleShapeClick={handleShapeClick}
                handleShapeDelete={handleShapeDelete}
                handleShapeDuplicate={handleShapeDuplicate}
                handleShapeColorChange={handleShapeColorChange}
                handleShapeVolumeChange={handleShapeVolumeChange}
                handleShapeSoloChange={handleShapeSoloChange}
                handleShapeMuteChange={handleShapeMuteChange}
              />
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
}

export default forwardRef(ShapeCanvasComponent);
