import React, { PureComponent } from 'react';
import { number, string, array, bool, object, func } from 'prop-types';
import Color from 'color';
import Tone from 'tone';
import { themeColors, appColors } from 'utils/color';
import { TOOL_TYPES } from 'components/Project';

import { convertValToRange } from 'utils/math';
import {
  getPerimeterLength,
  getAveragePoint,
  forEachPoint,
  getNoteInfo,
} from 'utils/shape';

import ShapeComponent from './Component';
import withProjectContext from 'components/Project/withProjectContext';
import { SYNTH_PRESETS } from 'instrumentPresets';
import { SEND_CHANNELS } from 'utils/music';

const propTypes = {
  index: number.isRequired,
  colorIndex: number.isRequired,
  initialPoints: array.isRequired,
  isSelected: bool.isRequired,
  soloedShapeIndex: number.isRequired,

  isPlaying: bool.isRequired,
  selectedSynths: array.isRequired,
  knobVals: array.isRequired,

  isAutoQuantizeActive: bool.isRequired,
  activeTool: string.isRequired,
  tempo: number.isRequired,
  scaleObj: object.isRequired,

  snapToGrid: func.isRequired,

  handleSoloChange: func.isRequired,
};

class ShapeContainer extends PureComponent {
  constructor(props) {
    super(props);
    const { initialPoints, initialQuantizeFactor } = props;

    this.state = {
      points: initialPoints,
      quantizeFactor: initialQuantizeFactor || 1,
      averagePoint: { x: 0, y: 0 },
      firstNoteIndex: 1,
      noteIndexModifier: 0,
      isHoveredOver: false,
      isDragging: false,
      editorX: 0,
      editorY: 0,
      animCircleX: 0,
      animCircleY: 0,
      isBuffering: false,
    };
    this.quantizeLength = 500;

    // shape events
    this.handleMouseDown = this.handleMouseDown.bind(this);
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
    this.handleQuantizeFactorChange = this.handleQuantizeFactorChange.bind(
      this
    );
    this.handleToTopClick = this.handleToTopClick.bind(this);
    this.handleToBottomClick = this.handleToBottomClick.bind(this);
    this.handleReverseClick = this.handleReverseClick.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { colorIndex, scaleObj } = this.props;
    const { points, quantizeFactor } = this.state;

    this.setSynth(this.props, colorIndex);
    this.part = this.getPart();

    // TODO ugly
    if (this.props.isAutoQuantizeActive) {
      const newPoints = this.getPointsForFixedPerimeterLength(
        points,
        this.quantizeLength * quantizeFactor
      );
      this.setNoteEvents(scaleObj, newPoints);
      this.setState({
        points: newPoints,
      });
    } else {
      this.setNoteEvents(scaleObj, points);
    }
  }

  componentDidMount() {
    const { getShapeRef } = this.props;
    const shapeRef = getShapeRef();
    this.handleDrag();
    shapeRef(this);
  }

