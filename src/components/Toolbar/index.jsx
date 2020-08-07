import React from 'react';
import { func } from 'prop-types';
import cx from 'classnames';
import { Tooltip } from 'antd';

import Button from 'components/Button';
import IconButton from 'components/IconButton';
import CheckboxButton from 'components/CheckboxButton';
import CustomSelect from 'components/CustomSelect';
import TempoInput from 'components/TempoInput';

import DrawToolIcon from 'components/icons/DrawTool';
import EditToolIcon from 'components/icons/EditTool';
import { appColors, getDarker } from 'utils/color';

import styles from './styles.module.css';

import { TOOL_TYPES } from 'components/Project';
import { SCALES, TONICS } from 'utils/music';

import ColorSelect from './ColorSelect';
import { PROJECT_ACTIONS } from 'utils/project';
import { useProjectContext } from 'context/useProjectContext';

const { black, grayLightest, red } = appColors;

const propTypes = {
  handlePlayClick: func.isRequired,
  handleRecordClick: func.isRequired,
  handleClearButtonClick: func.isRequired,
};

function ToolbarComponent(props) {
  const { handlePlayClick, handleRecordClick, handleClearButtonClick } = props;

  const {
    isPlaying,
    isArmed,
    isRecording,
    activeTool,
    scaleObj,
    tempo,
    isGridActive,
    isSnapToGridActive,
    isAutoQuantizeActive,
    dispatch,
  } = useProjectContext();

  const lightGray = getDarker(grayLightest);
  const playButtonClass = isPlaying ? 'ion-stop' : 'ion-play';
  const isDrawTool = activeTool === TOOL_TYPES.DRAW;
  const isEditTool = activeTool === TOOL_TYPES.EDIT;

  return (
    <div className={styles.toolbar}>
      {/* TRANSPORT CONTROLS */}
      <div className={styles.toolbarSection}>
        <Tooltip
          title={
            <span>
              {isPlaying ? 'Stop' : 'Play'}{' '}
              <span style={{ opacity: 0.6 }}>(SPACE)</span>
            </span>
          }
          placement="bottomLeft"
        >
          <div>
            <IconButton
              iconClassName={playButtonClass}
              onClick={handlePlayClick}
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
        <ColorSelect />
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
              onClick={() => {
                dispatch({
                  type: PROJECT_ACTIONS.SET_ACTIVE_TOOL,
                  payload: TOOL_TYPES.DRAW,
                });
              }}
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
              onClick={() => {
                dispatch({
                  type: PROJECT_ACTIONS.SET_ACTIVE_TOOL,
                  payload: TOOL_TYPES.EDIT,
                });
              }}
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
              onChange={() => {
                dispatch({ type: PROJECT_ACTIONS.TOGGLE_GRID });
              }}
              label={'Grid'}
            />
          </div>
          <div>
            <CheckboxButton
              checked={isSnapToGridActive}
              onChange={() => {
                dispatch({ type: PROJECT_ACTIONS.TOGGLE_SNAP_TO_GRID });
              }}
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
              onChange={() => {
                dispatch({ type: PROJECT_ACTIONS.TOGGLE_AUTO_QUANTIZE });
              }}
              label={'Sync'}
            />
          </div>
        </Tooltip>
      </div>

      {/* MUSICAL CONTROLS */}
      <div className={cx(styles.toolbarSection, styles.musicalControls)}>
        <TempoInput
          onChange={val => {
            dispatch({ type: PROJECT_ACTIONS.SET_TEMPO, payload: val });
          }}
          value={tempo}
        />
        <CustomSelect
          value={scaleObj.tonic.toString(true)}
          options={TONICS}
          onChange={({ value }) => {
            dispatch({ type: PROJECT_ACTIONS.SET_TONIC, payload: value });
          }}
          title="Key Root"
        />
        <CustomSelect
          value={scaleObj.name}
          options={SCALES}
          onChange={({ value }) => {
            dispatch({ type: PROJECT_ACTIONS.SET_MODE, payload: value });
          }}
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
