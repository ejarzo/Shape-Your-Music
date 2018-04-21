import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorController from './ColorController';
import cx from 'classnames';
// import InstColorController from 'components/Project/InstColorController';
// import Utils from 'utils/Utils';

import styles from './styles.css';

const propTypes = {
  instrumentPresets: PropTypes.array.isRequired,
  selectedInstruments: PropTypes.array.isRequired,
  colorsList: PropTypes.array.isRequired,
  instNamesList: PropTypes.array.isRequired,
  knobVals: PropTypes.array.isRequired,
  onInstChange: PropTypes.func.isRequired,
  onKnobChange: PropTypes.func.isRequired,
};


class ColorControllerPanel extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isCollapsed: false,
    };
    this.handleToggleCollapseClick = this.handleToggleCollapseClick.bind(this);
  }

  handleToggleCollapseClick () {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render () {
    const {
      colorsList,
      instNamesList,
      onInstChange,
      onKnobChange,
      knobVals,
      instrumentPresets,
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
            {colorsList.map((color, colorIndex) => {
              const selectedInstrumentIndex = selectedInstruments[colorIndex];
              return (
                <div
                  className={styles.colorControllerContainer}
                  key={`colorController-${colorIndex}`}
                >
                  <ColorController
                    color={colorsList[colorIndex]}
                    instNamesList={instNamesList}
                    onInstChange={onInstChange(colorIndex)}
                    onKnobChange={onKnobChange(colorIndex)}
                    knobVals={knobVals[colorIndex]}
                    synthParams={instrumentPresets[selectedInstrumentIndex]}
                  />
                </div>
              
                /*<InstColorController 
                  key={`colorController-${colorIndex}`}
                  colorIndex={colorIndex}
                  colorsList={colorsList}
                  instNamesList={instNamesList}
                  onInstChange={onInstChange(colorIndex)}
                  onKnobChange={onKnobChange(colorIndex)}
                  knobVals={knobVals[colorIndex]}
                  synthParams={instrumentPresets[selectedInstrumentIndex]}
                />*/
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

ColorControllerPanel.propTypes = propTypes;

export default ColorControllerPanel;