  componentWillUnmount() {
    const { removeShapeRef, index } = this.props;
    // this.shapeElement.destroy();
    removeShapeRef(index);
    this.part.dispose();
    this.synth.dispose();
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    /* change instrument when color's instrument changes, or when shape's color changes */
    if (
      nextProps.selectedSynths[nextProps.colorIndex] !==
        this.props.selectedSynths[nextProps.colorIndex] ||
      nextProps.colorIndex !== this.props.colorIndex
    ) {
      this.setSynth(nextProps, nextProps.colorIndex);
    }

    if (!nextProps.isPlaying && this.props.isPlaying) {
      this.synth.triggerRelease();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /* remove hover styles when switching to draw mode */
    if (
      nextProps.activeTool === TOOL_TYPES.DRAW &&
      this.props.activeTool === TOOL_TYPES.EDIT
    ) {
      this.setState({
        isHoveredOver: false,
      });
    }

    /* set volume */
    if (nextProps.volume !== this.props.volume) {
      this.synth.volume.exponentialRampToValueAtTime(
        nextProps.volume,
        Tone.now() + 0.2
      );
    }

    /* set mute */
    if (nextProps.isMuted !== this.props.isMuted) {
      this.part.mute = nextProps.isMuted;
    }

    /* set to fixed perimeter */
    if (nextProps.isAutoQuantizeActive && !this.props.isAutoQuantizeActive) {
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
    nextProps.knobVals[this.props.colorIndex].forEach((val, i) => {
      // TODO
      if (this.props.knobVals[this.props.colorIndex][i] !== val) {
        this.setEffectVal(val, i);
      }
    });

    /* on solo update */
    if (this.props.soloedShapeIndex !== nextProps.soloedShapeIndex) {
      const isSoloed = nextProps.soloedShapeIndex === nextProps.index;
      this.solo.solo = isSoloed;
    }
  }

  /* ================================ AUDIO =============================== */

  getPart() {
    const part = new Tone.Part((time, val) => {
      const dur = val.duration / this.part.playbackRate;

      // animation
      Tone.Draw.schedule(() => {
        const { points } = this.state;
        const { colorIndex } = this.props;
        const { pIndex } = val;

        const xFrom = points[pIndex - 2];
        const yFrom = points[pIndex - 1];
        const xTo = pIndex >= points.length ? points[0] : points[pIndex];
        const yTo = pIndex >= points.length ? points[1] : points[pIndex + 1];

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
            fill: themeColors[colorIndex],
            duration: 0.3,
          });
        }
      }, time);

      const { noteIndexModifier, isBuffering } = this.state;
      const { scaleObj } = this.props;

      const noteIndex = val.noteIndex + noteIndexModifier;
      const noteString = scaleObj.get(noteIndex).toString();

      // trigger synth
      if (!isBuffering) {
        this.synth.triggerAttackRelease(noteString, dur, time);
      }
    }, []).start(0);

    part.loop = true;
    part.playbackRate = this.props.tempo / 50;
    const { isMuted } = this.props;
    if (isMuted) {
      part.mute = true;
    }

