import Tone from 'tone';
import { setSynthParam, setEffectWet } from './utils';

export default {
  name: {
    label: 'Duo',
    value: 2,
  },
  baseSynth: Tone.DuoSynth,
  params: {},
  effects: [
    {
      type: Tone.Chorus,
      params: {
        frequency: 1.5,
        delayTime: 3.5,
        depth: 0.9,
        feedback: 0.1,
        type: 'sine',
        spread: 180,
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
      name: 'chorus',
      default: 20,
      target: 'effect',
      func: setEffectWet(0),
    },
    {
      name: 'vibrato',
      default: 10,
      target: 'instrument',
      func: setSynthParam('vibratoAmount', 0, 1),
    },
    {
      name: 'harmonicity',
      default: 0,
      target: 'instrument',
      func: setSynthParam('harmonicity', 0, 3),
    },
  ],
};
