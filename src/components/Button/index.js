import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Color from 'color';
import Radium from 'radium';

const propTypes = {
  color: PropTypes.string,
  children: PropTypes.array,
};

class Button extends Component {
  constructor (props) {
    super(props);

    this.baseColor = props.color || '#ddd';
    this.state = {
      backgroundColorObj: Color(this.baseColor),
    };
  }


  render () {
    return (
      <button
        {...this.props}
        style={{
          backgroundColor: this.state.backgroundColorObj.toString(),
          ':hover': {
            backgroundColor: this.state.backgroundColorObj.lighten(0.1)
          },
          ':active': {
            backgroundColor: this.state.backgroundColorObj.darken(0.1)
          }
        }}
      >
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = propTypes;

export default Radium(Button);
