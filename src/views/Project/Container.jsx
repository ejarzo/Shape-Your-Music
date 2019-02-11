import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fullscreen from 'react-full-screen';
import Teoria from 'teoria';
import Tone from 'tone';

import Toolbar from 'components/Toolbar';
import Sidebar from 'components/Sidebar';
import ShapeCanvas from 'components/ShapeCanvas';
import ColorControllerPanel from 'components/ColorControllerPanel';

import Recorder from 'utils/Recorder';
import { themeColors } from 'utils/color';
import { ZipFile } from 'utils/file';
import PRESETS from 'presets';

const MidiWriter = require('midi-writer-js');

/* ========================================================================== */

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

    // export
    this.handleExportToMIDIClick = this.handleExportToMIDIClick.bind(this);
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
    const { isArmed, isRecording } = this.state;
    Tone.Transport.toggle();

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
  handleExportToMIDIClick() {
    // get list of MIDI events from the shape canvas
    const shapeNoteEventsList = this.shapeCanvas.getShapeMIDINoteEvents();
    const zip = ZipFile('Shape Your Music Project');

    shapeNoteEventsList.forEach((noteEvents, i) => {
      // create MIDI track for each shape
      const track = new MidiWriter.Track();
      // TODO: confirm what the MIDI tempo should be
      track.setTempo(60);
      track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
      track.addTrackName(`Shape ${i + 1}`);

      // TODO: confirm Tick duration calculation
      noteEvents.forEach(({ note, duration }) => {
        const midiNoteEvent = {
          pitch: [note],
          duration: `T${duration * 60 * (100 / this.state.tempo)}`,
        };
        const midiNote = new MidiWriter.NoteEvent(midiNoteEvent);
        track.addEvent(midiNote);
      });

      const write = new MidiWriter.Writer([track]);
      zip.add(`shape-${i + 1}.mid`, write.dataUri());
    });

    zip.download();
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

    return (
      <Fullscreen
        enabled={isFullscreenEnabled}
        onChange={isFullscreenEnabled => this.setState({ isFullscreenEnabled })}
      >
        {/* The Controls */}
        <Toolbar
          isPlaying={isPlaying}
          isRecording={isRecording}
          isArmed={isArmed}
          activeColorIndex={activeColorIndex}
          activeTool={activeTool}
          handlePlayClick={this.handlePlayClick}
          handleRecordClick={this.handleRecordClick}
          handleColorChange={this.handleColorChange}
          handleDrawToolClick={this.handleDrawToolClick}
          handleEditToolClick={this.handleEditToolClick}
          isGridActive={isGridActive}
          handleGridToggleChange={this.handleGridToggleChange}
          isSnapToGridActive={isSnapToGridActive}
          handleSnapToGridToggleChange={this.handleSnapToGridToggleChange}
          isAutoQuantizeActive={isAutoQuantizeActive}
          handleAutoQuantizeChange={this.handleAutoQuantizeChange}
          handleTempoChange={this.handleTempoChange}
          tempo={tempo}
          scaleObj={scaleObj}
          handleTonicChange={this.handleTonicChange}
          handleScaleChange={this.handleScaleChange}
          isFullscreenEnabled={isFullscreenEnabled}
          handleFullscreenButtonClick={this.handleFullscreenButtonClick}
          handleClearButtonClick={this.handleClearButtonClick}
          handleExportToMIDIClick={this.handleExportToMIDIClick}
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
    );
  }
}

Project.propTypes = propTypes;

export default Project;
