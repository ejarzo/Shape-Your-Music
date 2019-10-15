import React from 'react';
import CustomSelect from 'components/CustomSelect';
import PropTypes from 'prop-types';
import Knob from 'components/Knob';
import Button from 'components/Button';

import { getDarker } from 'utils/color';

import styles from './styles.module.css';
import { SYNTH_PRESETS, ALL_SYNTHS } from 'instrumentPresets';

const propTypes = {
  color: PropTypes.string.isRequired,
  synthType: PropTypes.string.isRequired,
  knobVals: PropTypes.array.isRequired,
  onKnobChange: PropTypes.func.isRequired,
  onInstChange: PropTypes.func.isRequired,
  onIncrementClick: PropTypes.func.isRequired,
};

function ColorControllerComponent(props) {
  const {
    synthType,
    color,
    onInstChange,
    onIncrementClick,
    knobVals,
    onKnobChange,
  } = props;

  const darkerColor = getDarker(color);
  const dropdownOptions = ALL_SYNTHS;
  const { dynamicParams } = SYNTH_PRESETS[synthType];

  return (
    <div
      className={styles.colorController}
      style={{ backgroundColor: darkerColor }}
    >
      <div className={styles.titleBar} style={{ backgroundColor: darkerColor }}>
        <CustomSelect
          menuTop
          dropDownAlign="BottomLeft"
          color={props.color}
          name="Instrument Select"
          value={synthType}
          options={dropdownOptions}
          onChange={onInstChange}
        />
        <Button color={color} onClick={onIncrementClick(-1)}>
          <i className="ion-chevron-left" />
        </Button>
        <Button color={color} onClick={onIncrementClick(1)}>
          <i className="ion-chevron-right" />
        </Button>
      </div>

      <div className={styles.knobsContainer} style={{ backgroundColor: color }}>
        {dynamicParams.map(({ name }, i) => (
          <div key={`${color}-knob-${name}`}>
            <Knob
              paramName={name}
              value={knobVals[i]}
              onChange={onKnobChange(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

ColorControllerComponent.propTypes = propTypes;

export default ColorControllerComponent;
