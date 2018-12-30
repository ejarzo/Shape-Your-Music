import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Fullscreen from 'react-full-screen';
import Teoria from 'teoria';
import Tone from 'tone';
import Recorder from 'utils/Recorder';

import Toolbar from 'components/Toolbar';
import Sidebar from 'components/Sidebar';
import ShapeCanvas from 'components/ShapeCanvas';
import ColorControllerPanel from 'components/ColorControllerPanel';
import PRESETS from 'presets';
import { themeColors } from 'utils/color';

/* ========================================================================== */

export const ProjectContext = React.createContext({});

export const TOOL_TYPES = {
  EDIT: 'edit',
  DRAW: 'draw',
};

/* master output */
const masterCompressor = new Tone.Compressor({
  ratio: 16,
  threshold: -30,
  release: 0.25,
  attack: 0.003,
  knee: 30,
});
const masterLimiter = new Tone.Limiter(-2);
const masterOutput = new Tone.Gain(0.9).receive('masterOutput');

masterOutput.chain(masterCompressor, masterLimiter, Tone.Master);

/* ========================================================================== */

const propTypes = {
  initState: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tonic: PropTypes.string.isRequired,
    scale: PropTypes.string.isRequired,
    tempo: PropTypes.number.isRequired,
  }).isRequired,
};

class Project extends Component {
  constructor(props) {
    super(props);

    // indeces of default instruments
    const selectedInstruments = [0, 1, 4, 3, 2];
    const knobVals = [];
    selectedInstruments.forEach(instrumentIndex => {
      const instrumentDefaults = PRESETS[instrumentIndex].dynamicParams.map(
        param => param.default
      );
      knobVals.push(instrumentDefaults);
    });

    this.state = {
      name: props.initState.name,

      isFullscreenEnabled: false,
      isGridActive: false,
      isSnapToGridActive: false,
      isAutoQuantizeActive: false,
      isPlaying: false,
      isRecording: false,
      isArmed: false,
      isAltPressed: false,

      quantizeLength: 700,
      tempo: props.initState.tempo,
      scaleObj: Teoria.note(props.initState.tonic).scale(props.initState.scale),
      activeTool: TOOL_TYPES.DRAW,
      activeColorIndex: 0,

      downloadUrls: [],
      selectedInstruments,
      knobVals,
    };

    // transport
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleRecordClick = this.handleRecordClick.bind(this);

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
    this.recorder = new Recorder(Tone.Master);
    this.beginRecording = this.beginRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
  }

  /* ============================= LIFECYCLE ============================== */

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /* ============================== HANDLERS ============================== */

  /* --- Transport -------------------------------------------------------- */

  beginRecording() {
    this.recorder.record();
    this.setState({ isRecording: true });
  }

  stopRecording() {
    this.recorder.exportWAV(blob => {
      const url = URL.createObjectURL(blob);
      const downloadUrls = this.state.downloadUrls.slice();
      downloadUrls.push(url);
      this.setState({
        downloadUrls,
      });
      this.recorder.stop();
      this.recorder.clear();
    });
    this.setState({
      isRecording: false,
      isArmed: false,
    });
  }

