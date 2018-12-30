import React from 'react';
import { bool, func } from 'prop-types';
import cx from 'classnames';

import CheckboxButton from 'components/CheckboxButton';
import { appColors, getDarker } from 'utils/color';

import styles from './styles.module.css';

const { grayLightest } = appColors;

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

export default CanvasControls;
