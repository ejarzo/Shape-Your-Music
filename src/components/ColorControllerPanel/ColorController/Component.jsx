import React from 'react';
import CustomSelect from 'components/CustomSelect';
import PropTypes from 'prop-types';
import Knob from 'components/Knob';
import Button from 'components/Button';

import { getDarker } from 'utils/color';

import styles from './styles.module.css';
import PRESETS from 'presets';

const propTypes = {
  color: PropTypes.string.isRequired,
  synthParams: PropTypes.shape({
    name: PropTypes.string.isRequired,
    baseSynth: PropTypes.func.isRequired,
    dynamicParams: PropTypes.array.isRequired,
    effects: PropTypes.array,
  }).isRequired,
  knobVals: PropTypes.array.isRequired,
  onKnobChange: PropTypes.func.isRequired,
  onInstChange: PropTypes.func.isRequired,
  onIncrementClick: PropTypes.func.isRequired,
};

function ColorControllerComponent(props) {
  const darkerColor = getDarker(props.color);
  const dropdownOptions = PRESETS.map(({ name }) => ({
    label: name,
    value: name,
  }));
  const synthName = props.synthParams.name;
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
          value={synthName}
          options={dropdownOptions}
          onChange={props.onInstChange}
          synthParams={props.synthParams}
        />
        <Button color={props.color} onClick={props.onIncrementClick(-1)}>
          <i className="ion-chevron-left" />
        </Button>
        <Button color={props.color} onClick={props.onIncrementClick(1)}>
          <i className="ion-chevron-right" />
        </Button>
      </div>
      <div
        className={styles.knobsContainer}
        style={{ backgroundColor: props.color }}
      >
        {props.synthParams.dynamicParams.map((effect, i) => (
          <div key={`${props.color}-knob-${i}`}>
            <Knob
              paramName={effect.name}
              value={props.knobVals[i]}
              onChange={props.onKnobChange(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

ColorControllerComponent.propTypes = propTypes;

export default ColorControllerComponent;
