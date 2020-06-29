import { useRef, useState, useEffect, useContext } from 'react';
import { ProjectContext } from 'components/Project/ProjectContextProvider';
import { Synth } from './Synth';

export const useShapeSynth = ({
  selectedSynths,
  colorIndex,
  knobVals,
  volume,
  isPlayingAnimator,
  points,
  noteIndexModifier,
  firstNoteIndex,
  isMuted,
  isSoloed,
}) => {
  const { tempo, scaleObj } = useContext(ProjectContext);
  const [isBuffering, setIsBuffering] = useState(false);
  const selectedSynth = selectedSynths[colorIndex];
  const shapeKnobVals = knobVals[colorIndex];
  // const synthObj = SYNTH_PRESETS[selectedSynth];
  const synthContainer = useRef(null);

  useEffect(() => {
    synthContainer.current = new Synth({
      initVolume: volume,
      initKnobVals: shapeKnobVals,
      isPlayingAnimator,
      noteIndexModifier,
      firstNoteIndex,
      onStartLoading: () => setIsBuffering(true),
      onEndLoading: () => setIsBuffering(false),
    });
    return () => {
      synthContainer.current.dispose();
    };
  }, []);

  useEffect(() => {
    console.log('CHANGE scale');
    synthContainer.current.setScaleObj(scaleObj);
  }, [scaleObj]);

  useEffect(() => {
    console.log('CHANGE tempo');
    synthContainer.current.setTempo(tempo);
  }, [tempo]);

  useEffect(() => {
    console.log('CHANGE SYNTH');
    synthContainer.current.setSynth(selectedSynth, colorIndex);
  }, [selectedSynth, colorIndex]);

  useEffect(() => {
    console.log('CHANGE KNOBS');
    synthContainer.current.setKnobValues(shapeKnobVals);
  }, [shapeKnobVals]);

  useEffect(() => {
    console.log('CHANGE NOTES');
    synthContainer.current.setNoteEvents(scaleObj, points);
  }, [scaleObj, points]);

  useEffect(() => {
    console.log('CHANGE VOLUME');
    synthContainer.current.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    synthContainer.current.updateAnimator(isPlayingAnimator);
  }, [isPlayingAnimator]);

  useEffect(() => {
    console.log('CHANGE noteIndexModifier');
    synthContainer.current.updateNoteIndexModifier(noteIndexModifier);
  }, [noteIndexModifier]);

  useEffect(() => {
    console.log('CHANGE muted');
    synthContainer.current.setIsMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    console.log('CHANGE solo');
    synthContainer.current.setIsSoloed(isSoloed);
  }, [isSoloed]);

  return { isBuffering };
};
