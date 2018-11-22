import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Color from 'color';
import Tone from 'tone';
import { themeColors, appColors } from 'utils/color';

import { convertValToRange, isEquivalent, dist } from 'utils/math';
import {
  getAngle,
  thetaToScaleDegree,
  getPerimeterLength,
  getAveragePoint,
  forEachPoint,
} from 'utils/shape';

import InstrumentPresets from 'presets';
import ShapeComponent from './Component';

const propTypes = {
  index: PropTypes.number.isRequired,
  colorIndex: PropTypes.number.isRequired,
  points: PropTypes.array.isRequired,
  isSelected: PropTypes.bool.isRequired,
  soloedShapeIndex: PropTypes.number.isRequired,

  isPlaying: PropTypes.bool.isRequired,
  selectedInstruments: PropTypes.array.isRequired,
  knobVals: PropTypes.array.isRequired,

  isAutoQuantizeActive: PropTypes.bool.isRequired,
  activeTool: PropTypes.string.isRequired,
  tempo: PropTypes.number.isRequired,
  scaleObj: PropTypes.object.isRequired,

  snapToGrid: PropTypes.func.isRequired,

  onShapeClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSoloChange: PropTypes.func.isRequired,
};

class ShapeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      points: props.points,
      colorIndex: props.colorIndex,

      volume: -5,
      isMuted: false,
      quantizeFactor: 1,

      averagePoint: { x: 0, y: 0 },
      firstNoteIndex: 1,
      noteIndexModifier: 0,

      isHoveredOver: false,
      isDragging: false,
      editorX: 0,
      editorY: 0,

      animCircleX: 0,
      animCircleY: 0,
    };
    this.quantizeLength = 500;

    // shape attribute changes
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleMuteChange = this.handleMuteChange.bind(this);

    // shape events
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.dragBoundFunc = this.dragBoundFunc.bind(this);

    // vertices
    this.handleVertexDragMove = this.handleVertexDragMove.bind(this);

    // perimeter
    this.getPointsForFixedPerimeterLength = this.getPointsForFixedPerimeterLength.bind(
      this
    );

    // shape editor handlers
    this.handleDelete = this.handleDelete.bind(this);
    this.handleQuantizeClick = this.handleQuantizeClick.bind(this);
    this.handleQuantizeFactorChange = this.handleQuantizeFactorChange.bind(
      this
    );
    this.handleToTopClick = this.handleToTopClick.bind(this);
    this.handleToBottomClick = this.handleToBottomClick.bind(this);
  }

  componentWillMount() {
    this.setSynth(this.props, this.state.colorIndex);
    this.part = this.getPart();

    // TODO ugly
    if (this.props.isAutoQuantizeActive) {
      const newPoints = this.getPointsForFixedPerimeterLength(
        this.state.points,
        this.quantizeLength * this.state.quantizeFactor
      );
      this.setNoteEvents(this.props.scaleObj, newPoints);
      this.setState({
        points: newPoints,
      });
    } else {
      this.setNoteEvents(this.props.scaleObj, this.state.points);
    }
  }

  componentDidMount() {
    this.handleDrag();
  }

  componentWillUnmount() {
    // this.shapeElement.destroy();
    this.part.dispose();
    this.synth.dispose();
  }

  componentWillUpdate(nextProps, nextState) {
    /* change instrument when color's instrument changes, or when shape's color changes */
    if (
      nextProps.selectedInstruments[nextState.colorIndex] !==
        this.props.selectedInstruments[nextState.colorIndex] ||
      nextState.colorIndex !== this.state.colorIndex
    ) {
      this.setSynth(nextProps, nextState.colorIndex);
    }
  }

  componentWillReceiveProps(nextProps) {
    /* remove hover styles when switching to draw mode */
    if (nextProps.activeTool === 'draw' && this.props.activeTool === 'edit') {
      this.setState({
        isHoveredOver: false,
      });
    }

    /* set to fixed perimeter */
    if (
      nextProps.isAutoQuantizeActive &&
      nextProps.isAutoQuantizeActive !== this.props.isAutoQuantizeActive
    ) {
      const newPoints = this.getPointsForFixedPerimeterLength(
        this.state.points,
        this.quantizeLength * this.state.quantizeFactor
      );
      this.setNoteEvents(nextProps.scaleObj, newPoints);
      this.setState({
        points: newPoints,
      });
    }

    /* update note events if new scale or new tonic */
    if (
      this.props.scaleObj.name !== nextProps.scaleObj.name ||
      this.props.scaleObj.tonic.toString() !==
        nextProps.scaleObj.tonic.toString()
    ) {
      this.setNoteEvents(nextProps.scaleObj, this.state.points);
    }

    /* on tempo update */
    if (this.props.tempo !== nextProps.tempo) {
      this.part.playbackRate = nextProps.tempo / 50;
    }

    /* update effect values (knobs) */
    nextProps.knobVals[this.state.colorIndex].forEach((val, i) => {
      // TODO
      if (this.props.knobVals[this.state.colorIndex][i] !== val) {
        this.setEffectVal(val, i);
      }
    });

    /* on solo update */
    if (this.props.soloedShapeIndex !== nextProps.soloedShapeIndex) {
      const isSoloed = nextProps.soloedShapeIndex === nextProps.index;
      this.solo.solo = isSoloed;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      isEquivalent(this.props, nextProps) && isEquivalent(this.state, nextState)
    );
  }

  /* ================================ AUDIO =============================== */

  getPart() {
    const part = new Tone.Part((time, val) => {
      //console.log("Playing note", val.note, "for", val.duration, "INDEX:", val.pIndex);
      const dur = val.duration / this.part.playbackRate;

      // animation
      Tone.Draw.schedule(() => {
        const xFrom = this.state.points[val.pIndex - 2];
        const yFrom = this.state.points[val.pIndex - 1];
        const xTo =
          val.pIndex >= this.state.points.length
            ? this.state.points[0]
            : this.state.points[val.pIndex];
        const yTo =
          val.pIndex >= this.state.points.length
            ? this.state.points[1]
            : this.state.points[val.pIndex + 1];

        const animCircle = this.shapeComponentElement.getAnimCircle();
        const shapeElement = this.shapeComponentElement.getShapeElement();
        if (animCircle) {
          // TODO smooth animations...

          const shapeFill = this.getFillColor();
          shapeElement.setAttrs({
            fill: appColors.white,
          });
          shapeElement.to({
            fill: shapeFill,
            duration: 0.2,
          });

          animCircle.setAttrs({
            x: xFrom,
            y: yFrom,
            fill: appColors.white,
            radius: 8,
          });
          animCircle.to({
            x: xTo,
            y: yTo,
            duration: dur,
          });
          animCircle.to({
            radius: 5,
            fill: themeColors[this.state.colorIndex],
            duration: 0.3,
          });
        }
      }, time);

      const noteIndex = val.noteIndex + this.state.noteIndexModifier;
      const noteString = this.props.scaleObj.get(noteIndex).toString();

      // trigger synth
      this.synth.triggerAttackRelease(noteString, dur, time);
    }, []).start(0);

    part.loop = true;
    part.playbackRate = this.props.tempo / 50;

    return part;
  }

  getNoteInfo(points, scaleObj, i, iPrev, iPrevPrev, prevNoteIndex) {
    const tempoModifier = 200;

    const p = {
      x: points[i],
      y: points[i + 1],
    };
    const prev = {
      x: points[iPrev],
      y: points[iPrev + 1],
    };
    const prevPrev = {
      x: points[iPrevPrev],
      y: points[iPrevPrev + 1],
    };

    const edgeLength = dist(p.x, p.y, prev.x, prev.y) / tempoModifier;
    const theta = getAngle(p, prev, prevPrev);
    const degreeDiff = thetaToScaleDegree(theta, scaleObj);

    const noteIndex = prevNoteIndex + degreeDiff;

    return {
      duration: edgeLength,
      noteIndex: noteIndex,
      pIndex: i === 0 ? points.length : i,
    };
  }

  setSynth(props, colorIndex) {
    const selectedInstrumentIndex = props.selectedInstruments[colorIndex];
    const knobVals = props.knobVals[colorIndex];
    const synthObj = InstrumentPresets[selectedInstrumentIndex];

    // console.log('__SETTING SYNTH___');
    // console.log('new instrument:', selectedInstrumentIndex);
    // console.log('new color:', colorIndex);
    // console.log('knob vals:', knobVals);
    // console.log('sending', `colorFx-${colorIndex}`);

    if (this.synth) {
      this.synth.triggerRelease();

      this.panner.disconnect();
      this.panner.dispose();
      this.solo.disconnect();
      this.solo.dispose();
      this.gain.disconnect();
      this.gain.dispose();

      this.synth.volume.exponentialRampToValueAtTime(
        -Infinity,
        Tone.now() + 0.2
      );

      this.synth.disconnect();
      this.synth.dispose();
    }

    this.synth = new synthObj.baseSynth(synthObj.params);
    this.synth.volume.exponentialRampToValueAtTime(
      this.state.volume,
      Tone.now() + 0.2
    );

    knobVals.forEach((val, i) => {
      if (synthObj.dynamicParams[i].target === 'instrument') {
        synthObj.dynamicParams[i].func(this, val);
      }
    });

    this.panner = new Tone.Panner(0);
    this.solo = new Tone.Solo();
    this.gain = new Tone.Gain().send(`colorFx-${colorIndex}`, 0);

    this.synth.chain(this.panner, this.solo, this.gain);
  }

  setNoteEvents(scaleObj, points) {
    this.part.removeAll();

    let delay = 0;
    let prevNoteIndex = this.state.firstNoteIndex;

    forEachPoint(points, (p, i) => {
      if (i >= 2) {
        const noteInfo = this.getNoteInfo(
          points,
          scaleObj,
          i,
          i - 2,
          i - 4,
          prevNoteIndex
        );
        this.part.add(delay, noteInfo);
        delay += noteInfo.duration;
        prevNoteIndex = noteInfo.noteIndex;
      }
    });

    // last edge
    const n = points.length;
    const lastNoteInfo = this.getNoteInfo(
      points,
      scaleObj,
      0,
      n - 2,
      n - 4,
      prevNoteIndex
    );

    this.part.add(delay, lastNoteInfo);
    this.part.loopEnd = delay + lastNoteInfo.duration;
  }

  setPan(val) {
    this.panner.pan.value = val * 0.9;
  }

  setEffectVal(val, i) {
    const synthParamsIndex = this.props.selectedInstruments[
      this.state.colorIndex
    ];
    const synthParams = InstrumentPresets[synthParamsIndex];
    // set synth value when knobs are changed
    // values for connected effects are set with the colorController
    if (synthParams.dynamicParams[i].target === 'instrument') {
      synthParams.dynamicParams[i].func(this, val);
    }
  }

  /* ============================== HANDLERS ============================== */

  /* --- Shape ------------------------------------------------------------ */

  /* Click */
  handleMouseDown(e) {
    this.setState({
      editorX: e.evt.offsetX,
      editorY: e.evt.offsetY,
    });
  }

  handleClick() {
    this.props.onShapeClick(this.props.index);
  }

  handleDelete() {
    this.props.onDelete(this.props.index);
  }

  /* Drag */
  handleDragStart() {
    this.setState({
      isDragging: true,
    });
  }

  handleDrag() {
    const shapeElement = this.shapeComponentElement.getShapeElement();
    const absPos = shapeElement.getAbsolutePosition();
    const avgPoint = getAveragePoint(this.state.points);

    const x = parseInt(absPos.x + avgPoint.x, 10);
    const y = parseInt(absPos.y + avgPoint.y, 10);

    const panVal = convertValToRange(x, 0, window.innerWidth, -1, 1);
    const noteIndexVal = parseInt(
      convertValToRange(y, 0, window.innerHeight, 5, -7),
      10
    );

    this.setPan(panVal);

    this.setState({
      averagePoint: { x: x, y: y },
      noteIndexModifier: noteIndexVal,
    });
  }

  handleDragEnd() {
    this.setState({
      isDragging: false,
    });
  }

  dragBoundFunc(pos) {
    return {
      x: this.props.snapToGrid(pos.x),
      y: this.props.snapToGrid(pos.y),
    };
  }

  /* Hover */
  handleMouseOver() {
    this.setState({ isHoveredOver: true });
  }

  handleMouseOut() {
    this.setState({ isHoveredOver: false });
  }

  /* --- Editor Panel ----------------------------------------------------- */

  /* --- Color --- */
  handleColorChange(colorObj) {
    this.setState({
      colorIndex: themeColors.indexOf(colorObj.hex),
    });
  }

  /* --- Volume --- */
  handleVolumeChange(val) {
    this.synth.volume.exponentialRampToValueAtTime(val, Tone.now() + 0.2);
    this.setState({
      volume: val,
    });
  }

  handleMuteChange() {
    this.part.mute = !this.state.isMuted;
    this.setState({
      isMuted: !this.state.isMuted,
    });
  }

  /* --- Quantization --- */
  handleQuantizeClick() {
    const newPoints = this.getPointsForFixedPerimeterLength(
      this.state.points,
      this.quantizeLength * this.state.quantizeFactor
    );

    this.setNoteEvents(this.props.scaleObj, newPoints);
    this.setState({
      points: newPoints,
    });
  }

  handleQuantizeFactorChange(factor) {
    return () => {
      if (
        (factor < 1 && this.state.quantizeFactor >= 0.25) ||
        (factor > 1 && this.state.quantizeFactor <= 4)
      ) {
        const newPerim = this.props.isAutoQuantizeActive
          ? factor * this.state.quantizeFactor * this.quantizeLength
          : getPerimeterLength(this.state.points) * factor;
        const newPoints = this.getPointsForFixedPerimeterLength(
          this.state.points,
          newPerim
        );

        this.setNoteEvents(this.props.scaleObj, newPoints);

        this.setState({
          points: newPoints,
          quantizeFactor: factor * this.state.quantizeFactor,
        });
      }
    };
  }

  /* --- Arrangement --- */
  handleToTopClick() {
    const groupElement = this.shapeComponentElement.getGroupElement();
    groupElement.moveToTop();
    // TODO way to hacky
    this.setState({
      isHoveredOver: true,
    });
    this.setState({
      isHoveredOver: false,
    });
  }

  handleToBottomClick() {
    const groupElement = this.shapeComponentElement.getGroupElement();
    groupElement.moveToBottom();
    // TODO way to hacky
    this.setState({
      isHoveredOver: true,
    });
    this.setState({
      isHoveredOver: false,
    });
  }

  /* --- Vertices --------------------------------------------------------- */

  handleVertexDragMove(i) {
    return e => {
      const pos = e.target.position();
      let points = this.state.points.slice();
      points[i] = this.props.snapToGrid(pos.x);
      points[i + 1] = this.props.snapToGrid(pos.y);

      if (this.props.isAutoQuantizeActive) {
        points = this.getPointsForFixedPerimeterLength(
          points,
          this.quantizeLength * this.state.quantizeFactor
        );
      }

      this.setNoteEvents(this.props.scaleObj, points);

      this.setState({
        points: points,
      });
    };
  }

  /* --- Helper ----------------------------------------------------------- */

  getFillColor() {
    const color = themeColors[this.state.colorIndex];
    const alphaAmount = this.props.isSelected ? 0.8 : 0.4;
    return Color(color)
      .alpha(alphaAmount)
      .toString();
  }

  getPointsForFixedPerimeterLength(points, length) {
    const currLen = getPerimeterLength(points);
    const avgPoint = getAveragePoint(points);
    const ratio = length / currLen;

    const newPoints = points.slice();

    forEachPoint(points, (p, i) => {
      newPoints[i] = p.x * ratio + (1 - ratio) * avgPoint.x;
      newPoints[i + 1] = p.y * ratio + (1 - ratio) * avgPoint.y;
    });

    return newPoints;
  }

  /* =============================== RENDER =============================== */

  render() {
    // console.log('shape render');
    const color = themeColors[this.state.colorIndex];
    const isEditMode = this.props.activeTool === 'edit';
    let opacity = 1;

    if (
      this.props.soloedShapeIndex >= 0 &&
      this.props.soloedShapeIndex !== this.props.index
    ) {
      opacity = 0.4;
    }
    if (this.state.isMuted) {
      opacity = 0.2;
    }

    const attrs = {
      strokeWidth: isEditMode ? (this.state.isHoveredOver ? 4 : 2) : 2,
      stroke: color,
      fill: this.getFillColor(),
      opacity,
    };

    return (
      <ShapeComponent
        ref={c => (this.shapeComponentElement = c)}
        project={{
          scaleObj: this.props.scaleObj,
          isEditMode: isEditMode,
          isPlaying: this.props.isPlaying,
          tempo: this.props.tempo,
        }}
        index={this.props.index}
        points={this.state.points}
        attrs={attrs}
        volume={this.state.volume}
        colorIndex={this.state.colorIndex}
        noteIndexModifier={this.state.noteIndexModifier}
        isDragging={this.state.isDragging}
        isSelected={this.props.isSelected}
        isMuted={this.state.isMuted}
        soloedShapeIndex={this.props.soloedShapeIndex}
        averagePoint={this.state.averagePoint}
        editorPosition={{
          x: this.state.editorX,
          y: this.state.editorY,
        }}
        // shape event handlers
        dragBoundFunc={this.dragBoundFunc}
        handleDrag={this.handleDrag}
        handleDragStart={this.handleDragStart}
        handleDragEnd={this.handleDragEnd}
        handleClick={this.handleClick}
        handleMouseDown={this.handleMouseDown}
        handleMouseOver={this.handleMouseOver}
        handleMouseOut={this.handleMouseOut}
        handleVertexDragMove={this.handleVertexDragMove}
        // editor panel handlers
        handleColorChange={this.handleColorChange}
        handleQuantizeClick={this.handleQuantizeClick}
        handleDelete={this.handleDelete}
        handleQuantizeFactorChange={this.handleQuantizeFactorChange}
        handleVolumeChange={this.handleVolumeChange}
        handleMuteChange={this.handleMuteChange}
        handleSoloChange={this.props.onSoloChange}
        handleToTopClick={this.handleToTopClick}
        handleToBottomClick={this.handleToBottomClick}
      />
    );
  }
}

ShapeContainer.propTypes = propTypes;

export default ShapeContainer;
