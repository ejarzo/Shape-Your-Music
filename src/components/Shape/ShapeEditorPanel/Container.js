import React, { Component } from 'react';

import ShapeEditorPanelComponent from './Component';

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
    const yPad = 20;

    let x = this.props.position.x;
    let y = this.props.position.y + yPad;

    let arrowTop = 40;
    let isLeft = true;

    if (x + width + xPad > window.innerWidth) {
      isLeft = false;
      x = x - width - xPad;
    } else {
      x = x + xPad;
    }

    // keep on screen
    if (y + height > window.innerHeight) {
      y = window.innerHeight - height - 15;
      arrowTop = this.props.position.y - y + 70;
      if (arrowTop > height - 20) {
        arrowTop = height - 20;
      }
    }

    this.state = {
      position: {
        left: x,
        top: y,
      },
      arrowPosition: {
        top: arrowTop,
        isLeft,
      }
    };
  }

  render () {
    return (
      <ShapeEditorPanelComponent
        {...this.props}
        position={this.state.position}
        arrowPosition={this.state.arrowPosition}
      />
    );

    // const editorArrowClass = this.state.editorArrowIsLeft ? 'arrow-left' : 'arrow-right';
    // return (
    //   <div className="shape-editor-panel" style={this.divStyle}>
        // <div className="row section">
        //   <div className="col col-12">
        //     <div className="shape-color-picker">
        //       {this.props.colorsList.map((color, i) => {
        //         const isSelected = i === this.props.colorIndex;
        //         const style = {
        //           backgroundColor: color,
        //           opacity: isSelected ? 1 : 0.3,
        //         };
        //         return (
        //           <div 
        //             key={i}
        //             className="shape-color-option" 
        //             style={style}
        //             onClick={this.props.onColorChange(i)}>
        //           </div>
        //         );
        //       })}
        //     </div>
        //   </div>

    //       <div className="col col-4 slider-container">
    //         <Slider
    //           className={'color-'+ this.props.colorIndex}
    //           orientation='vertical'
    //           min={-18}
    //           max={0}
    //           value={this.props.volume}
    //           onChange={this.props.onVolumeChange}
    //         />
    //        {/* <RangeSlider
    //           className={'color-'+ this.props.colorIndex}
    //           orientation='vertical'
    //           min={-18}
    //           max={0}
    //           value={this.props.volume}
    //           onChange={this.props.onVolumeChange}
    //         />*/}
    //       </div>
          
    //       {/* MUTE and SOLO */}
    //       <div className="col col-8">
            
    //         <div className="col col-6">
    //           <input 
    //             id="mute" 
    //             type="checkbox" 
    //             checked={this.props.isMuted} 
    //             onChange={this.props.onMuteChange}
    //           />
    //           <label className="checkbox-label" htmlFor="mute">Mute</label>
    //         </div>
    //         <div className="col col-6">
    //           <input 
    //             id="solo" 
    //             type="checkbox" 
    //             checked={this.props.isSoloed} 
    //             onChange={this.props.onSoloChange}
    //           />
    //           <label className="checkbox-label" htmlFor="solo">Solo</label>
    //         </div>

    //         <div className="col col-12">
    //           <button onClick={this.props.onQuantizeClick}>Quantize</button>
    //         </div> 
    //         <div className="col col-6">
    //           <button
    //             onClick={this.props.onQuantizeFactorChange(2)}>
    //             {'*2'}
    //           </button>
    //         </div>
    //         <div className="col col-6">
    //           <button
    //             onClick={this.props.onQuantizeFactorChange(0.5)}>
    //             {'/2'}
    //           </button>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="row section">   
    //       <div className="col col-6">
    //         <button onClick={this.props.onToTopClick}>To Front</button>
    //       </div>
    //       <div className="col col-6">
    //         <button onClick={this.props.onToBottomClick}>To Back</button>
    //       </div>
    //       <div className="col col-12">
    //         <button onClick={this.props.onDeleteClick}>
    //           Delete
    //         </button>
    //       </div>
    //     </div>
    //     <div className="row section">   
    //       <span>
    //         Perimeter: {this.props.perimeter}
    //       </span>
    //     </div>
    //     <div className={'tooltip-arrow ' + editorArrowClass} style={this.arrowStyle}></div>
    //   </div>
    // );
  }
}

export default ShapeEditorPanel;
