import React, { useState, useRef, useReducer } from 'react';
import Teoria from 'teoria';
import { HotKeys } from 'react-hotkeys';

import Toolbar from 'components/Toolbar';
import Sidebar from 'components/Sidebar';
import ShapeCanvas from 'components/ShapeCanvas';
import ColorControllerPanel from 'components/ColorControllerPanel';

import { themeColors } from 'utils/color';
import { convertAndDownloadTracksAsMIDI } from 'utils/file';

import { keyMap } from './keyMap';
import ProjectContextProvider from './ProjectContextProvider';
import { getDefaultParamValues } from 'utils/synths';
import styles from './styles.module.css';
import { useRecorder } from './useRecorder';
import { useAudioOutput } from './useAudioOutput';
import { PROJECT_ACTIONS, TOOL_TYPES, getInitState } from 'utils/project';

export default props => {
  const {
    initState,
    showSaveButton,
    showSettingsButton,
    projectAuthor,
    deleteProject: deleteProjectMutation,
    saveProject: saveProjectMutation,
  } = props;

  const shapeCanvas = useRef(null);
  const [isAltPressed, setIsAltPressed] = useState(false);

  const projectReducer = (state, action) => {
    if (!action.type) {
      throw new Error(`No action type`);
    }
    switch (action.type) {
      case PROJECT_ACTIONS.SET_ACTIVE_TOOL:
        if (shapeCanvas && shapeCanvas.current.canChangeTool()) {
          return {
            ...state,
            activeTool: action.payload,
          };
        } else {
          return state;
        }
      case PROJECT_ACTIONS.TOGGLE_ACTIVE_TOOL:
        if (shapeCanvas && shapeCanvas.current.canChangeTool()) {
          return {
            ...state,
            activeTool:
              state.activeTool === TOOL_TYPES.DRAW
                ? TOOL_TYPES.EDIT
                : TOOL_TYPES.DRAW,
          };
        } else {
          return state;
        }
      case PROJECT_ACTIONS.CHANGE_DRAW_COLOR:
        return {
          ...state,
          activeTool: TOOL_TYPES.DRAW,
          activeColorIndex: parseInt(action.payload, 10) - 1,
        };
      case PROJECT_ACTIONS.SET_DRAW_COLOR:
        return {
          ...state,
          activeTool: TOOL_TYPES.DRAW,
          activeColorIndex: themeColors.indexOf(action.payload),
        };
      case PROJECT_ACTIONS.TOGGLE_GRID:
        return {
          ...state,
          isGridActive: !state.isGridActive,
        };
      case PROJECT_ACTIONS.TOGGLE_SNAP_TO_GRID:
        return {
          ...state,
          isSnapToGridActive: !state.isSnapToGridActive,
        };
      case PROJECT_ACTIONS.TOGGLE_AUTO_QUANTIZE:
        return {
          ...state,
          isAutoQuantizeActive: !state.isAutoQuantizeActive,
        };
      case PROJECT_ACTIONS.SET_TEMPO:
        const min = 1;
        const max = 100;
        const tempo = Math.max(Math.min(action.payload, max), min);
        return { ...state, tempo };
      case PROJECT_ACTIONS.SET_TONIC:
        return {
          ...state,
          scaleObj: Teoria.note(action.payload).scale(state.scaleObj.name),
        };
      case PROJECT_ACTIONS.SET_MODE:
        if (!action.payload) return state;
        const {
          scaleObj: { tonic },
        } = state;
        return {
          ...state,
          scaleObj: tonic.scale(action.payload),
        };
      case PROJECT_ACTIONS.SET_INSTRUMENT_FOR_COLOR: {
        const { colorIndex, instrumentName } = action.payload;
        const newSelectedSynths = state.selectedSynths.slice();
        const defaultKnobvals = getDefaultParamValues(instrumentName);
        const knobVals = state.knobVals.slice();
        newSelectedSynths[colorIndex] = instrumentName;
        knobVals[colorIndex] = defaultKnobvals;
        return {
          ...state,
          selectedSynths: newSelectedSynths,
          knobVals,
        };
      }
      case PROJECT_ACTIONS.SET_KNOB_VALUE_FOR_COLOR: {
        const {
          payload: { colorIndex, effectIndex, value },
        } = action;
        const knobVals = state.knobVals.slice();
        const colorKnobVals = knobVals[colorIndex].slice();
        colorKnobVals[effectIndex] = value;
        knobVals[colorIndex] = colorKnobVals;
        return {
          ...state,
          knobVals,
        };
      }
      default:
        throw new Error(`Unknown action type ${action.type}`);
    }
  };

  const [state, dispatch] = useReducer(projectReducer, getInitState(initState));

  const { projectName, tempo } = state;

  const {
    isArmed,
    isRecording,
    beginRecording,
    stopRecording,
    armRecording,
    downloadUrls,
  } = useRecorder();

  const { isPlaying, toggleIsPlaying } = useAudioOutput({
    isArmed,
    isRecording,
    beginRecording,
    stopRecording,
  });

  const togglePlayStop = () => {
    toggleIsPlaying();
    if (isArmed) {
      beginRecording();
    }
    if (isRecording) {
      stopRecording();
    }
  };

  const toggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (isPlaying) {
        beginRecording();
      } else {
        armRecording();
      }
    }
  };

  const clearProjectCanvas = () => {
    if (shapeCanvas) {
      shapeCanvas.current.clearAll();
    }
  };

  const exportProjectToMIDI = async () => {
    // get list of MIDI events from the shape canvas
    const shapeNoteEventsList = shapeCanvas.current.getShapeMIDINoteEvents();
    await convertAndDownloadTracksAsMIDI({ tempo, shapeNoteEventsList });
  };

  const saveProject = projectName => {
    if (!projectName) return;
    console.log('Saving project with name', projectName);

    const projectData = state;
    const shapesList = shapeCanvas.current.getShapesList();
    console.log('shapes list', shapesList);
    // TODO: do something with this screenshot
    // const screenshot = this.shapeCanvas.getScreenshot();
    // console.log('generated screenshot:', screenshot);
    // this.setState({ projectName });

    saveProjectMutation({
      ...projectData,
      name: projectName,
      shapesList,
    });
  };

  const projectContext = {
    ...state,
    isAltPressed,
    isRecording,
    isArmed,
    isPlaying,
    downloadUrls,
    dispatch,
    imperativeHandlers: {
      togglePlayStop,
      toggleRecord,
      clearProjectCanvas,
      exportProjectToMIDI,
      saveProject,
      deleteProject: deleteProjectMutation,
    },
  };

  const keyHandlers = {
    PLAY: e => {
      e.preventDefault();
      e.stopPropagation();
      togglePlayStop();
    },
    TOGGLE_ACTIVE_TOOL: e => {
      e.preventDefault();
      e.stopPropagation();
      dispatch({ type: PROJECT_ACTIONS.TOGGLE_ACTIVE_TOOL });
    },
    CHANGE_DRAW_COLOR: ({ key }) => {
      dispatch({ type: PROJECT_ACTIONS.CHANGE_DRAW_COLOR, payload: key });
    },
    ALT_DOWN: () => setIsAltPressed(true),
    ALT_UP: () => setIsAltPressed(false),
    DELETE_SHAPE: e => {
      e.preventDefault();
      e.stopPropagation();
      // TODO move into separate shape canvas hotkeys wrapper
      shapeCanvas.current.deleteSelectedShape();
    },
    CANCEL_IN_PROGRESS_SHAPE: () => {
      // TODO move into separate shape canvas hotkeys wrapper
      shapeCanvas.current.cancelInProgressShape();
    },
  };

  return (
    <HotKeys allowChanges keyMap={keyMap} handlers={keyHandlers}>
      <ProjectContextProvider value={projectContext}>
        {projectAuthor && projectName && (
          <div className={styles.ProjectTitle}>
            <strong>{projectName}</strong> by <em>{projectAuthor.name}</em>
          </div>
        )}

        {/* The Controls */}
        <Toolbar />

        {/* The Canvas */}
        <ShapeCanvas
          // TODO: revisit: do we need to do this?
          onMount={e => {
            shapeCanvas.current = e;
          }}
          initShapesList={initState.shapesList}
        />

        {/* Instrument controller panels */}
        <ColorControllerPanel />

        {/* Sidebar */}
        <Sidebar
          showSaveButton={showSaveButton}
          showSettingsButton={showSettingsButton}
        />
      </ProjectContextProvider>
    </HotKeys>
  );
};
