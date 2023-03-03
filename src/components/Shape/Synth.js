import * as Tone from 'tone';
import { SYNTH_PRESETS } from 'instrumentPresets';
import { SEND_CHANNELS } from 'utils/music';
import { forEachPoint, getNoteInfo } from 'utils/shape';
import { DEFAULT_PROXIMITY_MODE_RADIUS } from 'utils/project';

export function Synth({ onStartLoading, onEndLoading }) {
  console.log('Synth constructed');

  let noteIndexModifier = 0;
  let isPlayingAnimator = () => {};
  let synth = null;
  let isBuffering = false;

  const part = new Tone.Part((time, val) => {
    const dur = val.duration / part.playbackRate;
    // animation
    Tone.Draw.schedule(isPlayingAnimator(val, dur), time);

    const noteIndex = val.noteIndex + noteIndexModifier;
    const noteString = scaleObj.get(noteIndex).toString();
    // trigger synth
    if (synth && !isBuffering) {
      synth.triggerAttackRelease(noteString, dur, time);
    }
  }, []).start(0);

  part.loop = true;

  let volume = -Infinity;
  let panner = null;
  let panner3d = null;
  let pannerNode = null;

  let solo = null;
  let gain = null;

  let firstNoteIndex = 0;
  let scaleObj = null;
  let synthObj = null;

  let isProximityMode;
  let proximityRadius;
  let avgPt;
  let panVal;

  const disposeSynth = () => {
    synth.triggerRelease();
    panner.disconnect();
    panner.dispose();
    // panner3d.disconnect();
    // panner3d.dispose();
    solo.disconnect();
    solo.dispose();
    gain.disconnect();
    gain.dispose();
    synth.volume.exponentialRampToValueAtTime(-Infinity, Tone.now() + 0.2);
    synth.disconnect();
    synth.dispose();
  };

  return {
    setVolume: newVol => {
      volume = newVol;
      synth.volume.exponentialRampToValueAtTime(newVol, Tone.now() + 0.2);
    },
    setSynth: (newSelectedSynth, colorIndex) => {
      synthObj = SYNTH_PRESETS[newSelectedSynth];
      if (synth) {
        disposeSynth();
      }

      synth = new synthObj.baseSynth({ ...synthObj.params }, () => {
        onEndLoading();
        isBuffering = false;
      });
      if (synth instanceof Tone.Sampler) {
        onStartLoading();
        isBuffering = true;
      }

      synth.volume.exponentialRampToValueAtTime(volume, Tone.now() + 0.2);

      panner = new Tone.Panner(0);
      panner3d = new Tone.Panner3D({
        panningModel: 'HRTF',
        positionX: 0,
        positionY: 0,
        distanceModel: 'linear',
        // distanceModel: 'inverse',
        maxDistance: proximityRadius || DEFAULT_PROXIMITY_MODE_RADIUS,
        orientationX: 1,
        orientationY: 1,
        orientationZ: 1,
      });
      panner3d._rampTimeConstant = 0.6;

      /* TODO use below functions? */
      if (panVal) {
        panner.pan.value = panVal * 0.9;
      }
      if (avgPt) {
        panner3d.positionX = avgPt.x;
        panner3d.positionY = avgPt.y;
      }
      if (isProximityMode) {
        pannerNode = panner3d;
      } else {
        pannerNode = panner;
      }

      solo = new Tone.Solo();

      // NOTE: this is where we connect to the output channel for this color
      gain = new Tone.Channel().send(
        `${SEND_CHANNELS.FX_PREFIX}${colorIndex}`,
        0
      );

      synth.chain(pannerNode, solo, gain);
    },
    setKnobValues: knobVals => {
      knobVals.forEach((val, i) => {
        if (synthObj.dynamicParams[i].target === 'instrument') {
          // TODO: confirm this works
          synthObj.dynamicParams[i].func({ synth }, val);
        }
      });
    },
    setNoteEvents: (scaleObj, points) => {
      part.clear();

      let delay = 0;
      let prevNoteIndex = firstNoteIndex;

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
          part.add(delay, noteInfo);
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

      part.add(delay, lastNoteInfo);
      part.loopEnd = delay + lastNoteInfo.duration;
    },
    setAnimator: animator => {
      isPlayingAnimator = animator;
    },
    setNoteIndexModifier: val => {
      noteIndexModifier = val;
    },
    setFirstNoteIndex: val => {
      firstNoteIndex = val;
    },
    setScaleObj: val => {
      scaleObj = val;
    },
    setIsMuted: isMuted => {
      part.mute = isMuted;
    },
    setIsSoloed: val => {
      solo.solo = val;
    },
    setTempo: tempo => {
      part.playbackRate = tempo / 50;
    },
    setPan: val => {
      panVal = val;
      panner.pan.value = val * 0.9;
    },
    setPan3d: _avgPt => {
      avgPt = _avgPt;
      panner3d.positionX = avgPt.x;
      panner3d.positionY = avgPt.y;
    },
    setProximityMode: _isProximityMode => {
      isProximityMode = _isProximityMode;
      if (isProximityMode) {
        pannerNode = panner3d;
      } else {
        pannerNode = panner;
      }
      synth.disconnect();
      synth.chain(pannerNode, solo, gain);
    },
    setProximityRadius: _proximityRadius => {
      proximityRadius = _proximityRadius;
      panner3d.set('maxDistance', proximityRadius);
    },
    dispose: () => {
      part.dispose();
      disposeSynth();
    },
  };
}
