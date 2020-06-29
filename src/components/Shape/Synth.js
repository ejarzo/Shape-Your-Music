import Tone from 'tone';
import { SYNTH_PRESETS } from 'instrumentPresets';
import { SEND_CHANNELS } from 'utils/music';
import { forEachPoint, getNoteInfo } from 'utils/shape';

export function Synth({
  initVolume,
  isPlayingAnimator: initIsPlayingAnimator,
  noteIndexModifier: initNoteIndexModifier,
  firstNoteIndex: initFirstNoteIndex,
  onStartLoading,
  onEndLoading,
}) {
  console.log('Synth constructed');

  let noteIndexModifier = initNoteIndexModifier || 0;
  let isPlayingAnimator = initIsPlayingAnimator;
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

  let volume = initVolume;
  let panner = null;
  let solo = null;
  let gain = null;

  let firstNoteIndex = initFirstNoteIndex;
  let scaleObj = null;
  let synthObj = null;

  const disposeSynth = () => {
    synth.triggerRelease();
    panner.disconnect();
    panner.dispose();
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

      synth = new synthObj.baseSynth(synthObj.params, () => {
        onEndLoading();
        isBuffering = false;
      });
      if (synth instanceof Tone.Sampler) {
        onStartLoading();
        isBuffering = true;
      }

      synth.volume.exponentialRampToValueAtTime(volume, Tone.now() + 0.2);

      panner = new Tone.Panner(0);
      solo = new Tone.Solo();
      // NOTE: this is where we connect to the output channel for this color
      gain = new Tone.Gain().send(`${SEND_CHANNELS.FX_PREFIX}${colorIndex}`, 0);

      synth.chain(panner, solo, gain);
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
      part.removeAll();

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
    updateAnimator: animator => {
      isPlayingAnimator = animator;
    },
    updateNoteIndexModifier: val => {
      noteIndexModifier = val;
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
    dispose: () => {
      part.dispose();
      disposeSynth();
    },
  };
}
