import React from 'react';
import { bool, func, number, string } from 'prop-types';
import cx from 'classnames';

import Button from 'components/Button';
import ColorPicker from 'components/ColorPicker';
import DrawToolIcon from 'components/icons/DrawTool';
import EditToolIcon from 'components/icons/EditTool';
import { themeColors, appColors } from 'utils/color';

import { TOOL_TYPES } from 'views/Project/Container';
import styles from './styles.module.css';

const { black, grayLightest } = appColors;

/* ---------------------- Tool Select ---------------------- */

function ToolSelect(props) {
  const isDrawTool = props.activeTool === TOOL_TYPES.DRAW;
  const isEditTool = props.activeTool === TOOL_TYPES.EDIT;
  const activeColor = themeColors[props.activeColorIndex];

  return (
    <div className={cx(styles.toolbarSection, styles.toolSelect)}>
      <div
        onMouseEnter={props.handleColorMouseEnter}
        onMouseLeave={props.handleColorMouseLeave}
        style={{ position: 'relative' }}
      >
        <Button hasBorder color={activeColor} />
        {props.isColorPickerOpen && (
          <div
            style={{
              width: 140,
              left: 0,
              top: 45,
              height: 50,
              position: 'absolute',
            }}
          >
            <ColorPicker
              color={themeColors[props.activeColorIndex]}
              onChange={props.onColorChange}
            />
          </div>
        )}
      </div>
      <Button
        darkHover
        hasBorder
        color={isDrawTool ? black : grayLightest}
        onClick={props.handleDrawToolClick}
        title="Draw Tool (TAB to toggle)"
      >
        <DrawToolIcon fill={isDrawTool ? grayLightest : black} />
      </Button>
      <Button
        darkHover
        hasBorder
        color={isEditTool ? black : grayLightest}
        onClick={props.handleEditToolClick}
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

export default ToolSelect;
