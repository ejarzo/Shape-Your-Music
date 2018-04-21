import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Fullscreen from 'react-full-screen';
import Teoria from 'teoria';
import Tone from 'tone';
import Controls from 'components/Controls';
import ShapeCanvas from 'components/ShapeCanvas';
import ColorControllerPanel from 'components/ColorControllerPanel';
import InstColorController from './InstColorController';
import InstrumentPresets from 'presets/InstrumentPresets';


/* ========================================================================== */

const colorsList = [
  '#c9563c', // red
  '#f4b549', // yellow
  '#2a548e', // blue
  '#705498', // purple
  '#33936b'  // green
];

const tonicsList = [
  { value: 'a',  label: 'A' },
  { value: 'a#', label: 'A#' },
  { value: 'b',  label: 'B' },
  { value: 'c',  label: 'C' },
  { value: 'c#', label: 'C#' },
  { value: 'd',  label: 'D' },
  { value: 'd#', label: 'D#' },
  { value: 'e',  label: 'E' },
  { value: 'f',  label: 'F' },
  { value: 'f#', label: 'F#' },
  { value: 'g',  label: 'G' },
  { value: 'g#', label: 'G#' }
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
  { value: 'wholetone', label: 'Wholetone' }
];

const instNamesList = InstrumentPresets.map(preset => ({
  label: preset.name.label,
  value: preset.name.value,
}));

