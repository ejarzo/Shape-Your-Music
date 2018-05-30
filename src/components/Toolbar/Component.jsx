import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import NumericInput from 'react-numeric-input';
import Select from 'react-select';
import { GithubPicker } from 'react-color';

import Button from 'components/Button';
import CheckboxButton from 'components/CheckboxButton';
import CustomSelect from 'components/CustomSelect';

import ColorPicker from 'components/ColorPicker';
import DrawToolIcon from 'components/icons/DrawTool';
import EditToolIcon from 'components/icons/EditTool';

import styles from './styles.css';

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
  isSnapToGridActive: PropTypes.bool.isRquired,
  isAutoQuantizeActive: PropTypes.bool.isRquired,
  handleGridToggleChange: PropTypes.func.isRquired,
  handleSnapToGridToggleChange: PropTypes.func.isRquired,
  handleAutoQuantizeChange: PropTypes.func.isRquired,

  handleTempoChange: PropTypes.func.isRquired,
  tempo: PropTypes.number.isRquired,
  scaleObj: PropTypes.object.isRquired,
  tonicsList: PropTypes.array.isRquired,
  scalesList: PropTypes.array.isRquired,
  handleTonicChange: PropTypes.func.isRquired,
  handleScaleChange: PropTypes.func.isRquired,

  isFullscreenEnabled: PropTypes.bool.isRequired,
  handleFullscreenButtonClick: PropTypes.func.isRequired,
  handleClearButtonClick: PropTypes.func.isRequired,
};

/* ---------------------- Transport ---------------------- */

function TransportControls (props) {
  const playButtonClass = props.isPlaying ? 'ion-stop' : 'ion-play';
  return (
    <div className={styles.toolbarSection}>
      <div>
        <Button
          color={'#fff'}
          onClick={props.handlePlayClick}
          title="Play project (SPACE)"
        >
          <i className={playButtonClass}></i>
        </Button>
      </div>
      <div>
        <Button
          color={'#fff'}
          // onClick={}
        >
          <i className="ion-record"></i>
        </Button>
      </div>
    </div>
  );
}

TransportControls.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  handlePlayClick: PropTypes.func.isRequired,
};

/* ---------------------- Tool Select ---------------------- */

function ToolSelect (props) {
  const isDrawTool = props.activeTool === 'draw';
  const activeColor = props.colorsList[props.activeColorIndex];
  return (
    <div className={cx(styles.toolbarSection, styles.toolSelect)}>
      <Button
        color={activeColor}
        onClick={}
        title=""
      >
        <GithubPicker
          style={{
            borderRadius: 0
          }}
          color={activeColor}
          colors={props.colorsList}
          width="100%"
          triangle="hide"
          // onChange={props.onColorChange}
        />
      </Button>
      <Button
        color={isDrawTool ? '#242424' : '#FFFFFF'}
        onClick={props.handleDrawToolClick}
        title="Draw Tool (TAB to toggle)">
        <DrawToolIcon fill={isDrawTool ? '#FFFFFF' : '#242424'}/>
      </Button>
      <Button
        color={!isDrawTool ? '#242424' : '#FFFFFF'}
        onClick={props.handleEditToolClick}
        title="Edit Tool (TAB to toggle)">
        <EditToolIcon fill={!isDrawTool ? '#FFFFFF' : '#242424'}/>
      </Button>                        
    </div>
  );
}

ToolSelect.propTypes = {
  activeTool: PropTypes.string.isRequired,
  handleDrawToolClick: PropTypes.func.isRequired,
  handleEditToolClick: PropTypes.func.isRequired,
  colorsList: PropTypes.array.isRequired,
  activeColorIndex: PropTypes.number.isRequired,
};

/* ---------------------- Canvas ---------------------- */

function CanvasControls (props) {
  return (
    <div className={cx(styles.toolbarSection, styles.canvasControls)}>
      <div>
        <CheckboxButton
          color={'#242424'}
          checked={props.isGridActive}
          onChange={props.handleGridToggleChange}
          label={'Grid'}
        />
      </div>
      <div>
        <CheckboxButton
          color={'#242424'}
          checked={props.isSnapToGridActive}
          onChange={props.handleSnapToGridToggleChange}
          label={'Snap'}
        />
      </div>
      <div>
        <CheckboxButton
          color={'#242424'}
          checked={props.isAutoQuantizeActive}
          onChange={props.handleAutoQuantizeChange}
          label={'Sync'}
        />
      </div>
    </div>
  );
}

