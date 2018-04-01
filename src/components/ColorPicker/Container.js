import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onColorChange: PropTypes.func.isRequired,
  colorsList: PropTypes.array.isRequired,
  activeColorIndex: PropTypes.number.isRequired,
};

/*
  A dropdown used to select the draw color.
*/
class ColorPickerContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.handleColorPickerClick = this.handleColorPickerClick.bind(this);
  }

  handleColorChange (colorIndex) {
    return () => {
      this.props.onColorChange(colorIndex);
    };
  }

  handleColorPickerClick () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  close () {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      });
    }
  }

  render () {
    const colorPickercContent = this.state.isOpen && (
      <div className="project-color-picker-options">
        {this.props.colorsList.map((color, i) => {
          const style = { backgroundColor: color };  
          return i === this.props.activeColorIndex ? null : (
            <div 
              key={i}
              index={i}
              className="color-option" 
              style={style}
              onClick={this.props.onColorChange(i)}
            >
            </div>);
        })}
      </div>
    );
    
    return (
      <div
        title="Select Draw Color (Numbers 1-5)" 
        className="project-color-picker"
        onClick={this.handleColorPickerClick}>
        <div 
          className="color-picker-button"
          style={{
            backgroundColor: this.props.colorsList[this.props.activeColorIndex]
          }}>
        </div>
        {colorPickercContent}
      </div>
    );
  }
}

ColorPickerContainer.propTypes = propTypes;

export default ColorPickerContainer;
