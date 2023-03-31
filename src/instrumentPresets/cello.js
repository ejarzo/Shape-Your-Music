import * as Tone from 'tone';
import { setSynthEnvelopeParam, setEffectWet } from './utils';

export default {
  name: 'Cello',
  baseSynth: Tone.FMSynth,
  params: {
    harmonicity: 3.01,
    modulationIndex: 14,
    oscillator: {
      type: 'triangle',
    },
    envelope: {
      attack: 0.2,
      decay: 0.3,
      sustain: 0.1,
      release: 1.2,
    },
    modulation: {
      type: 'square',
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0.5,
      sustain: 0.2,
      release: 0.1,
    },
  },
  effects: [
    {
      type: Tone.Freeverb,
      params: {
        roomSize: 0.8,
        dampening: 5000,
      },
    },
    {
      type: Tone.Vibrato,
      params: {
        maxDelay: 0.01,
        frequency: 5,
        depth: 0.1,
        type: 'sine',
      },
    },
  ],
  dynamicParams: [
    {
      name: 'attack',
      target: 'instrument',
      default: 25,
      func: setSynthEnvelopeParam('attack', 0.1, 1),
    },
    {
      name: 'decay',
      target: 'instrument',
      default: 10,
      func: setSynthEnvelopeParam('decay', 0.5, 2),
    },
    {
      name: 'space',
      target: 'effect',
      default: 10,
      func: setEffectWet(0),
    },
    {
      name: 'vibrato',
      target: 'effect',
      default: 15,
      func: setEffectWet(1, 'depth', 0, 0.2),
    },
  ],
};
