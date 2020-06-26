import React, { useState, useRef, useCallback } from 'react';
import Teoria from 'teoria';
import { HotKeys } from 'react-hotkeys';

import Toolbar from 'components/Toolbar';
import Sidebar from 'components/Sidebar';
import ShapeCanvas from 'components/ShapeCanvas';
import ColorControllerPanel from 'components/ColorControllerPanel';

import { themeColors } from 'utils/color';
import { convertAndDownloadTracksAsMIDI } from 'utils/file';

import { keyMap } from '../keyMap';
import ProjectContextProvider from '../ProjectContextProvider';
import { getDefaultParamValues } from 'utils/synths';
import styles from './styles.module.css';
import { useRecorder } from '../useRecorder';

/* ========================================================================== */

export const TOOL_TYPES = {
  EDIT: 'edit',
  DRAW: 'draw',
};

/* ========================================================================== */

const getInitState = initState => ({
  projectName: initState.projectName,
  isGridActive: !!initState.isGridActive,
  isSnapToGridActive: !!initState.isSnapToGridActive,
  isAutoQuantizeActive: !!initState.isAutoQuantizeActive,
  isFullscreenEnabled: false,
  isPlaying: false,
  isRecording: false,
  isArmed: false,
  isAltPressed: false,
  quantizeLength: 700,
  tempo: initState.tempo,
  scaleObj: Teoria.note(initState.tonic).scale(initState.scale),
  activeTool: TOOL_TYPES.DRAW,
  activeColorIndex: 0,
  selectedSynths: initState.selectedSynths,
  knobVals:
    initState.knobVals && initState.knobVals.length > 0
      ? initState.knobVals
      : initState.selectedSynths.map(getDefaultParamValues),
});

