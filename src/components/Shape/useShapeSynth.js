import { useRef, useState, useEffect, useContext } from 'react';
import { ProjectContext } from 'components/Project/ProjectContextProvider';
import { Synth } from './Synth';

export const useShapeSynth = ({
  colorIndex,
  volume,
  isPlayingAnimator,
  points,
  noteIndexModifier,
  firstNoteIndex,
  isMuted,
  isSoloed,
  panVal,
  averagePoint,
}) => {
  const {
    tempo,
    scaleObj,
    knobVals,
    selectedSynths,
    isProximityModeActive,
    proximityModeRadius,
  } = useContext(ProjectContext);
  const [isBuffering, setIsBuffering] = useState(false);
  const selectedSynth = selectedSynths[colorIndex];
  const shapeKnobVals = knobVals[colorIndex];
  const synthContainer = useRef(null);

  useEffect(() => {
    synthContainer.current = new Synth({
      onStartLoading: () => setIsBuffering(true),
      onEndLoading: () => setIsBuffering(false),
    });
    return () => {
      synthContainer.current.dispose();
    };
  }, []);

  useEffect(() => {
    synthContainer.current.setScaleObj(scaleObj);
  }, [scaleObj]);

  useEffect(() => {
    synthContainer.current.setTempo(tempo);
  }, [tempo]);

  useEffect(() => {
    synthContainer.current.setFirstNoteIndex(firstNoteIndex);
  }, [firstNoteIndex]);

  useEffect(() => {
    synthContainer.current.setSynth(selectedSynth, colorIndex);
  }, [selectedSynth, colorIndex]);

  useEffect(() => {
    synthContainer.current.setKnobValues(shapeKnobVals);
  }, [shapeKnobVals]);

  useEffect(() => {
    synthContainer.current.setNoteEvents(scaleObj, points);
  }, [scaleObj, points]);

  useEffect(() => {
    synthContainer.current.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    synthContainer.current.setAnimator(isPlayingAnimator);
  }, [isPlayingAnimator]);

  useEffect(() => {
    synthContainer.current.setNoteIndexModifier(noteIndexModifier);
  }, [noteIndexModifier]);

  useEffect(() => {
    synthContainer.current.setIsMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    synthContainer.current.setIsSoloed(isSoloed);
  }, [isSoloed]);

  useEffect(() => {
    synthContainer.current.setPan(panVal);
  }, [panVal]);

  useEffect(() => {
    if (averagePoint) {
      synthContainer.current.setPan3d(averagePoint);
    }
  }, [averagePoint]);

  useEffect(() => {
    synthContainer.current.setProximityRadius(proximityModeRadius);
  }, [proximityModeRadius]);

  useEffect(() => {
    synthContainer.current.setProximityMode(isProximityModeActive);
  }, [isProximityModeActive]);

  return { isBuffering };
};
