import Tone from 'tone';
import { setSynthParam, setSynthEnvelopeParam, setEffectWet } from './utils';

export default {
  name: 'Keys',
  baseSynth: Tone.Synth,
  params: {
    portamento: 0,
    oscillator: {
      detune: 0,
      type: 'custom',
      partials: [2, 1, 2, 2],
      phase: 0,
      volume: -6,
    },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.2,
      release: 1,
    },
  },
  effects: [
    {
      type: Tone.Freeverb,
      params: {
        roomSize: 0.8,
        dampening: 1500,
        wet: 1,
      },
    },
    {
      type: Tone.FeedbackDelay,
      params: {
        delayTime: 0.7,
        feedback: 0.8,
        wet: 1,
      },
    },
  ],
  dynamicParams: [
    {
      name: 'glide',
      default: 0,
      target: 'instrument',
      func: setSynthParam('portamento', 0, 0.5),
    },
    {
      name: 'attack',
      default: 0.05,
      target: 'instrument',
      func: setSynthEnvelopeParam('attack', 0.05, 1),
    },
    {
      name: 'space',
      default: 10,
      target: 'effect',
      func: setEffectWet(0),
    },
    {
      name: 'delay',
      default: 5,
      target: 'effect',
      func: setEffectWet(1),
    },
  ],
};
