import React, { useState } from 'react';
import cx from 'classnames';
import { themeColors } from 'utils/color';
import styles from './styles.module.css';
import { SEND_CHANNELS } from 'utils/music';

import ColorController from './ColorController';
import { useProjectContext } from 'context/useProjectContext';

function ColorControllerPanel() {
  const { knobVals, selectedSynths } = useProjectContext();
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div
        className={cx({
          [styles.colorControllerPanel]: true,
          [styles.isCollapsed]: isCollapsed,
        })}
      >
        <div
          className={styles.toggleCollapseButton}
          onClick={() => setCollapsed(!isCollapsed)}
        />
        <div className={styles.colorControllers}>
          {themeColors.map((color, colorIndex) => {
            const synthType = selectedSynths[colorIndex];
            return (
              <div
                className={styles.colorControllerContainer}
                key={`colorController-${colorIndex}`}
              >
                <ColorController
                  colorIndex={colorIndex}
                  // TODO: Compute these in ColorController component
                  color={themeColors[colorIndex]}
                  synthType={synthType}
                  receiveChannel={`${SEND_CHANNELS.FX_PREFIX}${colorIndex}`}
                  knobVals={knobVals[colorIndex]}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ColorControllerPanel;