CanvasControls.propTypes = {
  isGridActive: PropTypes.bool.isRequired,
  isSnapToGridActive: PropTypes.bool.isRequired,
  isAutoQuantizeActive: PropTypes.bool.isRequired,
  handleGridToggleChange: PropTypes.func.isRequired,
  handleSnapToGridToggleChange: PropTypes.func.isRequired,
  handleAutoQuantizeChange: PropTypes.func.isRequired,
};

/* ---------------------- Musical ---------------------- */

function MusicalControls (props) {
  return (
    <div className={cx(styles.toolbarSection, styles.musicalControls)}>
      <CustomSelect
        color={'#fff'}
        inverted
        value={props.scaleObj.tonic.toString(true)}
        options={props.tonicsList}
        onChange={props.handleTonicChange}
      />
      <CustomSelect
        color={'#fff'}
        inverted
        value={props.scaleObj.name}
        options={props.scalesList}
        onChange={props.handleScaleChange}
      />
    </div>
  );
}

MusicalControls.propTypes = {
  scaleObj: PropTypes.object.isRequired,
  scalesList: PropTypes.array.isRequired,
  tonicsList: PropTypes.array.isRequired,
  handleScaleChange: PropTypes.func.isRequired,
  handleTonicChange: PropTypes.func.isRequired,
};

/* ---------------------- Other ---------------------- */

function OtherControls (props) {
  const fullscreenButtonClass =
    props.isFullscreenEnabled
      ? 'ion-arrow-shrink'
      : 'ion-arrow-expand';

  return (
    <div className={cx(styles.toolbarSection, styles.OtherControls)}>
      <div>
        <Button
          color={'#fff'}
          onClick={props.handleFullscreenButtonClick}
        >
          <i className={fullscreenButtonClass} />
       </Button> 
     </div>
     <div>
        <Button
          color={'#fff'}
          onClick={props.handleClearButtonClick}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

OtherControls.propTypes = {
  isFullscreenEnabled: PropTypes.bool.isRequired,
  handleFullscreenButtonClick: PropTypes.func.isRequired,
  handleClearButtonClick: PropTypes.func.isRequired,
};

/* ================================ Toolbar ================================ */
function ToolbarComponent (props) {
  return (
    <div className={styles.toolbar}>
      <TransportControls
        isPlaying={props.isPlaying}
        handlePlayClick={props.handlePlayClick}
      />
      {/* TODO Color */}
      <ToolSelect
        handleDrawToolClick={props.handleDrawToolClick}
        activeTool={props.activeTool}
        handleEditToolClick={props.handleEditToolClick}
        colorsList={props.colorsList}
        activeColorIndex={props.activeColorIndex}
      />
      <CanvasControls
        isGridActive={props.isGridActive}
        handleGridToggleChange={props.handleGridToggleChange}
        isSnapToGridActive={props.isSnapToGridActive}
        handleSnapToGridToggleChange={props.handleSnapToGridToggleChange}
        isAutoQuantizeActive={props.isAutoQuantizeActive}
        handleAutoQuantizeChange={props.handleAutoQuantizeChange}
      />
      {/* TODO tempo */}
      <MusicalControls
        scaleObj={props.scaleObj}
        scalesList={props.scalesList}
        tonicsList={props.tonicsList}
        handleTonicChange={props.handleTonicChange}
        handleScaleChange={props.handleScaleChange}
      />
      <OtherControls
        isFullscreenEnabled={props.isFullscreenEnabled}
        handleFullscreenButtonClick={props.handleFullscreenButtonClick}
        handleClearButtonClick={props.handleClearButtonClick}
      />
    </div>
  );


}

ToolbarComponent.propTypes = propTypes;

export default ToolbarComponent;


/*

  return (
    <div className="controls">
     

      <div className="controls-section">
          
        <div className="ctrl-elem">
          <ColorPicker 
            ref={(c) => this.colorPicker = c}
            colorsList={props.colorsList}
            activeColorIndex={props.activeColorIndex}
            onColorChange={props.handleColorChange}
          />
        </div>

      
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
    </div>
  );

*/