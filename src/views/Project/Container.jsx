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
import InstrumentPresets from 'presets';
import { themeColors } from 'utils/color';

/* ========================================================================== */

export const TOOL_TYPES = {
  EDIT: 'edit',
  DRAW: 'draw',
};

const tonicsList = [
  { value: 'a', label: 'A' },
  { value: 'a#', label: 'A#' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C' },
  { value: 'c#', label: 'C#' },
  { value: 'd', label: 'D' },
  { value: 'd#', label: 'D#' },
  { value: 'e', label: 'E' },
  { value: 'f', label: 'F' },
  { value: 'f#', label: 'F#' },
  { value: 'g', label: 'G' },
  { value: 'g#', label: 'G#' },
];

const scalesList = [
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: 'dorian', label: 'Dorian' },
  { value: 'phrygian', label: 'Phrygian' },
  { value: 'lydian', label: 'Lydian' },
  { value: 'mixolydian', label: 'Mixolydian' },
  { value: 'locrian', label: 'Locrian' },
  { value: 'majorpentatonic', label: 'Major Pentatonic' },
  { value: 'minorpentatonic', label: 'Minor Pentatonic' },
  { value: 'chromatic', label: 'Chromatic' },
  { value: 'blues', label: 'Blues' },
  { value: 'doubleharmonic', label: 'Double Harmonic' },
  { value: 'flamenco', label: 'Flamenco' },
  { value: 'harmonicminor', label: 'Harmonic Minor' },
  { value: 'melodicminor', label: 'Melodic Minor' },
  { value: 'wholetone', label: 'Wholetone' },
];

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
    const selectedInstruments = [0, 1, 2, 1, 0];
    const knobVals = [];
    selectedInstruments.forEach(instrumentIndex => {
      const instrumentDefaults = InstrumentPresets[
        instrumentIndex
      ].dynamicParams.map(param => param.default);
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
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
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
      const instrumentIndex = InstrumentPresets.findIndex(
        ({ name }) => name.label === instrumentName
      );
      const selectedInstruments = this.state.selectedInstruments.slice();
      selectedInstruments[colorIndex] = instrumentIndex;
      const defaultKnobvals = InstrumentPresets[
        instrumentIndex
      ].dynamicParams.map(param => param.default);

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
    console.warn('Keypress:', event.key);

    /* Space toggles play */
    if (event.key === ' ') {
      //event.preventDefault(); // stop from clicking focused buttons
      this.handlePlayClick();
    }

    /* tab toggles active tool */
    if (event.key === 'Tab') {
      event.preventDefault();
      this.toggleActiveTool();
    }

    /* numbers control draw color */
    if (
      event.key === '1' ||
      event.key === '2' ||
      event.key === '3' ||
      event.key === '4' ||
      event.key === '5'
    ) {
      this.setState({
        activeColorIndex: parseInt(event.key, 10) - 1,
      });
    }

    /* backspace deletes the selected shape */
    if (event.key === 'Backspace') {
      this.shapeCanvas.deleteSelectedShape();
    }
  }

  /* =============================== RENDER =============================== */

  render() {
    return (
      <Fullscreen
        enabled={this.state.isFullscreenEnabled}
        onChange={isFullscreenEnabled => this.setState({ isFullscreenEnabled })}
      >
        {/* The Controls */}
        <Toolbar
          isPlaying={this.state.isPlaying}
          isRecording={this.state.isRecording}
          isArmed={this.state.isArmed}
          activeColorIndex={this.state.activeColorIndex}
          activeTool={this.state.activeTool}
          handlePlayClick={this.handlePlayClick}
          handleRecordClick={this.handleRecordClick}
          handleColorChange={this.handleColorChange}
          handleDrawToolClick={this.handleDrawToolClick}
          handleEditToolClick={this.handleEditToolClick}
          isGridActive={this.state.isGridActive}
          handleGridToggleChange={this.handleGridToggleChange}
          isSnapToGridActive={this.state.isSnapToGridActive}
          handleSnapToGridToggleChange={this.handleSnapToGridToggleChange}
          isAutoQuantizeActive={this.state.isAutoQuantizeActive}
          handleAutoQuantizeChange={this.handleAutoQuantizeChange}
          handleTempoChange={this.handleTempoChange}
          tempo={this.state.tempo}
          scaleObj={this.state.scaleObj}
          tonicsList={tonicsList}
          handleTonicChange={this.handleTonicChange}
          scalesList={scalesList}
          handleScaleChange={this.handleScaleChange}
          isFullscreenEnabled={this.state.isFullscreenEnabled}
          handleFullscreenButtonClick={this.handleFullscreenButtonClick}
          handleClearButtonClick={this.handleClearButtonClick}
        />

        {/* The Canvas */}
        <ShapeCanvas
          ref={c => (this.shapeCanvas = c)}
          colorIndex={this.state.activeColorIndex}
          activeTool={this.state.activeTool}
          selectedInstruments={this.state.selectedInstruments}
          knobVals={this.state.knobVals}
          isAutoQuantizeActive={this.state.isAutoQuantizeActive}
          isPlaying={this.state.isPlaying}
          scaleObj={this.state.scaleObj}
          tempo={this.state.tempo}
          quantizeLength={this.state.quantizeLength}
          isGridActive={this.state.isGridActive}
          isSnapToGridActive={this.state.isSnapToGridActive}
        />

        {/* Instrument controller panels */}
        <ColorControllerPanel
          selectedInstruments={this.state.selectedInstruments}
          instrumentPresets={InstrumentPresets}
          onInstChange={this.handleInstChange}
          onKnobChange={this.handleKnobChange}
          knobVals={this.state.knobVals}
        />
        <Sidebar downloadUrls={this.state.downloadUrls} />
      </Fullscreen>
    );
  }
}

Project.propTypes = propTypes;

export default Project;
