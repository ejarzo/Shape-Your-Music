import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { themeColors } from 'utils/color';
import styles from './styles.module.css';
import { SEND_CHANNELS } from 'utils/music';

import withProjectContext from 'components/Project/withProjectContext';
import ColorController from './ColorController';

const propTypes = {
  onInstChange: PropTypes.func.isRequired,
  onKnobChange: PropTypes.func.isRequired,
  knobVals: PropTypes.array.isRequired,
  selectedSynths: PropTypes.array.isRequired,
};

function ColorControllerPanel(props) {
  const { onInstChange, onKnobChange, knobVals, selectedSynths } = props;
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
                  color={themeColors[colorIndex]}
                  synthType={synthType}
                  receiveChannel={`${SEND_CHANNELS.FX_PREFIX}${colorIndex}`}
                  onInstChange={onInstChange(colorIndex)}
                  onKnobChange={onKnobChange(colorIndex)}
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

ColorControllerPanel.propTypes = propTypes;

export default withProjectContext(ColorControllerPanel);
