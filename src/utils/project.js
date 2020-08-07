import { DEFAULT_SYNTHS } from './synths';

export const PROJECT_ACTIONS = {
  SET_ACTIVE_TOOL: 'SET_ACTIVE_TOOL',
  TOGGLE_ACTIVE_TOOL: 'TOGGLE_ACTIVE_TOOL',
  CHANGE_DRAW_COLOR: 'CHANGE_DRAW_COLOR',
  SET_DRAW_COLOR: 'SET_DRAW_COLOR',
  TOGGLE_GRID: 'TOGGLE_GRID',
  TOGGLE_SNAP_TO_GRID: 'TOGGLE_SNAP_TO_GRID',
  TOGGLE_AUTO_QUANTIZE: 'TOGGLE_AUTO_QUANTIZE',
  SET_TEMPO: 'SET_TEMPO',
  SET_TONIC: 'SET_TONIC',
  SET_MODE: 'SET_MODE',
  SET_INSTRUMENT_FOR_COLOR: 'SET_INSTRUMENT_FOR_COLOR',
  SET_KNOB_VALUE_FOR_COLOR: 'SET_KNOB_VALUE_FOR_COLOR',
};

export const DEFAULT_PROJECT = {
  projectName: '',
  tempo: 50,
  tonic: 'a',
  scale: 'major',
  selectedSynths: DEFAULT_SYNTHS,
};

export const getProjectSaveData = projectData => {
  const {
    name,
    tempo,
    scaleObj,
    isGridActive,
    isSnapToGridActive,
    isAutoQuantizeActive,
    shapesList,
    selectedSynths,
    knobVals,
  } = projectData;

  return {
    name,
    tempo,
    tonic: scaleObj.tonic.toString(),
    scale: scaleObj.name.toString(),
    isGridActive,
    isSnapToGridActive,
    isAutoQuantizeActive,
    shapesList,
    selectedSynths,
    knobVals,
  };
};

export const getProjectIdFromResponse = project => project.ref['@ref'].id;
