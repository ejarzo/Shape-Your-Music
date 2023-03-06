import * as Tone from 'tone';
import { setSynthParam, setEffectWet } from './utils';

const duoSyn = new Tone.DuoSynth({
  voice0: {
    oscillator: {
      type: 'amsine',
    },
  },
});
export default {
  name: 'Duo',
  baseSynth: Tone.DuoSynth,
  params: {
    vibratoAmount: 0.5,
    vibratoRate: 5,
    harmonicity: 1.5,
    voice0: {
      volume: -10,
      portamento: 0,
      oscillator: {
        type: 'custom',
        partials: [3],
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.5,
      },
      envelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.5,
      },
    },
    voice1: {
      volume: -10,
      portamento: 0,
      oscillator: {
        type: 'custom',
        partials: [3],
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.5,
      },
      envelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.5,
      },
    },
  },
  effects: [
    // {
    //   type: Tone.Chorus,
    //   params: {
    //     frequency: 1.5,
    //     delayTime: 3.5,
    //     depth: 0.9,
    //     feedback: 0.1,
    //     type: 'sine',
    //     spread: 180,
    //   },
    // },
  ],
  dynamicParams: [
    // {
    //   name: 'glide',
    //   default: 0,
    //   target: 'instrument',
    //   func: setSynthParam('portamento', 0, 0.5),
    // },
    // {
    //   name: 'chorus',
    //   default: 20,
    //   target: 'effect',
    //   func: setEffectWet(0),
    // },
    // {
    //   name: 'vibrato',
    //   default: 10,
    //   target: 'instrument',
    //   func: setSynthParam('vibratoAmount', 0, 1),
    // },
    // {
    //   name: 'harmonicity',
    //   default: 0,
    //   target: 'instrument',
    //   func: setSynthParam('harmonicity', 0, 3),
    // },
  ],
};
