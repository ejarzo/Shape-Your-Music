import React, { useState, useRef } from 'react';
// import { shape, string, number } from 'prop-types';
import Fullscreen from 'react-full-screen';
import Teoria from 'teoria';
import { HotKeys } from 'react-hotkeys';

import Toolbar from 'components/Toolbar';
import Sidebar from 'components/Sidebar';
import ShapeCanvas from 'components/ShapeCanvas';
import ColorControllerPanel from 'components/ColorControllerPanel';

import { themeColors } from 'utils/color';

import { keyMap } from './keyMap';
import ProjectContextProvider from './ProjectContextProvider';
import { getDefaultParamValues } from 'utils/synths';

/* ========================================================================== */

export const TOOL_TYPES = {
  EDIT: 'edit',
  DRAW: 'draw',
};

/* ========================================================================== */

// const propTypes = {
//   initState: shape({
//     projectName: string.isRequired,
//     tonic: string.isRequired,
//     scale: string.isRequired,
//     tempo: number.isRequired,
//   }).isRequired,
// };

export default props => {
  const {
    initState,
    downloadUrls,
    showSaveButton,
    showSettingsButton,
    projectAuthor,
    deleteProject,
    toggleTransport,
    beginRecording: propsBeginRecording,
    stopRecording: propsStopRecording,
    convertAndDownloadTracksAsMIDI,
    saveProject,
  } = props;

  const [state, setState] = useState({
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

  const shapeCanvas = useRef(null);
  const {
    isPlaying,
    projectName,
    isArmed,
    isRecording,
    isFullscreenEnabled,
    tempo,
  } = state;

  const beginRecording = () => {
    propsBeginRecording();
    setState({ ...state, isRecording: true });
  };

  const stopRecording = () => {
    propsStopRecording(projectName);
    setState({
      ...state,
      isRecording: false,
      isArmed: false,
    });
  };

  const togglePlayStop = () => {
    toggleTransport();
    if (isArmed) {
      beginRecording();
    }
    if (isRecording) {
      stopRecording();
    }
    setState(prevState => ({ ...prevState, isPlaying: !prevState.isPlaying }));
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (isPlaying) {
        beginRecording();
      } else {
        setState(prevState => ({
          ...prevState,
          isArmed: !prevState.isArmed,
        }));
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

  const handleFullscreenButtonClick = () => {
    setState(prevState => ({
      ...prevState,
      isFullscreenEnabled: !prevState.isFullscreenEnabled,
    }));
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

  const keyHandlers = {
    PLAY: e => {
      e.preventDefault();
      e.stopPropagation();
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
    <HotKeys keyMap={keyMap} handlers={keyHandlers}>
      <ProjectContextProvider value={{ ...state }}>
        <Fullscreen
          enabled={isFullscreenEnabled}
          onChange={isFullscreenEnabled => setState({ isFullscreenEnabled })}
        >
          {projectAuthor && projectName && (
            <div
              style={{
                display: 'inline-block',
                maxWidth: 300,
                textAlign: 'center',
                position: 'absolute',
                margin: '0 auto',
                left: 0,
                right: 0,
                top: 5,
              }}
            >
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
            handleFullscreenButtonClick={handleFullscreenButtonClick}
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
        </Fullscreen>
      </ProjectContextProvider>
    </HotKeys>
  );
};