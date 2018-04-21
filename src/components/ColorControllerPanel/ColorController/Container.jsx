import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorControllerComponent from './Component';

const propTypes = {
  color: PropTypes.string.isRequired,
  instNamesList: PropTypes.array.isRequired,
  knobVals: PropTypes.array.isRequired,
  synthParams: PropTypes.object.isRequired,
  onInstChange: PropTypes.func.isRequired,
  onKnobChange: PropTypes.func.isRequired,
};


class ColorController extends Component {
  constructor (props) {
    super(props);
    this.handleInstChange = this.handleInstChange.bind(this);
    this.handleIncrementClick = this.handleIncrementClick.bind(this);
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
