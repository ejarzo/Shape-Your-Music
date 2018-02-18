import React, { Component } from 'react';
import Draggable from 'react-draggable';

import Utils from '../../utils/Utils.js';

class Knob extends Component {
    constructor (props) {
        super(props);

        this.color = '#fff';
        this.knobRadius = 15;
        this.knobStrokeWidth = 6;
        this.topArcStrokeWidth = 2;
        this.topArcRadius = this.knobRadius + this.topArcStrokeWidth + 1;
        this.startAngle = -137;
        this.endAngle = 137;

        this.dragStart = {
            x: 0,
            y: 0
        }

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    handleDragStart (e) {
        this.dragStart = {
            x: e.clientX,
            y: e.clientY,
            value: this.props.value
        }
    };

    handleDrag (e) {
        // TODO add horizontal drag
        // console.log(e.movementX, e.movementY);

        let xDiff = (e.clientX - this.dragStart.x);
        let yDiff = (e.clientY - this.dragStart.y) * -1;

        console.log("drag", xDiff, yDiff);
        
        let newVal = this.dragStart.value + yDiff;
    
        if (newVal > 100) {
            newVal = 100;
        }
        if (newVal < 0) {
            newVal = 0
        }
        
        this.props.onChange(newVal);
    };    
    
    render () {
        const svgStyle = {
            height: 2 * (this.knobRadius + this.knobStrokeWidth),
            width: 2 * (this.knobRadius + this.knobStrokeWidth),
        }
        return (
            <div>   
                <div className="knob-container" tabIndex="0">
                    <Draggable
                        axis="both"
                        position={{x:0, y:0}}
                        bounds={{left: 0, top: 0, right: 0, bottom: 0}}
                        onStart={this.handleDragStart}
                        onDrag={this.handleDrag}
                        onStop={this.handleDragStop}>
                        <svg style={svgStyle} className="expand-on-hover">
                            
                            {/* background static arc */}
                            <path 
                                fill="none"
                                stroke={this.color}
                                strokeWidth={this.topArcStrokeWidth}
                                d={Utils.describeArc(
                                    this.knobRadius + this.knobStrokeWidth, 
                                    this.knobRadius + this.knobStrokeWidth, 
                                    this.topArcRadius, 
                                    this.startAngle, 
                                    this.endAngle)}
                            />

                            {/* dynamic arc */}
                            <path 
                                fill="none"
                                stroke={this.color}
                                strokeWidth={this.knobStrokeWidth}
                                d={Utils.describeArc(
                                    this.knobRadius + this.knobStrokeWidth, 
                                    this.knobRadius + this.knobStrokeWidth, 
                                    this.knobRadius, 
                                    this.startAngle, 
                                    Utils.convertValToRange(this.props.value, 0, 100, this.startAngle, this.endAngle))}
                            />
                        </svg>
                     </Draggable>
                </div>
                <span className="inst-param-title">{this.props.paramName}</span>
            </div>
        );
    }
}

export default Knob;
