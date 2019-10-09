import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorController from './ColorController';
import cx from 'classnames';
import { themeColors } from 'utils/color';
import styles from './styles.module.css';
import { INSTRUMENT_PRESETS } from 'instrumentPresets';

import withProjectContext from 'views/Project/withProjectContext';

const propTypes = {
  onInstChange: PropTypes.func.isRequired,
  onKnobChange: PropTypes.func.isRequired,
  knobVals: PropTypes.array.isRequired,
  selectedInstruments: PropTypes.array.isRequired,
};

class ColorControllerPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false,
    };
    this.handleToggleCollapseClick = this.handleToggleCollapseClick.bind(this);
  }

  handleToggleCollapseClick() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    const {
      onInstChange,
      onKnobChange,
      knobVals,
      selectedInstruments,
    } = this.props;

    return (
      <div className={styles.wrapper}>
        <div
          className={cx({
            [styles.colorControllerPanel]: true,
            [styles.isCollapsed]: this.state.isCollapsed,
          })}
        >
          <div
            className={styles.toggleCollapseButton}
            onClick={this.handleToggleCollapseClick}
          />
          <div className={styles.colorControllers}>
            {themeColors.map((color, colorIndex) => {
              const selectedInstrumentIndex = selectedInstruments[colorIndex];
              return (
                <div
                  className={styles.colorControllerContainer}
                  key={`colorController-${colorIndex}`}
                >
                  <ColorController
                    color={themeColors[colorIndex]}
                    receiveChannel={`colorFx-${colorIndex}`}
                    onInstChange={onInstChange(colorIndex)}
                    onKnobChange={onKnobChange(colorIndex)}
                    knobVals={knobVals[colorIndex]}
                    synthParams={INSTRUMENT_PRESETS[selectedInstrumentIndex]}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

ColorControllerPanel.propTypes = propTypes;

export default withProjectContext(ColorControllerPanel);
