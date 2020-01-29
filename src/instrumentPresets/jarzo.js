import Tone from 'tone';
import { convertValToRange } from 'utils/math';
import { setEffectWet } from './utils';

export default {
  name: 'Buzzz',
  baseSynth: Tone.DuoSynth,
  params: {
    vibratoAmount: 0.2,
    vibratoRate: 1,
    harmonicity: 1,
    voice0: {
      volume: -5,
      portamento: 0,
      filter: {
        type: 'lowpass',
        frequency: 1000,
        rolloff: -12,
        Q: 1,
        gain: 0,
      },
      oscillator: {
        type: 'sawtooth',
        detune: 20,
      },
      filterEnvelope: {
        attack: 1,
        decay: 0.1,
        sustain: 0.1,
        release: 0.5,
      },
      envelope: {
        attack: 0.01,
        decay: 0.8,
        sustain: 0,
        release: 0.1,
      },
    },
    voice1: {
      volume: -5,
      portamento: 0,
      oscillator: {
        type: 'sine',
        detune: -20,
      },
      filterEnvelope: {
        attack: 2,
        decay: 0.2,
        sustain: 0.3,
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
    {
      type: Tone.Distortion,
      params: {
        distortion: 0.9,
        wet: 1,
      },
    },
    {
      type: Tone.Freeverb,
      params: {
        roomSize: 0.1,
        dampening: 3000,
        wet: 1,
      },
    },
    // {
    //   type: Tone.Filter,
    //   params: {
    //     frequency : 1500,
    //     type : 'lowpass',
    //     wet: 1,
    //   }
    // }, {
    //   type: Tone.Tremolo, // TODO start
    //   params: {
    //     frequency : 2,
    //     type : 'sawtooth',
    //     depth : 0.7,
    //     wet: 1,
    //     spread : 1
    //   }
    // }
  ],
  dynamicParams: [
    {
      name: 'pop',
      default: 0,
      target: 'instrument',
      func: (shape, val) => {
        shape.synth.voice0.envelope.set(
          'attack',
          convertValToRange(val, 0, 100, 1, 0)
        );
      },
    },
    {
      name: 'attack',
      default: 0.1,
      target: 'instrument',
      func: (shape, val) => {
        shape.synth.voice1.oscillator.set(
          'detune',
          convertValToRange(val, 0, 100, 0, 20)
        );
        shape.synth.voice0.oscillator.set(
          'detune',
          convertValToRange(val / 100, 0, 100, 0, 20)
        );
      },
    },
    {
      name: 'fuzz',
      default: 10,
      target: 'effect',
      func: setEffectWet(0),
    },
    {
      name: 'space',
      default: 5,
      target: 'effect',
      func: setEffectWet(1),
    },
  ],
};
