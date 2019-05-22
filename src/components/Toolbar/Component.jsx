import React from 'react';
import { bool, func, string, number, object } from 'prop-types';
import cx from 'classnames';

import Button from 'components/Button';
import IconButton from 'components/IconButton';
import CheckboxButton from 'components/CheckboxButton';
import CustomSelect from 'components/CustomSelect';
import TempoInput from 'components/TempoInput';

import ColorPicker from 'components/ColorPicker';
import DrawToolIcon from 'components/icons/DrawTool';
import EditToolIcon from 'components/icons/EditTool';
import { themeColors, appColors, getDarker } from 'utils/color';

import styles from './styles.module.css';

import { TOOL_TYPES } from 'views/Project/Container';
import { SCALES, TONICS } from 'utils/music';

import withProjectContext from 'views/Project/withProjectContext';

const { black, grayLightest, red } = appColors;

const propTypes = {
  isColorPickerOpen: bool.isRequired,
  handlePlayClick: func.isRequired,
  handleRecordClick: func.isRequired,
  handleColorChange: func.isRequired,
  handleDrawToolClick: func.isRequired,
  handleEditToolClick: func.isRequired,
  handleGridToggleChange: func.isRequired,
  handleSnapToGridToggleChange: func.isRequired,
  handleAutoQuantizeChange: func.isRequired,
  handleTempoChange: func.isRequired,
  handleTonicChange: func.isRequired,
  handleScaleChange: func.isRequired,
  handleFullscreenButtonClick: func.isRequired,
  handleClearButtonClick: func.isRequired,
  handleExportToMIDIClick: func.isRequired,
};

/* ---------------------- Transport ---------------------- */

function TransportControls(props) {
  const playButtonClass = props.isPlaying ? 'ion-stop' : 'ion-play';
  return (
    <div className={styles.toolbarSection}>
      <div>
        <IconButton
          iconClassName={playButtonClass}
          onClick={props.handlePlayClick}
          title="Play project (SPACE)"
        />
      </div>
      <div
        className={props.isRecording ? styles.pulse : undefined}
        style={{ color: (props.isArmed || props.isRecording) && red }}
      >
        <IconButton
          iconClassName={'ion-record'}
          onClick={props.handleRecordClick}
          title="Record project to audio file"
        />
      </div>
    </div>
  );
}

TransportControls.propTypes = {
  isPlaying: bool.isRequired,
  isArmed: bool.isRequired,
  isRecording: bool.isRequired,
  handlePlayClick: func.isRequired,
  handleRecordClick: func.isRequired,
};

/* ---------------------- Tool Select ---------------------- */

function ToolSelect(props) {
  const {
    activeTool,
    isColorPickerOpen,
    handleColorMouseEnter,
    handleColorMouseLeave,
    activeColorIndex,
    onColorChange,
    handleDrawToolClick,
    handleEditToolClick,
  } = props;

  const isDrawTool = activeTool === TOOL_TYPES.DRAW;
  const isEditTool = activeTool === TOOL_TYPES.EDIT;
  const activeColor = themeColors[activeColorIndex];

  return (
    <div className={cx(styles.toolbarSection, styles.toolSelect)}>
      <div
        onMouseEnter={handleColorMouseEnter}
        onMouseLeave={handleColorMouseLeave}
        style={{ position: 'relative' }}
      >
        <Button hasBorder color={activeColor} />
        {isColorPickerOpen && (
          <div
            style={{
              width: 140,
              left: 0,
              top: 7,
              height: 50,
              position: 'relative',
              zIndex: 500,
            }}
          >
            <ColorPicker
              color={themeColors[activeColorIndex]}
              onChange={onColorChange}
            />
          </div>
        )}
      </div>
      <Button
        darkHover
        hasBorder
        color={isDrawTool ? black : grayLightest}
        onClick={handleDrawToolClick}
        title="Draw Tool (TAB to toggle)"
      >
        <DrawToolIcon fill={isDrawTool ? grayLightest : black} />
      </Button>
      <Button
        darkHover
        hasBorder
        color={isEditTool ? black : grayLightest}
        onClick={handleEditToolClick}
        title="Edit Tool (TAB to toggle)"
      >
        <EditToolIcon fill={!isDrawTool ? grayLightest : black} />
      </Button>
    </div>
  );
}

ToolSelect.propTypes = {
  activeTool: string.isRequired,
  handleDrawToolClick: func.isRequired,
  handleEditToolClick: func.isRequired,
  activeColorIndex: number.isRequired,
  onColorChange: func.isRequired,
  handleColorMouseEnter: func.isRequired,
  handleColorMouseLeave: func.isRequired,
  isColorPickerOpen: bool.isRequired,
};

/* ---------------------- Canvas ---------------------- */

function CanvasControls(props) {
  // TODO theme
  const lightGray = getDarker(grayLightest);
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '66% 34%', gridGap: 3 }}
    >
      <div
        className={cx(styles.toolbarSection, styles.canvasControls)}
        style={{
          borderRadius: 3,
          padding: 0,
          border: `1px solid ${lightGray}`,
          background: lightGray,
          gridGap: 1,
          overflow: 'hidden',
        }}
      >
        <div>
          <CheckboxButton
            checked={props.isGridActive}
            onChange={props.handleGridToggleChange}
            label={'Grid'}
          />
        </div>
        <div>
          <CheckboxButton
            checked={props.isSnapToGridActive}
            onChange={props.handleSnapToGridToggleChange}
            label={'Snap'}
          />
        </div>
      </div>

      <div
        style={{
          borderRadius: 3,
          padding: 0,
          border: `1px solid ${lightGray}`,
          background: lightGray,
          gridGap: 1,
          overflow: 'hidden',
        }}
      >
        <CheckboxButton
          checked={props.isAutoQuantizeActive}
          onChange={props.handleAutoQuantizeChange}
          label={'Sync'}
        />
      </div>
    </div>
  );
}

