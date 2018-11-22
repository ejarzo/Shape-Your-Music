import React from 'react';
import ControlsComponent from './Component';

class ControlsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isColorPickerOpen: false,
    };

    this.handleColorMouseEnter = this.handleColorMouseEnter.bind(this);
    this.handleColorMouseLeave = this.handleColorMouseLeave.bind(this);
  }

  handleColorMouseEnter() {
    this.timeout && window.clearTimeout(this.timeout);
    this.setState({
      isColorPickerOpen: true,
    });
  }

  handleColorMouseLeave() {
    this.timeout = setTimeout(() => {
      this.setState({
        isColorPickerOpen: false,
      });
    }, 100);
  }

  render() {
    return (
      <ControlsComponent
        handleColorMouseEnter={this.handleColorMouseEnter}
        handleColorMouseLeave={this.handleColorMouseLeave}
        isColorPickerOpen={this.state.isColorPickerOpen}
        {...this.props}
      />
    );
  }
}

export default ControlsContainer;
