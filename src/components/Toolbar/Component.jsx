import React, { useContext } from 'react';
import { func } from 'prop-types';
import cx from 'classnames';

import Button from 'components/Button';
import IconButton from 'components/IconButton';
import CheckboxButton from 'components/CheckboxButton';
import CustomSelect from 'components/CustomSelect';
import TempoInput from 'components/TempoInput';

import DrawToolIcon from 'components/icons/DrawTool';
import EditToolIcon from 'components/icons/EditTool';
import { themeColors, appColors, getDarker } from 'utils/color';

import styles from './styles.module.css';

import { TOOL_TYPES } from 'components/Project';
import { SCALES, TONICS } from 'utils/music';

import { ProjectContext } from 'components/Project/ProjectContextProvider';

import ColorSelect from './ColorSelect';
import { Tooltip } from 'antd';

const { black, grayLightest, red } = appColors;

const propTypes = {
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
  handleClearButtonClick: func.isRequired,
};

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
    // handleFullscreenButtonClick,
    handleClearButtonClick,
    handleColorChange,
  } = props;

  const {
    isPlaying,
    isArmed,
    isRecording,
    activeTool,
    scaleObj,
    tempo,
    // isFullscreenEnabled,
    isGridActive,
    isSnapToGridActive,
    isAutoQuantizeActive,
    activeColorIndex,
  } = useContext(ProjectContext);

  const lightGray = getDarker(grayLightest);
  const playButtonClass = isPlaying ? 'ion-stop' : 'ion-play';
  const isDrawTool = activeTool === TOOL_TYPES.DRAW;
  const isEditTool = activeTool === TOOL_TYPES.EDIT;
  const activeColor = themeColors[activeColorIndex];

  return (
    <div className={styles.toolbar}>
      {/* TRANSPORT CONTROLS */}
      <div className={styles.toolbarSection}>
        <Tooltip title="Play" placement="bottomLeft">
          <div>
            <IconButton
              iconClassName={playButtonClass}
              onClick={handlePlayClick}
              title="Play project (SPACE)"
            />
          </div>
        </Tooltip>
        <Tooltip title="Record project to audio file" placement="bottomLeft">
          <div
            className={isRecording ? styles.pulse : undefined}
            style={{ color: (isArmed || isRecording) && red }}
          >
            <IconButton
              iconClassName={'ion-record'}
              onClick={handleRecordClick}
            />
          </div>
        </Tooltip>
      </div>

      {/* TOOL CONTROLS */}
      <div className={cx(styles.toolbarSection, styles.toolSelect)}>
        <ColorSelect
          activeColor={activeColor}
          handleColorChange={handleColorChange}
        />
        <Tooltip
          title={
            <span>
              Draw Tool <span style={{ opacity: 0.6 }}>(TAB)</span>
            </span>
          }
        >
          <div>
            <Button
              hasBorder
              color={isDrawTool ? black : grayLightest}
              onClick={handleDrawToolClick}
            >
              <DrawToolIcon fill={isDrawTool ? grayLightest : black} />
            </Button>
          </div>
        </Tooltip>
        <Tooltip
          title={
            <span>
              Edit Tool <span style={{ opacity: 0.6 }}>(TAB)</span>
            </span>
          }
        >
          <div>
            <Button
              hasBorder
              color={isEditTool ? black : grayLightest}
              onClick={handleEditToolClick}
            >
              <EditToolIcon fill={!isDrawTool ? grayLightest : black} />
            </Button>
          </div>
        </Tooltip>
      </div>

      {/* CANVAS CONTROLS */}
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
              checked={isGridActive}
              onChange={handleGridToggleChange}
              label={'Grid'}
            />
          </div>
          <div>
            <CheckboxButton
              checked={isSnapToGridActive}
              onChange={handleSnapToGridToggleChange}
              label={'Snap'}
            />
          </div>
        </div>

        <Tooltip title="Locks shape perimeters">
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
              checked={isAutoQuantizeActive}
              onChange={handleAutoQuantizeChange}
              label={'Sync'}
            />
          </div>
        </Tooltip>
      </div>

      {/* MUSICAL CONTROLS */}
      <div className={cx(styles.toolbarSection, styles.musicalControls)}>
        <TempoInput onChange={handleTempoChange} value={tempo} />
        <CustomSelect
          value={scaleObj.tonic.toString(true)}
          options={TONICS}
          onChange={handleTonicChange}
          title="Key Root"
        />
        <CustomSelect
          value={scaleObj.name}
          options={SCALES}
          onChange={handleScaleChange}
          title="Key Mode"
        />
      </div>

      {/* OTHER */}
      <div className={cx(styles.toolbarSection, styles.OtherControls)}>
        <div>
          <Button
            hasBorder
            // darkHover
            color={grayLightest}
            onClick={handleClearButtonClick}
            title="Clear all shapes (CANNOT UNDO)"
          >
            Clear
          </Button>
        </div>
        {/* TODO: re-enable if fullscreen bug is fixed (ShapeEditorPopover not appearing in fullscreen) */}
        {/* <div>
        <IconButton
          iconClassName={fullscreenButtonClass}
          onClick={handleFullscreenButtonClick}
          title="Toggle Fullscreen"
        />
      </div> */}
      </div>
    </div>
  );
}

ToolbarComponent.propTypes = propTypes;

export default ToolbarComponent;
