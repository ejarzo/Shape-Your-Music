import React from 'react';
import ControlsComponent from './Component';

class ControlsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isColorPickerOpen: false,
    };

    this.handleColorSelectClick = this.handleColorSelectClick.bind(this);
  }

  handleColorSelectClick() {
    this.setState({
      isColorPickerOpen: !this.state.isColorPickerOpen,
    });
  }

  render() {
    return (
      <ControlsComponent
        onColorSelectClick={this.handleColorSelectClick}
        isColorPickerOpen={this.state.isColorPickerOpen}
        {...this.props}
      />
    );
  }
}

export default ControlsContainer;
