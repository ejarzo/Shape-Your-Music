import * as Tone from 'tone';
import { setSynthParam, setEffectWet } from './utils';
import { convertValToRange } from 'utils/math';

export default {
  name: 'Sub Bass',
  baseSynth: Tone.MonoSynth,
  params: {
    portamento: 0.08,
    oscillator: {
      partials: [2, 1, 3, 2, 0.4],
      volume: -12,
    },
    filter: {
      Q: 4,
      type: 'lowpass',
      rolloff: -48,
    },
    envelope: {
      attack: 0.04,
      decay: 0.06,
      sustain: 0.4,
      release: 1,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.6,
      release: 1.5,
      baseFrequency: 50,
      octaves: 3.4,
    },
  },
  effects: [
    {
      type: Tone.Distortion,
      params: { distortion: 0.9 },
    },
    {
      type: Tone.Freeverb,
      params: {
        roomSize: 0.3,
        dampening: 1500,
        wet: 1,
      },
    },
  ],
  dynamicParams: [
    {
      name: 'glide',
      default: 50,
      target: 'instrument',
      func: setSynthParam('portamento', 0, 0.4),
    },
    {
      name: 'growl',
      default: 1,
      target: 'instrument',
      func: (shape, val) => {
        shape.synth.filterEnvelope.set(
          'attack',
          convertValToRange(val, 0, 100, 0, 3)
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
      default: 0,
      target: 'effect',
      func: setEffectWet(1),
    },
  ],
};
