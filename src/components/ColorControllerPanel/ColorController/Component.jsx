import React from 'react';
import CustomSelect from 'components/CustomSelect';
import PropTypes from 'prop-types';
import Knob from 'components/Knob';
import Button from 'components/Button';

import { getDarker } from 'utils/color';

import styles from './styles.module.css';
import { SYNTH_PRESETS, ALL_SYNTHS } from 'instrumentPresets';
import { PROJECT_ACTIONS } from 'utils/project';
import { useProjectContext } from 'context/useProjectContext';

const propTypes = {
  color: PropTypes.string.isRequired,
  synthType: PropTypes.string.isRequired,
  knobVals: PropTypes.array.isRequired,
};

function ColorControllerComponent(props) {
  const { synthType, color, knobVals, colorIndex } = props;
  const { dispatch } = useProjectContext();
  const darkerColor = getDarker(color);
  const dropdownOptions = ALL_SYNTHS;
  const { dynamicParams } = SYNTH_PRESETS[synthType];

  const incrementSynth = difference => () => {
    const numOptions = ALL_SYNTHS.length - 1;
    const currentIndex = ALL_SYNTHS.findIndex(
      ({ value }) => value === synthType
    );

    let nextVal = currentIndex + difference;

    if (nextVal > numOptions) nextVal = 0;
    if (nextVal < 0) nextVal = numOptions;
    dispatch({
      type: PROJECT_ACTIONS.SET_INSTRUMENT_FOR_COLOR,
      payload: {
        colorIndex,
        instrumentName: ALL_SYNTHS[nextVal].value,
      },
    });
  };

  return (
    <div
      className={styles.colorController}
      style={{ backgroundColor: darkerColor }}
    >
      <div className={styles.titleBar} style={{ backgroundColor: darkerColor }}>
        <CustomSelect
          menuTop
          dropDownAlign="BottomLeft"
          baseColor={props.color}
          name="Instrument Select"
          value={synthType}
          options={dropdownOptions}
          onChange={({ value }) => {
            dispatch({
              type: PROJECT_ACTIONS.SET_INSTRUMENT_FOR_COLOR,
              payload: {
                colorIndex,
                instrumentName: value,
              },
            });
          }}
        />
        <Button color={color} onClick={incrementSynth(-1)}>
          <i className="ion-chevron-left" />
        </Button>
        <Button color={color} onClick={incrementSynth(1)}>
          <i className="ion-chevron-right" />
        </Button>
      </div>

      <div className={styles.knobsContainer} style={{ backgroundColor: color }}>
        {dynamicParams.map(({ name }, i) => (
          <div key={`${color}-knob-${name}`}>
            <Knob
              paramName={name}
              value={knobVals[i]}
              onChange={val => {
                dispatch({
                  type: PROJECT_ACTIONS.SET_KNOB_VALUE_FOR_COLOR,
                  payload: { colorIndex, effectIndex: i, value: val },
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

ColorControllerComponent.propTypes = propTypes;

export default ColorControllerComponent;
