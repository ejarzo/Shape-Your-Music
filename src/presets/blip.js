import Tone from 'tone';
import { setSynthParam, setSynthEnvelopeParam } from './utils';

export default {
  name: {
    label: 'Blip',
    value: 3,
  },
  baseSynth: Tone.Synth,
  params: {
    portamento: 0,
    oscillator: {
      partials: [1, 0, 2, 0, 3],
    },
    envelope: {
      attack: 0.01,
      decay: 1.2,
      sustain: 0,
      release: 1.2,
    },
  },
  effects: [],
  dynamicParams: [
    {
      name: 'glide',
      default: 0,
      target: 'instrument',
      func: setSynthParam('portamento', 0, 0.5),
    },
    {
      name: 'attack',
      default: 0.01,
      target: 'instrument',
      func: setSynthEnvelopeParam('attack', 0.01, 0.8),
    },
    {
      name: 'decay',
      default: 1.2,
      target: 'instrument',
      func: setSynthEnvelopeParam('decay', 0.01, 3),
    },
    {
      name: 'sustain',
      default: 0,
      target: 'instrument',
      func: setSynthEnvelopeParam('sustain', 0.01, 1),
    },
  ],
};
