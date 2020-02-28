import Tone from 'tone';
import { setEffectWet } from '../utils';

import A0 from './samples/GrandPiano-A0.mp3';
import A1 from './samples/GrandPiano-A1.mp3';
import A2 from './samples/GrandPiano-A2.mp3';
import A3 from './samples/GrandPiano-A3.mp3';
import A4 from './samples/GrandPiano-A4.mp3';
import C1 from './samples/GrandPiano-C1.mp3';
import C2 from './samples/GrandPiano-C2.mp3';
import C3 from './samples/GrandPiano-C3.mp3';
import C4 from './samples/GrandPiano-C4.mp3';
import C5 from './samples/GrandPiano-C5.mp3';
import FSHARP1 from './samples/GrandPiano-Fsharp1.mp3';
import FSHARP2 from './samples/GrandPiano-Fsharp2.mp3';
import FSHARP3 from './samples/GrandPiano-Fsharp3.mp3';
import FSHARP4 from './samples/GrandPiano-Fsharp4.mp3';
import FSHARP5 from './samples/GrandPiano-Fsharp5.mp3';

export default {
  name: 'Piano',
  baseSynth: Tone.Sampler,
  params: {
    A0,
    A1,
    A2,
    A3,
    A4,
    C1,
    C2,
    C3,
    C4,
    C5,
    'F#1': FSHARP1,
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
    { name: 'nothing' },
    { name: 'something' },
  ],
};