    return part;
  }

  setSynth(props, colorIndex) {
    const selectedSynth = props.selectedSynths[colorIndex];
    const knobVals = props.knobVals[colorIndex];
    const synthObj = SYNTH_PRESETS[selectedSynth];

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

    this.synth = new synthObj.baseSynth(synthObj.params, () => {
      console.log('LOADED');
      this.setState({ isBuffering: false });
    });
    if (this.synth instanceof Tone.Sampler) {
      console.log('setting isbuffering to true');
      this.setState({ isBuffering: true });
    }
    this.synth.volume.exponentialRampToValueAtTime(
      this.props.volume,
      Tone.now() + 0.2
    );

    knobVals.forEach((val, i) => {
      if (synthObj.dynamicParams[i].target === 'instrument') {
        synthObj.dynamicParams[i].func(this, val);
      }
    });

    this.panner = new Tone.Panner(0);
    this.solo = new Tone.Solo();
    this.gain = new Tone.Gain().send(
      `${SEND_CHANNELS.FX_PREFIX}${colorIndex}`,
      0
    );

    this.synth.chain(this.panner, this.solo, this.gain);
  }

  getMIDINoteEvents() {
    const { points } = this.state;
    const { scaleObj } = this.props;
    let prevNoteIndex = this.state.firstNoteIndex;

    // TODO: clean this up
    const noteEvents = [];
    forEachPoint(points, (p, i) => {
      if (i >= 2) {
        const noteInfo = getNoteInfo(
          points,
          scaleObj,
          i,
          i - 2,
          i - 4,
          prevNoteIndex
        );

        const noteIndex = noteInfo.noteIndex + this.state.noteIndexModifier;
        const noteString = scaleObj.get(noteIndex).toString();
        noteEvents.push({ note: noteString, duration: noteInfo.duration });

        prevNoteIndex = noteInfo.noteIndex;
      }
    });

    // last edge
    const n = points.length;
    const lastNoteInfo = getNoteInfo(
      points,
      scaleObj,
      0,
      n - 2,
      n - 4,
      prevNoteIndex
    );

    const noteIndex = lastNoteInfo.noteIndex + this.state.noteIndexModifier;
    const noteString = scaleObj.get(noteIndex).toString();
    noteEvents.push({ note: noteString, duration: lastNoteInfo.duration });

    return noteEvents;
  }

  setNoteEvents(scaleObj, points) {
    this.part.removeAll();

    let delay = 0;
    let prevNoteIndex = this.state.firstNoteIndex;

    forEachPoint(points, (p, i) => {
      if (i >= 2) {
        const noteInfo = getNoteInfo(
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
    const lastNoteInfo = getNoteInfo(
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
    const { colorIndex } = this.props;
    const synthName = this.props.selectedSynths[colorIndex];
    const { dynamicParams } = SYNTH_PRESETS[synthName];

    // set synth value when knobs are changed
    // values for connected effects are set with the colorController
    if (dynamicParams[i].target === 'instrument') {
      dynamicParams[i].func(this, val);
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

  /* Drag */
  handleDragStart() {
    this.setState({
      isDragging: true,
    });
  }

  handleDrag() {
    const { points } = this.state;
    const shapeElement = this.shapeComponentElement.getShapeElement();
    const absPos = shapeElement.getAbsolutePosition();
    const avgPoint = getAveragePoint(points);

    const x = parseInt(absPos.x + avgPoint.x, 10);
    const y = parseInt(absPos.y + avgPoint.y, 10);

    const panVal = convertValToRange(x, 0, window.innerWidth, -1, 1);
    const noteIndexVal = parseInt(
      convertValToRange(y, 0, window.innerHeight, 5, -7),
      10
    );

    this.setPan(panVal);

    this.setState({
      averagePoint: { x, y },
      noteIndexModifier: noteIndexVal,
    });
  }

  handleDragEnd() {
    this.setState({
      isDragging: false,
    });
  }

  dragBoundFunc(pos) {
    const { snapToGrid } = this.props;
    return {
      x: snapToGrid(pos.x),
      y: snapToGrid(pos.y),
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
  handleQuantizeFactorChange(factor) {
    return () => {
      const { points, quantizeFactor } = this.state;
      const { scaleObj, isAutoQuantizeActive } = this.props;

      if (
        (factor < 1 && quantizeFactor >= 0.25) ||
        (factor > 1 && quantizeFactor <= 4)
      ) {
        const newPerim = isAutoQuantizeActive
          ? factor * quantizeFactor * this.quantizeLength
          : getPerimeterLength(points) * factor;
        const newPoints = this.getPointsForFixedPerimeterLength(
          points,
          newPerim
        );

        this.setNoteEvents(scaleObj, newPoints);

        this.setState({
          points: newPoints,
          quantizeFactor: factor * quantizeFactor,
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

  handleReverseClick() {
    const { scaleObj } = this.props;
    const { points } = this.state;
    const reversed = [points[0], points[1]];
    for (let i = points.length - 2; i >= 2; i -= 2) {
      reversed.push(points[i]);
      reversed.push(points[i + 1]);
    }
    this.setNoteEvents(scaleObj, reversed);
    this.setState({ points: reversed });
  }

  /* --- Vertices --------------------------------------------------------- */

  handleVertexDragMove(i) {
    return e => {
      const { snapToGrid, isAutoQuantizeActive, scaleObj } = this.props;
      const pos = e.target.position();

      let points = this.state.points.slice();
      points[i] = snapToGrid(pos.x);
      points[i + 1] = snapToGrid(pos.y);

      if (isAutoQuantizeActive) {
        points = this.getPointsForFixedPerimeterLength(
          points,
          this.quantizeLength * this.state.quantizeFactor
        );
      }

      this.setNoteEvents(scaleObj, points);
      this.setState({ points });
    };
  }

  /* --- Helper ----------------------------------------------------------- */

  getFillColor() {
    const color = themeColors[this.props.colorIndex];
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

  getAbsolutePoints() {
    const { points } = this.state;
    const shapeElement = this.shapeComponentElement.getShapeElement();
    const { x, y } = shapeElement.getAbsolutePosition();
    const absolutePoints = points.map((p, i) => (i % 2 === 0 ? p + x : p + y));

    return absolutePoints;
  }

  /* =============================== RENDER =============================== */

  render() {
    console.log('shape render');

    const {
      index,
      volume,
      colorIndex,
      activeTool,
      soloedShapeIndex,
      isMuted,
      isSelected,
      handleClick,
      handleColorChange,
      handleVolumeChange,
      handleDelete,
      handleSoloChange,
      handleMuteChange,
      handleShapeDuplicate,
    } = this.props;

    const {
      isHoveredOver,
      points,
      noteIndexModifier,
      isDragging,
      averagePoint,
      editorX,
      editorY,
      isBuffering,
    } = this.state;

    const color = themeColors[colorIndex];
    const isSoloed = soloedShapeIndex === index;
    const isEditMode = activeTool === TOOL_TYPES.EDIT;
    let opacity = 1;

    if (soloedShapeIndex >= 0 && !isSoloed) {
      opacity = 0.4;
    }
    if (isMuted) {
      opacity = 0.2;
    }

    const attrs = {
      strokeWidth: isEditMode ? (isHoveredOver ? 4 : 2) : 2,
      stroke: color,
      fill: this.getFillColor(),
      opacity,
    };

    return (
      <ShapeComponent
        // NOTE: hack to get around HOC
        // TODO: revisit ref methods
        onMount={c => (this.shapeComponentElement = c)}
        index={index}
        points={points}
        attrs={attrs}
        volume={volume}
        colorIndex={colorIndex}
        noteIndexModifier={noteIndexModifier}
        isDragging={isDragging}
        isSelected={isSelected}
        isMuted={isMuted}
        isSoloed={isSoloed}
        isBuffering={isBuffering}
        averagePoint={averagePoint}
        editorPosition={{
          x: editorX,
          y: editorY,
        }}
        // shape event handlers
        dragBoundFunc={this.dragBoundFunc}
        handleDrag={this.handleDrag}
        handleDragStart={this.handleDragStart}
        handleDragEnd={this.handleDragEnd}
        handleClick={() => {
          // pass points if needed for duplication
          const absolutePoints = this.getAbsolutePoints();
          handleClick(index, absolutePoints);
        }}
        handleMouseDown={this.handleMouseDown}
        handleMouseOver={this.handleMouseOver}
        handleMouseOut={this.handleMouseOut}
        handleVertexDragMove={this.handleVertexDragMove}
        // editor panel handlers
        handleColorChange={handleColorChange}
        handleQuantizeClick={this.handleQuantizeClick}
        handleDelete={handleDelete}
        handleQuantizeFactorChange={this.handleQuantizeFactorChange}
        handleVolumeChange={handleVolumeChange(index)}
        handleMuteChange={handleMuteChange(index)}
        handleSoloChange={() => handleSoloChange(index)}
        handleToTopClick={this.handleToTopClick}
        handleToBottomClick={this.handleToBottomClick}
        handleReverseClick={this.handleReverseClick}
        handleDuplicateClick={() => {
          // pass points if needed for duplication
          const absolutePoints = this.getAbsolutePoints();
          handleShapeDuplicate(index, absolutePoints);
        }}
      />
    );
  }
}

ShapeContainer.propTypes = propTypes;

export default withProjectContext(ShapeContainer);