export default props => {
  const {
    initState,
    showSaveButton,
    showSettingsButton,
    projectAuthor,
    deleteProject,
    toggleTransport,
    saveProject,
  } = props;

  const shapeCanvas = useRef(null);
  const [state, setState] = useState(getInitState(initState));

  const { isPlaying, projectName, tempo } = state;

  const {
    isArmed,
    isRecording,
    beginRecording,
    stopRecording,
    armRecording,
    downloadUrls,
  } = useRecorder();

  const projectContext = { ...state, isRecording, isArmed };

  const togglePlayStop = () => {
    toggleTransport();
    if (isArmed) {
      beginRecording();
    }
    if (isRecording) {
      stopRecording();
    }
    setState(s => ({ ...s, isPlaying: !s.isPlaying }));
  };

  const handleRecordClick = () => {
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

  const setActiveTool = tool => {
    if (shapeCanvas && shapeCanvas.current.canChangeTool()) {
      setState({
        ...state,
        activeTool: tool,
      });
    }
  };

  const handleDrawToolClick = () => {
    setActiveTool(TOOL_TYPES.DRAW);
  };

  const handleEditToolClick = () => {
    setActiveTool(TOOL_TYPES.EDIT);
  };

  const toggleActiveTool = () => {
    if (shapeCanvas && shapeCanvas.current.canChangeTool()) {
      setState(prevState => ({
        ...state,
        activeTool:
          prevState.activeTool === TOOL_TYPES.DRAW
            ? TOOL_TYPES.EDIT
            : TOOL_TYPES.DRAW,
      }));
    }
  };

  // using number keys
  const handleChangeDrawColor = ({ key }) => {
    setState({
      ...state,
      activeColorIndex: parseInt(key, 10) - 1,
    });
  };

  // clicking on color
  const handleColorChange = colorObj => {
    setState({
      ...state,
      activeColorIndex: themeColors.indexOf(colorObj.hex),
    });
  };

  const handleGridToggleChange = () => {
    setState(prevState => ({
      ...prevState,
      isGridActive: !prevState.isGridActive,
    }));
  };

  const handleSnapToGridToggleChange = () => {
    setState(prevState => ({
      ...prevState,
      isSnapToGridActive: !prevState.isSnapToGridActive,
    }));
  };

  const handleAutoQuantizeChange = () => {
    setState(prevState => ({
      ...prevState,
      isAutoQuantizeActive: !prevState.isAutoQuantizeActive,
    }));
  };

  const handleClearButtonClick = () => {
    if (shapeCanvas) {
      shapeCanvas.current.clearAll();
    }
  };

  const handleTempoChange = val => {
    // TODO: move to constants
    const min = 1;
    const max = 100;
    const tempo = Math.max(Math.min(val, max), min);
    setState({ ...state, tempo });
  };

  const handleTonicChange = val => {
    setState(prevState => ({
      ...prevState,
      scaleObj: Teoria.note(val.value).scale(prevState.scaleObj.name),
    }));
  };

  const handleScaleChange = val => {
    if (!val) return;
    const {
      scaleObj: { tonic },
    } = state;
    setState({
      ...state,
      scaleObj: tonic.scale(val.value),
    });
  };

  const handleInstChange = colorIndex => {
    return instrumentName => {
      console.log('setting index', colorIndex, 'to synth', instrumentName);
      setState(prevState => {
        const newSelectedSynths = prevState.selectedSynths.slice();
        const defaultKnobvals = getDefaultParamValues(instrumentName);
        const knobVals = prevState.knobVals.slice();
        newSelectedSynths[colorIndex] = instrumentName;
        knobVals[colorIndex] = defaultKnobvals;
        return {
          ...prevState,
          selectedSynths: newSelectedSynths,
          knobVals,
        };
      });
    };
  };

  const handleKnobChange = colorIndex => {
    return effectIndex => val => {
      setState(prevState => {
        const knobVals = prevState.knobVals.slice();
        const colorKnobVals = knobVals[colorIndex].slice();
        colorKnobVals[effectIndex] = val;
        knobVals[colorIndex] = colorKnobVals;
        return {
          ...prevState,
          knobVals: knobVals,
        };
      });
    };
  };

  const handleExportToMIDIClick = async () => {
    // get list of MIDI events from the shape canvas
    const shapeNoteEventsList = shapeCanvas.current.getShapeMIDINoteEvents();
    await convertAndDownloadTracksAsMIDI({ tempo, shapeNoteEventsList });
  };

  const handleSaveClick = projectName => {
    if (!projectName) return;
    console.log('Saving project with name', projectName);

    const projectContext = state;
    const shapesList = shapeCanvas.current.getShapesList();

    // TODO: do something with this screenshot
    // const screenshot = this.shapeCanvas.getScreenshot();
    // console.log('generated screenshot:', screenshot);
    // this.setState({ projectName });

    saveProject({
      ...projectContext,
      name: projectName,
      shapesList,
    });
  };
  console.log('render is armed', isArmed);
  const keyHandlers = {
    PLAY: e => {
      console.log(e);
      e.preventDefault();
      e.stopPropagation();

      console.log('handler isarmed', state.isArmed);
      togglePlayStop();
    },
    TOGGLE_ACTIVE_TOOL: e => {
      e.preventDefault();
      e.stopPropagation();
      toggleActiveTool();
    },
    CHANGE_DRAW_COLOR: handleChangeDrawColor,
    ALT_DOWN: () => setState({ ...state, isAltPressed: true }),
    ALT_UP: () => setState({ ...state, isAltPressed: false }),
    DELETE_SHAPE: () => shapeCanvas.current.deleteSelectedShape(),
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
        <Toolbar
          handlePlayClick={togglePlayStop}
          handleRecordClick={handleRecordClick}
          handleColorChange={handleColorChange}
          handleDrawToolClick={handleDrawToolClick}
          handleEditToolClick={handleEditToolClick}
          handleGridToggleChange={handleGridToggleChange}
          handleSnapToGridToggleChange={handleSnapToGridToggleChange}
          handleAutoQuantizeChange={handleAutoQuantizeChange}
          handleTempoChange={handleTempoChange}
          handleTonicChange={handleTonicChange}
          handleScaleChange={handleScaleChange}
          handleClearButtonClick={handleClearButtonClick}
        />

        {/* The Canvas */}
        <ShapeCanvas
          // TODO: revisit: do we need to do this?
          onMount={e => {
            shapeCanvas.current = e;
          }}
          initShapesList={initState.shapesList}
        />

        {/* Instrument controller panels */}
        <ColorControllerPanel
          onInstChange={handleInstChange}
          onKnobChange={handleKnobChange}
        />

        {/* Sidebar */}
        <Sidebar
          downloadUrls={downloadUrls}
          handleSaveClick={handleSaveClick}
          handleDeleteClick={deleteProject}
          showSaveButton={showSaveButton}
          showSettingsButton={showSettingsButton}
          handleExportToMIDIClick={handleExportToMIDIClick}
        />
      </ProjectContextProvider>
    </HotKeys>
  );
};
