import React, { useRef, memo, forwardRef, useImperativeHandle } from 'react';
import Shape from 'components/Shape';

export default memo(
  forwardRef((props, ref) => {
    const {
      shapesList,
      deletedShapeIndeces,
      selectedShapeIndex,
      soloedShapeIndex,
      snapToGrid,
      handleShapeClick,
      handleShapeDelete,
      handleShapeDuplicate,
      handleShapeColorChange,
      handleShapeVolumeChange,
      handleShapeSoloChange,
      handleShapeMuteChange,
    } = props;

    const shapeRefs = useRef({});

    useImperativeHandle(ref, () => ({
      getShapeState: shapeIndex => {
        const shapeRef = shapeRefs.current[shapeIndex.toString()];
        return shapeRef.getSaveDataState();
      },
      getShapeMIDISequences: () => {
        const shapesList = Object.keys(shapeRefs.current)
          .map(key => shapeRefs.current[key])
          .filter(val => !!val);
        return shapesList.map(shapeRef => shapeRef.getMIDINoteEvents());
      },
    }));

    return shapesList.map((shape, index) => {
      const { points, colorIndex, volume, isMuted, quantizeFactor } = shape;
      return (
        !deletedShapeIndeces[index] && (
          <Shape
            ref={c => (shapeRefs.current[index.toString()] = c)}
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
            handleShapeDuplicate={handleShapeDuplicate}
            handleColorChange={handleShapeColorChange}
            handleVolumeChange={handleShapeVolumeChange}
            handleSoloChange={handleShapeSoloChange}
            handleMuteChange={handleShapeMuteChange}
          />
        )
      );
    });
  })
);
