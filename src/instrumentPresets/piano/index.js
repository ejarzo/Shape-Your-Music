import Tone from 'tone';
import { setEffectWet } from '../utils';

const getUrl = note =>
  `https://raw.githubusercontent.com/ejarzo/Shape-Your-Music/master/src/instrumentPresets/piano/samples/GrandPiano-${note}.mp3`;

export default {
  name: 'Grand Piano',
  baseSynth: Tone.Sampler,
  params: {
    A0: getUrl('A0'),
    A1: getUrl('A1'),
    A2: getUrl('A2'),
    A3: getUrl('A3'),
    A4: getUrl('A4'),
    C1: getUrl('C1'),
    C2: getUrl('C2'),
    C3: getUrl('C3'),
    C4: getUrl('C4'),
    C5: getUrl('C5'),
    'F#1': getUrl('Fsharp1'),
    // 'F#2': FSHARP2,
    // 'F#3': FSHARP3,
    // 'F#4': FSHARP4,
    // 'F#5': FSHARP5,
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
    // { name: 'nothing' },
    // { name: 'something' },
  ],
};
