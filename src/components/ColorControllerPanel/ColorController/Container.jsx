import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';
import ColorControllerComponent from './Component';

const propTypes = {
  color: PropTypes.string.isRequired,
  receiveChannel: PropTypes.string.isRequired,
  instNamesList: PropTypes.array.isRequired,
  knobVals: PropTypes.array.isRequired,
  synthParams: PropTypes.object.isRequired,
  onInstChange: PropTypes.func.isRequired,
  onKnobChange: PropTypes.func.isRequired,
};


class ColorController extends Component {
  constructor (props) {
    super(props);
    console.log(props);
    
    this.fxList = [];

    this.fxBus = new Tone.Gain(0.8);
    this.fxBus.receive(this.props.receiveChannel);
    this.output = new Tone.Gain(1);
    // this.fxBus.chain(this.output);
    this.output.send('masterOutput', 0);
    this.connectEffects(props.synthParams.effects);

    this.handleInstChange = this.handleInstChange.bind(this);
    this.handleIncrementClick = this.handleIncrementClick.bind(this);
  }

  knobIndexChanged(currVals, nextVals) {
    for (var i = 0; i < currVals.length; i++) {
      if (currVals[i] !== nextVals[i]) { return i; }
    }
    return -1;
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('knob vals:', nextProps.knobVals);

    const changedKnobIndex = this.knobIndexChanged(this.props.knobVals, nextProps.knobVals);

    if (nextProps.synthParams.name.value !== this.props.synthParams.name.value) {
      this.connectEffects(nextProps.synthParams.effects);
      this.setDefaults(nextProps.synthParams.dynamicParams);
    }

    if (changedKnobIndex >= 0) {
      nextProps.synthParams.dynamicParams[changedKnobIndex].func(nextProps.knobVals[changedKnobIndex])
    }
  }

  setEffectAmount (effectIndex, val, parameter) {
    this.fxList[effectIndex].set(parameter, val);
  }

  setDefaults (dynamicParams) {
    dynamicParams.forEach((param, i) => {
      this.props.onKnobChange(i, param.default);
    });
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

  handleInstChange (option) {
    if (option) {
      this.props.onInstChange(option.value);
    }
  }

  handleIncrementClick (difference) {
    return () => {
      const currentVal = this.props.synthParams.name.value;
      const numOptions = this.props.instNamesList.length - 1;
      let nextVal = currentVal + difference;
      if (nextVal > numOptions) { nextVal = 0; }
      if (nextVal < 0) { nextVal = numOptions; }

      this.props.onInstChange(nextVal);
    };
  }

  render () {
    return (
      <ColorControllerComponent
        {...this.props}
        onInstChange={this.handleInstChange}
        onIncrementClick={this.handleIncrementClick}
      />
    );
  }
}

ColorController.propTypes = propTypes;

export default ColorController;
