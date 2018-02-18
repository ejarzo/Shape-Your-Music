import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-rangeslider';
// import RangeSlider from '../RangeSlider';

const propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  colorsList: PropTypes.array.isRequired,
  colorIndex: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  
  isMuted: PropTypes.bool.isRequired,
  isSoloed: PropTypes.bool.isRequired,
  
  closePortal: PropTypes.func.isRequired,
  
  onColorChange: PropTypes.func.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  onMuteChange: PropTypes.func.isRequired,
  onSoloChange: PropTypes.func.isRequired,
  onQuantizeFactorChange: PropTypes.func.isRequired,
  
  onQuantizeClick: PropTypes.func.isRequired,
  onToTopClick: PropTypes.func.isRequired,
  onToBottomClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  
  perimeter: PropTypes.number.isRequired,
};

/*
  Shape Editor Panel: appears when a shape is clicked on.
  Used to adjust/mix the shape
*/
class ShapeEditorPanel extends Component {
  constructor (props) {
    super(props);

    const width = 225;
    const height = 260;
    const xPad = 23;
    const yPad = 33;

    let x = this.props.position.x;
    let y = this.props.position.y + yPad;

    let arrowTop = 40;
    
    let isLeft = true;

    if (x + width + xPad > window.innerWidth) {
      // editor shows to the left of the mouse
      // arrow on right
      isLeft = false;
      x = x - width - xPad;
    } else {
      // editor shows on right of mosue
      // arrow on left
      x = x + xPad;
    }
    
    if (y + height > window.innerHeight) {
      y = window.innerHeight - height - 15;
      arrowTop = this.props.position.y - y + 70;
      if (arrowTop > height - 20) {
        arrowTop = height - 20;
      }
    }

    this.divStyle = {
      width: width,
      height: height,
      left: x,
      top: y
    };

    this.arrowStyle = {
      top: arrowTop
    };

    this.state = {
      editorArrowIsLeft: isLeft
    };


    this.handleOverlayClick = this.handleOverlayClick.bind(this);
  }

  handleOverlayClick () {
    this.props.closePortal();
  }

  render () {
    const editorArrowClass = this.state.editorArrowIsLeft ? 'arrow-left' : 'arrow-right';
    return(    
      <div className="shape-editor-panel" style={this.divStyle}>
        <div className="row section">
          <div className="col col-12">
            <div className="shape-color-picker">
              {this.props.colorsList.map((color, i) => {
                const isSelected = i === this.props.colorIndex;
                const style = {
                  backgroundColor: color,
                  opacity: isSelected ? 1 : 0.3,
                };
                return (
                  <div 
                    key={i}
                    className="shape-color-option" 
                    style={style}
                    onClick={this.props.onColorChange(i)}>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col col-4 slider-container">
            <Slider
              className={'color-'+ this.props.colorIndex}
              orientation='vertical'
              min={-18}
              max={0}
              value={this.props.volume}
              onChange={this.props.onVolumeChange}
            />
           {/* <RangeSlider
              className={'color-'+ this.props.colorIndex}
              orientation='vertical'
              min={-18}
              max={0}
              value={this.props.volume}
              onChange={this.props.onVolumeChange}
            />*/}
          </div>
          
          {/* MUTE and SOLO */}
          <div className="col col-8">
            
            <div className="col col-6">
              <input 
                id="mute" 
                type="checkbox" 
                checked={this.props.isMuted} 
                onChange={this.props.onMuteChange}
              />
              <label className="checkbox-label" htmlFor="mute">Mute</label>
            </div>
            <div className="col col-6">
              <input 
                id="solo" 
                type="checkbox" 
                checked={this.props.isSoloed} 
                onChange={this.props.onSoloChange}
              />
              <label className="checkbox-label" htmlFor="solo">Solo</label>
            </div>

            <div className="col col-12">
              <button onClick={this.props.onQuantizeClick}>Quantize</button>
            </div> 
            <div className="col col-6">
              <button
                onClick={this.props.onQuantizeFactorChange(2)}>
                {'*2'}
              </button>
            </div>
            <div className="col col-6">
              <button
                onClick={this.props.onQuantizeFactorChange(0.5)}>
                {'/2'}
              </button>
            </div>
          </div>
        </div>

        <div className="row section">   
          <div className="col col-6">
            <button onClick={this.props.onToTopClick}>To Front</button>
          </div>
          <div className="col col-6">
            <button onClick={this.props.onToBottomClick}>To Back</button>
          </div>
          <div className="col col-12">
            <button onClick={this.props.onDeleteClick}>
              Delete
            </button>
          </div>
        </div>
        <div className="row section">   
          <span>
            Perimeter: {this.props.perimeter}
          </span>
        </div>
        <div className={'tooltip-arrow ' + editorArrowClass} style={this.arrowStyle}></div>
      </div>
    );
  }
}

ShapeEditorPanel.propTypes = propTypes;

export default ShapeEditorPanel;