/* master output */
const masterCompressor = new Tone.Compressor({
  ratio: 16,
  threshold: -30,
  release: 0.25,
  attack: 0.003,
  knee: 30
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
  constructor (props) {
    super(props);

    this.state = {
      name: props.initState.name,

      isFullscreenEnabled: false,
      isGridActive: false,
      isSnapToGridActive: false,
      isAutoQuantizeActive: false,
      isPlaying: false,
      
      quantizeLength: 700,
      tempo: props.initState.tempo,
      scaleObj: Teoria
                  .note(props.initState.tonic)
                  .scale(props.initState.scale),

      activeTool: 'draw',
      activeColorIndex: 0,

      selectedInstruments: [0,1,0,1,0], // indeces of default instruments
      knobVals: colorsList.map(() => [0,0,0,0])
    };

    // transport
    this.handlePlayClick = this.handlePlayClick.bind(this);

    // color and tool
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleDrawToolClick = this.handleDrawToolClick.bind(this);
    this.handleEditToolClick = this.handleEditToolClick.bind(this);
    this.toggleActiveTool = this.toggleActiveTool.bind(this);
    this.closeColorPicker = this.closeColorPicker.bind(this);

    // toggles
    this.handleGridToggleChange = this.handleGridToggleChange.bind(this);
    this.handleSnapToGridToggleChange = this.handleSnapToGridToggleChange.bind(this);
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
    this.handleFullscreenButtonClick = this.handleFullscreenButtonClick.bind(this);
  }
  
  /* ============================= LIFECYCLE ============================== */

  componentWillMount () {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /* ============================== HANDLERS ============================== */
  
  /* --- Transport -------------------------------------------------------- */

  handlePlayClick () {
    Tone.Transport.toggle();
    this.setState((prevState) => ({
      isPlaying: !prevState.isPlaying
    }));
  }
  
  /* --- Tool ------------------------------------------------------------- */

  toggleActiveTool () {
    let newTool = 'draw';
    if(this.shapeCanvas.canChangeTool()) {
      if (this.state.activeTool === 'draw') {
        newTool = 'edit';
      }
      this.setState({
        activeTool: newTool
      });
    }
  }

  handleDrawToolClick () {
    this.setAciveTool('draw');
  }

  handleEditToolClick () {
    this.setAciveTool('edit');
  }

  setAciveTool (tool) {
    if(this.shapeCanvas.canChangeTool()) {
      this.setState({
        activeTool: tool
      });
    }
  }
  
  handleColorChange (colorIndex) {
    return () => {
      this.setState({
        activeColorIndex: colorIndex
      });
    };
  }
  
  /* --- Canvas ----------------------------------------------------------- */

  handleGridToggleChange () {
    this.setState({
      isGridActive: !this.state.isGridActive
    });
  }

  handleSnapToGridToggleChange () {
    this.setState({
      isSnapToGridActive: !this.state.isSnapToGridActive
    });
  }

  handleAutoQuantizeChange () {
    this.setState({
      isAutoQuantizeActive: !this.state.isAutoQuantizeActive
    });
  }

  /* --- Musical ---------------------------------------------------------- */

  handleTempoChange (val) {
    this.setState({
      tempo: val
    });
  }

  handleTonicChange (val) {
    this.setState((prevState) => ({
      scaleObj: Teoria.note(val.value).scale(prevState.scaleObj.name),
    }));
  }

  handleScaleChange (val) {
    if (val) {
      const tonic = this.state.scaleObj.tonic;
      this.setState({
        scaleObj: tonic.scale(val.value),
      });
    }
  }

  /* --- Canvas ----------------------------------------------------------- */
  
  handleClearButtonClick () {
    this.shapeCanvas.clearAll();
  }

  handleFullscreenButtonClick () {
    this.setState({
      isFullscreenEnabled: !this.state.isFullscreenEnabled
    });
  }

  /* --- Instrument Colors ------------------------------------------------ */

  handleInstChange (colorIndex) {
    return (instrumentIndex) => {
      console.log(instrumentIndex);
      const selectedInstruments = this.state.selectedInstruments.slice();
      selectedInstruments[colorIndex] = instrumentIndex;
      this.setState({
        selectedInstruments,
      });
    };
  }

  handleKnobChange (colorIndex) {
    return effectIndex =>
      val => {
        this.setState(
          (prevState) => {
            const knobVals = prevState.knobVals.slice();
            const colorKnobVals = knobVals[colorIndex].slice();
            colorKnobVals[effectIndex] = val;
            knobVals[colorIndex] = colorKnobVals;
            return {
              knobVals: knobVals,
            };
          }
        );
      };
  }

  /* --- Keyboard Shortcuts ----------------------------------------------- */

  handleKeyDown (event) {
    console.warn('Keypress:', event.key);

    /* Space toggles play */
    if(event.key === ' ') {
      //event.preventDefault(); // stop from clicking focused buttons
      this.handlePlayClick();
    }

    /* tab toggles active tool */
    if(event.key === 'Tab') {
      event.preventDefault(); 
      this.toggleActiveTool();
    }
    
    /* numbers control draw color */
    if (event.key === '1' || event.key === '2' || event.key === '3' ||
        event.key === '4' || event.key === '5') {
      this.setState({
        activeColorIndex: parseInt(event.key, 10) - 1
      });
    }

    /* backspace deletes the selected shape */
    if(event.key === 'Backspace') {
      this.shapeCanvas.deleteSelectedShape();
    }
  }

  closeColorPicker () {
    // this.colorPicker.close();
  }

  /* =============================== RENDER =============================== */

  render () {    
    console.log('project render');
    return (
      <Fullscreen
        enabled={this.state.isFullscreenEnabled}
        onChange={isFullscreenEnabled => this.setState({isFullscreenEnabled})}>

        {/* The Controls */}   
        <Controls
          isPlaying={this.state.isPlaying}
          colorsList={colorsList}
          activeColorIndex={this.state.activeColorIndex}
          activeTool={this.state.activeTool}

          handlePlayClick={this.handlePlayClick}
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
          ref={(c) => this.shapeCanvas = c}
          colorsList={colorsList}
          colorIndex={this.state.activeColorIndex}
          activeTool={this.state.activeTool}
          closeColorPicker={this.closeColorPicker}
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
          colorsList={colorsList}
          selectedInstruments={this.state.selectedInstruments}
          instNamesList={instNamesList}
          instrumentPresets={InstrumentPresets}
          onInstChange={this.handleInstChange}
          onKnobChange={this.handleKnobChange}
          knobVals={this.state.knobVals}
        />

        {/*<div className="inst-selectors">
          <ul className="inst-list">
            {colorsList.map((color, i) => {
              const selectedInstrumentIndex = this.state.selectedInstruments[i];
              return (
                <InstColorController 
                    key={i}
                    colorIndex={i}
                    colorsList={colorsList}
                    instNamesList={instNamesList}
                    handleInstChange={this.handleInstChange(i)}
                    onKnobChange={this.handleKnobChange(i)}
                    knobVals={this.state.knobVals[i]}
                    synthParams={InstrumentPresets[selectedInstrumentIndex]}
                />
              );
            })}
          </ul>
        </div>*/}

      </Fullscreen>        
    );
  }
}

Project.propTypes = propTypes;

export default Project;
