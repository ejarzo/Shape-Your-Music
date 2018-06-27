import React from 'react';
import CustomSelect from 'components/CustomSelect';
import PropTypes from 'prop-types';
import Knob from 'components/Knob';
import Button from 'components/Button';

import { ColorUtils } from 'utils/Utils';

import styles from './styles.module.css';

const propTypes = {
  color: PropTypes.string.isRequired,
  instNamesList: PropTypes.array.isRequired,
  synthParams: PropTypes.shape({
    name: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
    baseSynth: PropTypes.func.isRequired,
    dynamicParams: PropTypes.array.isRequired,
    effects: PropTypes.array,
  }).isRequired,
  knobVals: PropTypes.array.isRequired,
  onKnobChange: PropTypes.func.isRequired,
  onInstChange: PropTypes.func.isRequired,
  onIncrementClick: PropTypes.func.isRequired,
};

function ColorControllerComponent (props) {
  const darkerColor = ColorUtils.getDarker(props.color);
  return (
    <div
      className={styles.colorController}
      style={{ backgroundColor: darkerColor }}
    >
      <div
        className={styles.titleBar}
        style={{ backgroundColor: darkerColor }}
      >
        <CustomSelect
          menuTop
          dropDownAlign="BottomLeft"
          color={props.color}
          name="Instrument Select"
          value={props.synthParams.name.value.toString()}
          options={props.instNamesList}
          onChange={props.onInstChange}
          synthParams={props.synthParams}
          instNamesList={props.instNamesList}
        />
        <Button 
          color={props.color}
          onClick={props.onIncrementClick(-1)}
        >
          <i className="ion-chevron-left" />
        </Button>
        <Button 
          color={props.color}
          onClick={props.onIncrementClick(1)}
        >
          <i className="ion-chevron-right" />
        </Button>
      </div>
      <div
        className={styles.knobsContainer}
        style={{ backgroundColor: props.color }}
      >
        {props.synthParams.dynamicParams.map((effect, i) => (
          <div key={`${props.color}-knob-${i}`} >
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
