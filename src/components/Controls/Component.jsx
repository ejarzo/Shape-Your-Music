import React from 'react';
import PropTypes from 'prop-types';
import NumericInput from 'react-numeric-input';
import Select from 'react-select';

import ColorPicker from 'components/ColorPicker';
import DrawToolIcon from 'components/icons/DrawTool';
import EditToolIcon from 'components/icons/EditTool';

const propTypes = {
  isPlaying: PropTypes.bool.isRquired,
  activeTool: PropTypes.string.isRquired,
  handlePlayClick: PropTypes.func.isRquired,
  colorsList: PropTypes.array.isRquired,
  activeColorIndex: PropTypes.number.isRquired,
  handleColorChange: PropTypes.func.isRquired,
  handleDrawToolClick: PropTypes.func.isRquired,
  handleEditToolClick: PropTypes.func.isRquired,

  isGridActive: PropTypes.bool.isRquired,
  handleGridToggleChange: PropTypes.func.isRquired,
  isSnapToGridActive: PropTypes.bool.isRquired,
  handleSnapToGridToggleChange: PropTypes.func.isRquired,
  isAutoQuantizeActive: PropTypes.bool.isRquired,
  handleAutoQuantizeChange: PropTypes.func.isRquired,

  handleTempoChange: PropTypes.func.isRquired,
  tempo: PropTypes.number.isRquired,
  scaleObj: PropTypes.object.isRquired,
  tonicsList: PropTypes.array.isRquired,
  handleTonicChange: PropTypes.func.isRquired,
  scalesList: PropTypes.array.isRquired,
  handleScaleChange: PropTypes.func.isRquired,

  isFullscreenEnabled: PropTypes.bool.isRequired,
  handleFullscreenButtonClick: PropTypes.func.isRequired,
  handleClearButtonClick: PropTypes.func.isRequired,
};


function ControlsComponent (props) {
  const playButtonClass = props.isPlaying ? 'ion-stop' : 'ion-play';
  const fullscreenButtonClass = props.isFullscreenEnabled ? 'ion-arrow-shrink' : 'ion-arrow-expand';

  return (
    <div className="controls">
     
      {/* Transport Controls */}
      <div className="controls-section transport-controls">
        <div className="ctrl-elem">
          <button 
              className="icon-button" 
              onClick={props.handlePlayClick} 
              title="Play project (SPACE)"
          >
            <i className={playButtonClass}></i>
          </button>
        </div>
        <div className="ctrl-elem">
          <button className="icon-button" title="Record to audio file">
            <i className="ion-record"></i>
          </button>
        </div>
      </div>

      {/* Drawing Controls*/}
      <div className="controls-section">
          
        {/* Color Select */}
        <div className="ctrl-elem">
          <ColorPicker 
            ref={(c) => this.colorPicker = c}
            colorsList={props.colorsList}
            activeColorIndex={props.activeColorIndex}
            onColorChange={props.handleColorChange}
          />
        </div>

        {/* Tool Select */}
        <div className="ctrl-elem">
          <span
            className={'tool-button ' + (props.activeTool === 'draw' ? 'selected' : '')}
            onClick={props.handleDrawToolClick}
            title="Draw Tool (TAB to toggle)">
            <DrawToolIcon fill={props.activeTool === 'draw' ? '#FFFFFF' : '#242424'}/>
          </span>
        </div>
        <div className="ctrl-elem no-margin">
          <span 
            className={'tool-button ' + (props.activeTool === 'edit' ? 'selected' : '')}
            onClick={props.handleEditToolClick}
            title="Edit Tool (TAB to toggle)">
            <EditToolIcon fill={props.activeTool === 'edit' ? '#FFFFFF' : '#242424'}/>
          </span>                        
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="controls-section">
        <div className="ctrl-elem no-margin">
          {/* Grid */}
          <input 
            id="grid-toggle" 
            type="checkbox"
            checked={props.isGridActive}
            onChange={props.handleGridToggleChange}/>
          <label 
            className="checkbox-label" 
            htmlFor="grid-toggle"
            style={{
              borderTopLeftRadius: '3px', 
              borderBottomLeftRadius: '3px'
            }}>
            Grid
          </label>
          
          {/* Snap To Grid */}
          <input 
            id="snap-to-grid-toggle" 
            type="checkbox" 
            checked={props.isSnapToGridActive}
            onChange={props.handleSnapToGridToggleChange}/>
          <label className="checkbox-label" htmlFor="snap-to-grid-toggle">Snap</label>
          
          {/* Toggle Auto Quantize*/}
          <input 
            id="auto-quantize-toggle" 
            type="checkbox" 
            checked={props.isAutoQuantizeActive}
            onChange={props.handleAutoQuantizeChange}/>
          <label 
            className="checkbox-label" 
            style={{
              borderTopRightRadius: '3px', 
              borderBottomRightRadius: '3px'
            }}
            htmlFor="auto-quantize-toggle">
            Sync
          </label>
        </div>
      </div>

      {/* Music Controls */}
      <div className="controls-section music-controls">
        <span className="ctrl-elem small">
          <div className="full-width">
            <label>Tempo</label>
            <NumericInput 
              className="numeric-input" 
              min={1} 
              max={100}
              onChange={props.handleTempoChange}
              value={props.tempo}
              style={{
                input: {
                  lineHeight: '10',
                  padding: 'none'
                },
                'input:focus' : {
                  border: '1px inset #222',
                  outline: 'none'
                },
                btn: {
                  boxShadow: 'none'
                },
                btnUp: {
                  color: '#ddd',
                  borderRadius: 'none',
                  background: 'none',
                  border: 'none',
                },
                btnDown: {
                  color: '#ddd',
                  borderRadius: 'none',
                  background: 'none',
                  border: 'none',
                },
                arrowUp: {
                  borderBottomColor: 'rgba(102, 102, 102, 1)'
                },
                arrowDown: {
                  borderTopColor: 'rgba(102, 102, 102, 1)'
                }
              }} 
            />
          </div>
        </span>
        <span className="ctrl-elem small">
          <div className="full-width">
            <label>Key</label>
            <Select
                searchable={false}
                clearable={false}
                name="Key Select"
                value={props.scaleObj.tonic.toString(true)}
                options={props.tonicsList}
                onChange={props.handleTonicChange}/>
          </div>
        </span>
        <span className="ctrl-elem large">
          <div className="full-width">
            <label>Scale</label>
            <Select
              color="red"
              searchable={false}
              clearable={false}
              name="Key Select"
              value={props.scaleObj.name}
              options={props.scalesList}
              onChange={props.handleScaleChange}/>
          </div>
        </span>
      </div>

      {/* Canvas Controls */}
      <div className="controls-section canvas-controls">
        <div className="ctrl-elem">
          <button className="icon-button" onClick={props.handleFullscreenButtonClick}>
            <i className={fullscreenButtonClass}></i>
          </button>
        </div>
        <div className="ctrl-elem">
          <button onClick={props.handleClearButtonClick}>
            Clear
          </button>
        </div>
      </div>

    </div>
  );
}

ControlsComponent.propTypes = propTypes;

export default ControlsComponent;