CanvasControls.propTypes = {
  isGridActive: bool.isRequired,
  isSnapToGridActive: bool.isRequired,
  isAutoQuantizeActive: bool.isRequired,
  handleGridToggleChange: func.isRequired,
  handleSnapToGridToggleChange: func.isRequired,
  handleAutoQuantizeChange: func.isRequired,
};

/* ---------------------- Musical ---------------------- */

function MusicalControls(props) {
  return (
    <div className={cx(styles.toolbarSection, styles.musicalControls)}>
      <TempoInput onChange={props.handleTempoChange} value={props.tempo} />
      <CustomSelect
        value={props.scaleObj.tonic.toString(true)}
        options={TONICS}
        onChange={props.handleTonicChange}
        title="Key Root"
      />
      <CustomSelect
        value={props.scaleObj.name}
        options={SCALES}
        onChange={props.handleScaleChange}
        title="Key Mode"
      />
    </div>
  );
}

MusicalControls.propTypes = {
  scaleObj: object.isRequired,
  handleScaleChange: func.isRequired,
  handleTonicChange: func.isRequired,
  handleTempoChange: func.isRequired,
  tempo: number.isRequired,
};

/* ---------------------- Other ---------------------- */

function OtherControls(props) {
  const fullscreenButtonClass = props.isFullscreenEnabled
    ? 'ion-arrow-shrink'
    : 'ion-arrow-expand';

  return (
    <div className={cx(styles.toolbarSection, styles.OtherControls)}>
      <div>
        <Button
          hasBorder
          darkHover
          color={grayLightest}
          onClick={props.handleClearButtonClick}
          title="Clear all shapes (CANNOT UNDO)"
        >
          Clear
        </Button>
      </div>
      <div>
        <IconButton
          iconClassName={fullscreenButtonClass}
          onClick={props.handleFullscreenButtonClick}
          title="Toggle Fullscreen"
        />
      </div>
    </div>
  );
}

OtherControls.propTypes = {
  isFullscreenEnabled: bool.isRequired,
  handleFullscreenButtonClick: func.isRequired,
  handleClearButtonClick: func.isRequired,
};

/* ================================ Toolbar ================================ */
function ToolbarComponent(props) {
  const {
    handlePlayClick,
    handleRecordClick,
    handleDrawToolClick,
    handleEditToolClick,
    handleGridToggleChange,
    handleSnapToGridToggleChange,
    handleAutoQuantizeChange,
    handleTonicChange,
    handleScaleChange,
    handleTempoChange,
    handleFullscreenButtonClick,
    handleClearButtonClick,
    handleExportToMIDIClick,
    handleColorChange,
    handleColorMouseEnter,
    handleColorMouseLeave,
    isColorPickerOpen,
    handleSaveClick,
    // Context
    isPlaying,
    isArmed,
    isRecording,
    activeTool,
    scaleObj,
    tempo,
    isFullscreenEnabled,
    isGridActive,
    isSnapToGridActive,
    isAutoQuantizeActive,
    activeColorIndex,
  } = props;

  return (
    <div className={styles.toolbar}>
      <TransportControls
        isPlaying={isPlaying}
        isRecording={isRecording}
        isArmed={isArmed}
        handlePlayClick={handlePlayClick}
        handleRecordClick={handleRecordClick}
      />

      {/* TODO Color */}
      <ToolSelect
        activeTool={activeTool}
        activeColorIndex={activeColorIndex}
        handleDrawToolClick={handleDrawToolClick}
        handleEditToolClick={handleEditToolClick}
        onColorChange={handleColorChange}
        handleColorMouseEnter={handleColorMouseEnter}
        handleColorMouseLeave={handleColorMouseLeave}
        isColorPickerOpen={isColorPickerOpen}
      />
      <CanvasControls
        isGridActive={isGridActive}
        handleGridToggleChange={handleGridToggleChange}
        isSnapToGridActive={isSnapToGridActive}
        handleSnapToGridToggleChange={handleSnapToGridToggleChange}
        isAutoQuantizeActive={isAutoQuantizeActive}
        handleAutoQuantizeChange={handleAutoQuantizeChange}
      />
      <MusicalControls
        scaleObj={scaleObj}
        handleTonicChange={handleTonicChange}
        handleScaleChange={handleScaleChange}
        handleTempoChange={handleTempoChange}
        tempo={tempo}
      />
      <OtherControls
        isFullscreenEnabled={isFullscreenEnabled}
        handleFullscreenButtonClick={handleFullscreenButtonClick}
        handleClearButtonClick={handleClearButtonClick}
      />
      <div className={cx(styles.toolbarSection)}>
        <div>
          <Button
            hasBorder
            darkHover
            color={grayLightest}
            onClick={handleExportToMIDIClick}
            title="Export and download MIDI file"
          >
            Export To MIDI
          </Button>
        </div>
        <div>
          <Button
            hasBorder
            darkHover
            color={grayLightest}
            onClick={handleSaveClick}
            title="Save project"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

ToolbarComponent.propTypes = propTypes;

export default withProjectContext(ToolbarComponent);
