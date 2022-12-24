import { DEFAULT_SYNTHS } from './synths';
import { getDefaultParamValues } from 'utils/synths';
import Teoria from 'teoria';

export const DEFAULT_PROXIMITY_MODE_RADIUS = 400;
export const MIN_PROXIMITY_RADIUS = 50;
export const MAX_PROXIMITY_RADIUS = 900;

export const TOOL_TYPES = {
  EDIT: 'edit',
  DRAW: 'draw',
};

export const PROJECT_ACTIONS = {
  SET_ACTIVE_TOOL: 'SET_ACTIVE_TOOL',
  TOGGLE_ACTIVE_TOOL: 'TOGGLE_ACTIVE_TOOL',
  CHANGE_DRAW_COLOR: 'CHANGE_DRAW_COLOR',
  SET_DRAW_COLOR: 'SET_DRAW_COLOR',
  TOGGLE_GRID: 'TOGGLE_GRID',
  TOGGLE_SNAP_TO_GRID: 'TOGGLE_SNAP_TO_GRID',
  TOGGLE_AUTO_QUANTIZE: 'TOGGLE_AUTO_QUANTIZE',
  TOGGLE_PROXIMITY_MODE: 'TOGGLE_PROXIMITY_MODE',
  SET_PROXIMITY_MODE_RADIUS: 'SET_PROXIMITY_MODE_RADIUS',
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

export const getInitState = initState => ({
  projectName: initState.projectName,
  activeColorIndex: 0,
  isGridActive: !!initState.isGridActive,
  isSnapToGridActive: !!initState.isSnapToGridActive,
  isAutoQuantizeActive: !!initState.isAutoQuantizeActive,
  isProximityModeActive: !!initState.isProximityModeActive,
  proximityModeRadius:
    initState.proximityModeRadius || DEFAULT_PROXIMITY_MODE_RADIUS,
  tempo: initState.tempo,
  scaleObj: Teoria.note(initState.tonic).scale(initState.scale),
  activeTool: TOOL_TYPES.DRAW,
  selectedSynths: initState.selectedSynths,
  knobVals:
    initState.knobVals && initState.knobVals.length > 0
      ? initState.knobVals
      : initState.selectedSynths.map(getDefaultParamValues),
});

export const getProjectSaveData = projectData => {
  const {
    name,
    tempo,
    scaleObj,
    isGridActive,
    isSnapToGridActive,
    isAutoQuantizeActive,
    isProximityModeActive,
    proximityModeRadius,
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
    isProximityModeActive,
    proximityModeRadius: parseInt(proximityModeRadius),
    shapesList,
    selectedSynths,
    knobVals,
  };
};

export const getProjectIdFromResponse = project => project.ref['@ref'].id;
