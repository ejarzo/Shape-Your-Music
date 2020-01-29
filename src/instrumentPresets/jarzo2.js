import Tone from 'tone';
import { setEffectWet } from './utils';
import { convertValToRange } from 'utils/math';

export default {
  name: 'Wavy',
  baseSynth: Tone.DuoSynth,
  params: {
    vibratoAmount: 0,
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
        decay: 2,
        sustain: 0,
        release: 0.02,
      },
      envelope: {
        attack: 2,
        decay: 1,
        sustain: 0,
        release: 0.02,
      },
    },
    voice1: {
      volume: -5,
      portamento: 0,
      oscillator: {
        type: 'square',
        detune: -20,
      },
      filterEnvelope: {
        attack: 2,
        decay: 0.4,
        sustain: 0.2,
        release: 0.02,
      },
      envelope: {
        attack: 1,
        decay: 0.4,
        sustain: 0,
        release: 0.02,
      },
    },
  },
  effects: [
    {
      type: Tone.Freeverb,
      params: {
        roomSize: 0.8,
        dampening: 3000,
        wet: 0.4,
      },
    },
    {
      type: Tone.Tremolo,
      start: true,
      params: {
        frequency: 6,
        depth: 0.8,
        spread: 1,
        wet: 1,
      },
    },
    {
      type: Tone.Filter,
      params: {
        frequency: 4500,
        type: 'lowpass',
        Q: 10,
        wet: 1,
      },
    },
  ],
  dynamicParams: [
    {
      name: 'Space',
      default: 40,
      target: 'effect',
      func: setEffectWet(0),
    },
    {
      name: 'Pulse',
      default: 90,
      target: 'effect',
      func: setEffectWet(1),
    },
    {
      name: 'Pulse Rate',
      default: 50,
      target: 'effect',
      func: (colorController, val) => {
        colorController.setEffectAmount(
          1,
          convertValToRange(val, 0, 100, 0, 10),
          'frequency'
        );
      },
    },
    {
      name: 'Brightness',
      default: 50,
      target: 'effect',
      func: (colorController, val) => {
        colorController.setEffectAmount(
          2,
          convertValToRange(val, 0, 100, 20, 10000),
          'frequency'
        );
      },
    },
  ],
};
