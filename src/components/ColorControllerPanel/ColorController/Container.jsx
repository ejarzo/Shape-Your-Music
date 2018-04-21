import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorControllerComponent from './Component';

// import Utils from 'utils/Utils';

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
  }

  handleInstChange (val) {
    if (val) {
      console.log(val);
      this.props.onInstChange(val.value);
    }
  }

  render () {
    return (
      <ColorControllerComponent
        color={this.props.color}
        instNamesList={this.props.instNamesList}
        synthParams={this.props.synthParams}
        onInstChange={this.handleInstChange}
      />
    );
  }
}

ColorController.propTypes = propTypes;

export default ColorController;
