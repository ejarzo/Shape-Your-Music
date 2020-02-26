import React, { Component } from 'react';
import { shape, string, number } from 'prop-types';
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

const propTypes = {
  initState: shape({
    projectName: string.isRequired,
    tonic: string.isRequired,
    scale: string.isRequired,
    tempo: number.isRequired,
  }).isRequired,
};

class Project extends Component {
  constructor(props) {
    super(props);

    const { initState } = props;
    console.log('INIT STATE', initState);

    const {
      projectName = 'New project',
      isGridActive = false,
      isSnapToGridActive = false,
      isAutoQuantizeActive = false,
      selectedSynths,
    } = initState;

    const knobVals =
      initState.knobVals && initState.knobVals.length > 0
        ? initState.knobVals
        : selectedSynths.map(getDefaultParamValues);

    this.state = {
      projectName,
      isGridActive,
      isSnapToGridActive,
      isAutoQuantizeActive,

      isFullscreenEnabled: false,
      isPlaying: false,
      isRecording: false,
      isArmed: false,
      isAltPressed: false,

      quantizeLength: 700,
      tempo: props.initState.tempo,
      scaleObj: Teoria.note(props.initState.tonic).scale(props.initState.scale),
      activeTool: TOOL_TYPES.DRAW,
      activeColorIndex: 0,
      selectedSynths,
      knobVals,
    };

    // transport
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleRecordClick = this.handleRecordClick.bind(this);
    this.handleChangeDrawColor = this.handleChangeDrawColor.bind(this);
    this.handleAltChange = this.handleAltChange.bind(this);

    // color and tool
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleDrawToolClick = this.handleDrawToolClick.bind(this);
    this.handleEditToolClick = this.handleEditToolClick.bind(this);
    this.toggleActiveTool = this.toggleActiveTool.bind(this);

    // toggles
    this.handleGridToggleChange = this.handleGridToggleChange.bind(this);
    this.handleSnapToGridToggleChange = this.handleSnapToGridToggleChange.bind(
      this
    );
    this.handleAutoQuantizeChange = this.handleAutoQuantizeChange.bind(this);

    // music options
    this.handleTempoChange = this.handleTempoChange.bind(this);
    this.handleTonicChange = this.handleTonicChange.bind(this);
    this.handleScaleChange = this.handleScaleChange.bind(this);

    // inst colors
    this.handleInstChange = this.handleInstChange.bind(this);
    this.handleKnobChange = this.handleKnobChange.bind(this);

    // canvas
    this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
    this.handleFullscreenButtonClick = this.handleFullscreenButtonClick.bind(
      this
    );

    // recorder
    this.beginRecording = this.beginRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);

    // export
    this.handleExportToMIDIClick = this.handleExportToMIDIClick.bind(this);

    // save
    this.handleSaveClick = this.handleSaveClick.bind(this);

