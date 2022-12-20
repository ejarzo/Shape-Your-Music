import React from 'react';
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

import { TOOL_TYPES } from 'utils/project';
import { SCALES, TONICS } from 'utils/music';

import ColorSelect from './ColorSelect';
import { PROJECT_ACTIONS } from 'utils/project';
import { useProjectContext } from 'context/useProjectContext';
import { useColorThemeContext } from 'context/ColorThemeContext/useColorThemeContext';

const { black, grayLightest, red } = appColors;

function ToolbarComponent(props) {
  const {
    isPlaying,
    isArmed,
    isRecording,
    activeTool,
    scaleObj,
    tempo,
    isGridActive,
    // isSnapToGridActive,
    isAutoQuantizeActive,
    dispatch,
    imperativeHandlers: { togglePlayStop, toggleRecord, clearProjectCanvas },
  } = useProjectContext();

  const lightGray = getDarker(grayLightest);
  const playButtonClass = isPlaying ? 'ion-stop' : 'ion-play';
  const isDrawTool = activeTool === TOOL_TYPES.DRAW;
  const isEditTool = activeTool === TOOL_TYPES.EDIT;

  const { isDarkMode } = useColorThemeContext();
  return (
    <div
      className={styles.toolbar}
      style={{ background: isDarkMode && '#333' }}
    >
      {/* TRANSPORT CONTROLS */}
      <div
        className={styles.toolbarSection}
        style={{ color: isDarkMode && appColors.grayLightest }}
      >
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
              onClick={togglePlayStop}
            />
          </div>
        </Tooltip>
        <Tooltip title="Record project to audio file" placement="bottomLeft">
          <div
            className={isRecording ? styles.pulse : undefined}
            style={{ color: (isArmed || isRecording) && red }}
          >
            <IconButton iconClassName={'ion-record'} onClick={toggleRecord} />
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
        style={{ display: 'grid', gridTemplateColumns: '50% 50%', gridGap: 3 }}
      >
        <div
          // className={cx(styles.toolbarSection)}
          style={{
            borderRadius: 3,
            padding: 0,
            border: !isDarkMode && `1px solid ${lightGray}`,
            // background: lightGray,
            gridGap: 1,
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <CheckboxButton
            checked={isGridActive}
            onChange={() => {
              dispatch({ type: PROJECT_ACTIONS.TOGGLE_GRID });
              dispatch({ type: PROJECT_ACTIONS.TOGGLE_SNAP_TO_GRID });
            }}
            label={'Grid'}
            color={isDarkMode && appColors.black}
          />
          {/*  <div>
            <CheckboxButton
              checked={isSnapToGridActive}
              onChange={() => {
                dispatch({ type: PROJECT_ACTIONS.TOGGLE_SNAP_TO_GRID });
              }}
              label={'Snap'}
            />
          </div> */}
        </div>

        <Tooltip title="Sync shape perimeter lengths">
          <div
            style={{
              borderRadius: 3,
              padding: 0,
              border: !isDarkMode && `1px solid ${lightGray}`,
              // background: lightGray,
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
              color={isDarkMode && appColors.black}
            />
          </div>
        </Tooltip>
      </div>

      <div
        className={cx(styles.toolbarSection)}
        style={{
          gridTemplateColumns: '1fr',
        }}
      >
        <TempoInput
          onChange={val => {
            dispatch({ type: PROJECT_ACTIONS.SET_TEMPO, payload: val });
          }}
          value={tempo}
        />
      </div>
      {/* MUSICAL CONTROLS */}
      <div className={cx(styles.toolbarSection, styles.musicalControls)}>
        <CustomSelect
          value={scaleObj.tonic.toString(true)}
          options={TONICS}
          onChange={({ value }) => {
            dispatch({ type: PROJECT_ACTIONS.SET_TONIC, payload: value });
          }}
          title="Key Root"
          baseColor={isDarkMode && appColors.black}
        />
        <CustomSelect
          value={scaleObj.name}
          options={SCALES}
          onChange={({ value }) => {
            dispatch({ type: PROJECT_ACTIONS.SET_MODE, payload: value });
          }}
          title="Key Mode"
          baseColor={isDarkMode && appColors.black}
        />
      </div>

      {/* OTHER */}
      <div className={cx(styles.toolbarSection, styles.OtherControls)}>
        <div>
          <Popconfirm
            title="Clear Canvas? (cannot be undone)"
            placement="bottom"
            okText="Clear"
            cancelText="Cancel"
            okType="danger"
            onConfirm={clearProjectCanvas}
            icon={<QuestionCircleOutlined />}
          >
            <Button
              hasBorder
              color={grayLightest}
              // onClick={clearProjectCanvas}
            >
              Clear
            </Button>
          </Popconfirm>
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

export default ToolbarComponent;