  handlePlayClick() {
    Tone.Transport.toggle();
    if (this.state.isArmed) {
      this.beginRecording();
    }
    if (this.state.isRecording) {
      this.stopRecording();
    }
    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying,
    }));
  }

  handleRecordClick() {
    if (this.state.isRecording) {
      this.stopRecording();
    } else {
      if (this.state.isPlaying) {
        this.beginRecording();
      } else {
        this.setState({
          isArmed: !this.state.isArmed,
        });
      }
    }
  }

  /* --- Tool ------------------------------------------------------------- */

  toggleActiveTool() {
    let newTool = TOOL_TYPES.DRAW;
    if (this.shapeCanvas.canChangeTool()) {
      if (this.state.activeTool === TOOL_TYPES.DRAW) {
        newTool = TOOL_TYPES.EDIT;
      }
      this.setState({
        activeTool: newTool,
      });
    }
  }

  handleDrawToolClick() {
    this.setAciveTool(TOOL_TYPES.DRAW);
  }

  handleEditToolClick() {
    this.setAciveTool(TOOL_TYPES.EDIT);
  }

  setAciveTool(tool) {
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

  /* --- Musical ---------------------------------------------------------- */

  handleTempoChange(val) {
    const min = 1;
    const max = 100;
    this.setState({
      tempo: Math.max(Math.min(val, max), min),
    });
  }

  handleTonicChange(val) {
    this.setState(prevState => ({
      scaleObj: Teoria.note(val.value).scale(prevState.scaleObj.name),
    }));
  }

  handleScaleChange(val) {
    if (val) {
      const tonic = this.state.scaleObj.tonic;
      this.setState({
        scaleObj: tonic.scale(val.value),
      });
    }
  }

  /* --- Canvas ----------------------------------------------------------- */

  handleClearButtonClick() {
    this.shapeCanvas.clearAll();
  }

  handleFullscreenButtonClick() {
    this.setState({
      isFullscreenEnabled: !this.state.isFullscreenEnabled,
    });
  }

  /* --- Color Controllers ------------------------------------------------ */

  handleInstChange(colorIndex) {
    return instrumentName => {
      const instrumentIndex = PRESETS.findIndex(
        ({ name }) => name === instrumentName
      );
      const selectedInstruments = this.state.selectedInstruments.slice();
      selectedInstruments[colorIndex] = instrumentIndex;
      const defaultKnobvals = PRESETS[instrumentIndex].dynamicParams.map(
        param => param.default
      );

      const knobVals = this.state.knobVals.slice();
      knobVals[colorIndex] = defaultKnobvals;

      this.setState({
        selectedInstruments,
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

  /* --- Keyboard Shortcuts ----------------------------------------------- */

  handleKeyDown(event) {
    const { key } = event;
    console.warn('Keypress:', key);

    /* Space toggles play */
    if (key === ' ') {
      // event.preventDefault(); // stop from clicking focused buttons
      this.handlePlayClick();
    }

    /* tab toggles active tool */
    if (key === 'Tab') {
      event.preventDefault();
      this.toggleActiveTool();
    }

    /* numbers control draw color */
    if (
      key === '1' ||
      key === '2' ||
      key === '3' ||
      key === '4' ||
      key === '5'
    ) {
      this.setState({
        activeColorIndex: parseInt(key, 10) - 1,
      });
    }

    /* backspace deletes the selected shape */
    if (key === 'Backspace') {
      this.shapeCanvas.deleteSelectedShape();
    }

    /* Alt/option allows duplication */
    if (key === 'Alt') {
      this.setState({ isAltPressed: true });
    }
  }

  handleKeyUp(event) {
    const { key } = event;
    /* Alt/option allows duplication */
    if (key === 'Alt') {
      this.setState({ isAltPressed: false });
    }
  }
  /* =============================== RENDER =============================== */

  render() {
    const {
      isPlaying,
      isRecording,
      isArmed,
      activeColorIndex,
      activeTool,
      isGridActive,
      isSnapToGridActive,
      isAutoQuantizeActive,
      tempo,
      scaleObj,
      isFullscreenEnabled,
      selectedInstruments,
      knobVals,
      quantizeLength,
      downloadUrls,
      isAltPressed,
    } = this.state;

    const projectContext = {
      ...this.state,
    };

    return (
      <ProjectContext.Provider value={projectContext}>
        <Fullscreen
          enabled={isFullscreenEnabled}
          onChange={isFullscreenEnabled =>
            this.setState({ isFullscreenEnabled })
          }
        >
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
            ref={c => (this.shapeCanvas = c)}
            colorIndex={activeColorIndex}
            activeTool={activeTool}
            selectedInstruments={selectedInstruments}
            knobVals={knobVals}
            isAutoQuantizeActive={isAutoQuantizeActive}
            isPlaying={isPlaying}
            scaleObj={scaleObj}
            tempo={tempo}
            quantizeLength={quantizeLength}
            isGridActive={isGridActive}
            isSnapToGridActive={isSnapToGridActive}
            isAltPressed={isAltPressed}
          />

          {/* Instrument controller panels */}
          <ColorControllerPanel
            selectedInstruments={selectedInstruments}
            onInstChange={this.handleInstChange}
            onKnobChange={this.handleKnobChange}
            knobVals={knobVals}
          />

          {/* Sidebar */}
          <Sidebar downloadUrls={downloadUrls} />
        </Fullscreen>
      </ProjectContext.Provider>
    );
  }
}

Project.propTypes = propTypes;

export default Project;
