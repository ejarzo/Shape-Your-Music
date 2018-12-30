import React from 'react';
import { bool, func } from 'prop-types';
import cx from 'classnames';

import Button from 'components/Button';
import IconButton from 'components/IconButton';
import CustomSelect from 'components/CustomSelect';
import TempoInput from 'components/TempoInput';

import { appColors } from 'utils/color';

import styles from './styles.module.css';

import { ProjectContext } from 'views/Project/Container';
import { SCALES, TONICS } from 'utils/music';

import TransportControls from './TransportControls';
import ToolSelect from './ToolSelect';
import CanvasControls from './CanvasControls';

const { grayLightest } = appColors;

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
};

function ToolbarComponent(props) {
  const {
    isColorPickerOpen,
    handlePlayClick,
    handleRecordClick,
    handleDrawToolClick,
    handleEditToolClick,
    handleColorChange,
    handleColorMouseEnter,
    handleColorMouseLeave,
    handleGridToggleChange,
    handleSnapToGridToggleChange,
    handleAutoQuantizeChange,
    handleTempoChange,
    handleTonicChange,
    handleScaleChange,
    handleFullscreenButtonClick,
    handleClearButtonClick,
  } = props;

  return (
    <ProjectContext.Consumer>
      {project => {
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
        } = project;

        const fullscreenButtonClass = isFullscreenEnabled
          ? 'ion-arrow-shrink'
          : 'ion-arrow-expand';

        return (
          <div className={styles.toolbar}>
            <TransportControls
              isPlaying={isPlaying}
              isRecording={isRecording}
              isArmed={isArmed}
              handlePlayClick={handlePlayClick}
              handleRecordClick={handleRecordClick}
            />

            <ToolSelect
              handleDrawToolClick={handleDrawToolClick}
              activeTool={activeTool}
              handleEditToolClick={handleEditToolClick}
              activeColorIndex={activeColorIndex}
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

            {/* ------- MUSICAL ------- */}
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
            {/* ------- OTHER ------- */}
            <div className={cx(styles.toolbarSection, styles.OtherControls)}>
              <div>
                <Button
                  hasBorder
                  darkHover
                  color={grayLightest}
                  onClick={handleClearButtonClick}
                  title="Clear all shapes (CANNOT UNDO)"
                >
                  Clear
                </Button>
              </div>
              <div>
                <IconButton
                  iconClassName={fullscreenButtonClass}
                  onClick={handleFullscreenButtonClick}
                  title="Toggle Fullscreen"
                />
              </div>
            </div>
          </div>
        );
      }}
    </ProjectContext.Consumer>
  );
}

ToolbarComponent.propTypes = propTypes;

export default ToolbarComponent;
