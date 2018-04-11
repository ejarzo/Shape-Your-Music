import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import Color from 'color';
import Tone from 'tone';

import Knob from 'components/Knob';

import InstColorControllerComponent from './Component';

const propTypes = {
  colorIndex: PropTypes.number.isRequired,
  colorsList: PropTypes.array.isRequired,
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
};

class InstColorController extends Component {
  constructor (props) {
    super(props);
    
    this.fxList = [];
    
    this.fxBus = new Tone.Gain(0.8);
    this.fxBus.receive(`colorFx-${this.props.colorIndex}`);
    this.output = new Tone.Gain(1);
    this.output.send('masterOutput', 0);

    // console.log('inst color controller constructor');
    // console.log('param effects', props.synthParams.effects);
    // console.log('knob vals', props.knobVals);

    this.connectEffects(props.synthParams.effects);
    //this.setDefaults(props.synthParams.dynamicParams);

    this.handleInstChange = this.handleInstChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    console.log('cwrp... knob vals', nextProps.knobVals);
    // this.setDefaults(nextProps.synthParams.dynamicParams);
    if (nextProps.synthParams.name.value !== this.props.synthParams.name.value) {
      this.connectEffects(nextProps.synthParams.effects);
      this.setDefaults(nextProps.synthParams.dynamicParams);
    }
  }
  
  setDefaults (dynamicParams) {
    dynamicParams.forEach((param, i) => {
      this.props.onKnobChange(i, param.default);
    });
  }

  setEffectAmount (effectIndex, val, parameter) {
    this.fxList[effectIndex].set(parameter, val);
  }

  connectEffects (fxConstructors) {
    this.fxBus.disconnect();
    if (this.fxList) {
      this.fxList.forEach((effect) => {
        effect.dispose();
      });
      this.fxList = [];
    }

    fxConstructors.forEach((fxObj) => {
      // console.log('adding effect', fxObj.type);
      const newEffect = new fxObj.type(fxObj.params);
      this.fxList.push(newEffect);
    });

    // TODO
    if (this.fxList.length === 2) {
      this.fxBus.chain(this.fxList[0], this.fxList[1], this.output);
    } else if (this.fxList.length === 1) {
      this.fxBus.chain(this.fxList[0], this.output);
    } else {
      this.fxBus.chain(this.output);
    }

  }

  handleInstChange (val) {
    if (val) {
      this.props.onInstChange(val.value);
    }
  }

  handleParamValueChange (i) {
    console.log('handle param value change called');
    const synthParams = this.props.synthParams;
    return (val) => {
      this.props.onKnobChange(i, val);
      if (synthParams.dynamicParams[i].target === 'effect') {
        synthParams.dynamicParams[i].func(this, val);
      }
    };
  }

  render () {
    const color = this.props.colorsList[this.props.colorIndex];
    const titleBackgroundColor = color;
    const contentBackgroundColor = Color(color).lighten(0.1);
    return (
      <li className="inst-option">
        <div className="inst-title" style={{backgroundColor: titleBackgroundColor}}>
          <div style={{width: '50%', backgroundColor: Color(color).darken(0.1)}}>
            <Select
              optionRenderer={option => (
                <div style={{backgroundColor: titleBackgroundColor}}>
                  {option.label}
                </div>
              )}
              menuStyle={{
                background: titleBackgroundColor
              }}
              className="inst-select"
              searchable={true}
              clearable={false}
              name="Instrument Select"
              value={this.props.synthParams.name.value}
              options={this.props.instNamesList}
              onChange={this.handleInstChange}
            />
            {/*<button className="show-hide show-hide-inst" data-target="inst-selectors" title="Show/Hide synth controls">
              <i className="ion-arrow-left-b"></i>
            </button>*/}
          </div>
        </div>
        <ul
          className="inst-params"
          style={{
            backgroundColor: contentBackgroundColor
          }}
        >
          {this.props.synthParams.dynamicParams.map((effect, i) => (
            <li key={i}>
              <Knob
                paramName={effect.name}
                value={this.props.knobVals[i]}
                onChange={this.handleParamValueChange(i)}
              />
            </li>
          ))}
        </ul>
      </li>
    );
  }
}

InstColorController.propTypes = propTypes;

export default InstColorController;