    // Key handlers
    this.keyHandlers = {
      PLAY: e => {
        e.preventDefault();
        e.stopPropagation();
        this.handlePlayClick();
      },
      TOGGLE_ACTIVE_TOOL: e => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleActiveTool();
      },
      CHANGE_DRAW_COLOR: this.handleChangeDrawColor,
      ALT_DOWN: () => this.handleAltChange(true),
      ALT_UP: () => this.handleAltChange(false),
      DELETE_SHAPE: () => this.shapeCanvas.deleteSelectedShape(),
    };
  }

  /* ============================== HANDLERS ============================== */

  handleChangeDrawColor({ key }) {
    this.setState({
      activeColorIndex: parseInt(key, 10) - 1,
    });
  }

  handleAltChange(alt) {
    this.setState({ isAltPressed: alt });
  }

  handlePlayClick() {
    const { isArmed, isRecording } = this.state;
    const { toggleTransport } = this.props;
    toggleTransport();

    if (isArmed) {
      this.beginRecording();
    }
    if (isRecording) {
      this.stopRecording();
    }

    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying,
    }));
  }

  handleRecordClick() {
    const { isArmed, isPlaying, isRecording } = this.state;
    if (isRecording) {
      this.stopRecording();
    } else {
      if (isPlaying) {
        this.beginRecording();
      } else {
        this.setState({
          isArmed: !isArmed,
        });
      }
    }
  }

  /* --- Transport -------------------------------------------------------- */

  beginRecording() {
    this.props.beginRecording();
    this.setState({ isRecording: true });
  }

  stopRecording() {
    const { projectName } = this.state;
    this.props.stopRecording(projectName);
    this.setState({
      isRecording: false,
      isArmed: false,
    });
  }

  /* --- Tool ------------------------------------------------------------- */

  toggleActiveTool() {
    const { activeTool } = this.state;
    let newTool = TOOL_TYPES.DRAW;
    if (this.shapeCanvas.canChangeTool()) {
      if (activeTool === TOOL_TYPES.DRAW) {
        newTool = TOOL_TYPES.EDIT;
      }
      this.setState({
        activeTool: newTool,
      });
    }
  }

  handleDrawToolClick() {
    this.setActiveTool(TOOL_TYPES.DRAW);
  }

  handleEditToolClick() {
    this.setActiveTool(TOOL_TYPES.EDIT);
  }

  setActiveTool(tool) {
    if (this.shapeCanvas.canChangeTool()) {
      this.setState({
        activeTool: tool,
      });
    }
  }

  handleColorChange(colorObj) {
    this.setState({
      activeColorIndex: themeColors.indexOf(colorObj.hex),
    });
  }

  /* --- Canvas ----------------------------------------------------------- */

  handleGridToggleChange() {
    this.setState({
      isGridActive: !this.state.isGridActive,
    });
  }

  handleSnapToGridToggleChange() {
    this.setState({
      isSnapToGridActive: !this.state.isSnapToGridActive,
    });
  }

  handleAutoQuantizeChange() {
    this.setState({
      isAutoQuantizeActive: !this.state.isAutoQuantizeActive,
    });
  }

  handleClearButtonClick() {
    this.shapeCanvas.clearAll();
  }

  handleFullscreenButtonClick() {
    this.setState({
      isFullscreenEnabled: !this.state.isFullscreenEnabled,
    });
  }

  /* --- Musical ---------------------------------------------------------- */

  handleTempoChange(val) {
    // TODO: move to class variables
    const min = 1;
    const max = 100;
    const tempo = Math.max(Math.min(val, max), min);
    this.setState({ tempo });
  }

  handleTonicChange(val) {
    this.setState(prevState => ({
      scaleObj: Teoria.note(val.value).scale(prevState.scaleObj.name),
    }));
  }

  handleScaleChange(val) {
    if (val) {
      const {
        scaleObj: { tonic },
      } = this.state;
      this.setState({
        scaleObj: tonic.scale(val.value),
      });
    }
  }

  /* --- Export ----------------------- */

  /* Exports (downloads) all shapes as individual MIDI files */
  async handleExportToMIDIClick() {
    const { convertAndDownloadTracksAsMIDI } = this.props;
    const { tempo } = this.state;
    // get list of MIDI events from the shape canvas
    const shapeNoteEventsList = this.shapeCanvas.getShapeMIDINoteEvents();
    await convertAndDownloadTracksAsMIDI({ tempo, shapeNoteEventsList });
  }

  /* --- Color Controllers ------------------------------------------------ */

  handleInstChange(colorIndex) {
    return instrumentName => {
      console.log('setting index', colorIndex, 'to synth', instrumentName);

      const newSelectedSynths = this.state.selectedSynths.slice();
      const defaultKnobvals = getDefaultParamValues(instrumentName);
      const knobVals = this.state.knobVals.slice();

      newSelectedSynths[colorIndex] = instrumentName;
      knobVals[colorIndex] = defaultKnobvals;

      this.setState({
        selectedSynths: newSelectedSynths,
        knobVals,
      });
    };
  }

  handleKnobChange(colorIndex) {
    return effectIndex => val => {
      this.setState(prevState => {
        const knobVals = prevState.knobVals.slice();
        const colorKnobVals = knobVals[colorIndex].slice();
        colorKnobVals[effectIndex] = val;
        knobVals[colorIndex] = colorKnobVals;
        return {
          knobVals: knobVals,
        };
      });
    };
  }

  handleSaveClick(projectName) {
    if (!projectName) return;

    console.log('Saving project with name', projectName);

    const projectContext = this.state;
    const { saveProject } = this.props;
    const shapesList = this.shapeCanvas.getShapesList();

    // TODO: do something with this screenshot
    // const screenshot = this.shapeCanvas.getScreenshot();
    // console.log('generated screenshot:', screenshot);

    // this.setState({ projectName });

    saveProject({
      ...projectContext,
      name: projectName,
      shapesList,
    });
  }

  /* =============================== RENDER =============================== */

  render() {
    const { projectName, isFullscreenEnabled } = this.state;
    const {
      initState,
      downloadUrls,
      showSaveButton,
      showSettingsButton,
      projectAuthor,
      deleteProject,
    } = this.props;
    const projectContext = this.state;
    console.log(this.props);
    return (
      <HotKeys keyMap={keyMap} handlers={this.keyHandlers}>
        <ProjectContextProvider value={projectContext}>
          <Fullscreen
            enabled={isFullscreenEnabled}
            onChange={isFullscreenEnabled =>
              this.setState({ isFullscreenEnabled })
            }
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
              handlePlayClick={this.handlePlayClick}
              handleRecordClick={this.handleRecordClick}
              handleColorChange={this.handleColorChange}
              handleDrawToolClick={this.handleDrawToolClick}
              handleEditToolClick={this.handleEditToolClick}
              handleGridToggleChange={this.handleGridToggleChange}
              handleSnapToGridToggleChange={this.handleSnapToGridToggleChange}
              handleAutoQuantizeChange={this.handleAutoQuantizeChange}
              handleTempoChange={this.handleTempoChange}
              handleTonicChange={this.handleTonicChange}
              handleScaleChange={this.handleScaleChange}
              handleFullscreenButtonClick={this.handleFullscreenButtonClick}
              handleClearButtonClick={this.handleClearButtonClick}
            />

            {/* The Canvas */}
            <ShapeCanvas
              // TODO: revisit: do we need to do this?
              onMount={c => (this.shapeCanvas = c)}
              initShapesList={initState.shapesList}
              handleExportToMIDIClick={this.handleExportToMIDIClick}
            />

            {/* Instrument controller panels */}
            <ColorControllerPanel
              onInstChange={this.handleInstChange}
              onKnobChange={this.handleKnobChange}
            />

            {/* Sidebar */}
            <Sidebar
              downloadUrls={downloadUrls}
              handleSaveClick={this.handleSaveClick}
              handleDeleteClick={deleteProject}
              showSaveButton={showSaveButton}
              showSettingsButton={showSettingsButton}
              handleExportToMIDIClick={this.handleExportToMIDIClick}
            />
          </Fullscreen>
        </ProjectContextProvider>
      </HotKeys>
    );
  }
}

Project.propTypes = propTypes;

export default Project;
