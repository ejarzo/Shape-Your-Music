import Tone from 'tone';
import Utils from 'utils/Utils';

const setSynthParam = (property, min, max) => (shape, val) => {
  shape.synth.set(property, Utils.convertValToRange(val, 0, 100, min, max));
};

const setSynthEnvelopeParam = (property, min, max) => (shape, val) => {
  shape.synth.envelope.set(
    property,
    Utils.convertValToRange(val, 0, 100, min, max)
  );
};

const setEffectWet = effectIndex => (colorController, val) => {
  colorController.setEffectAmount(
    effectIndex,
    Utils.convertValToRange(val, 0, 100, 0, 1),
    'wet'
  );
};

/*
  An instrument has
  name: (label and value)
  baseSynth:
  params:
  effects:
  dynamicParams
*/
const InstrumentPresets = [
  // KEYS ======================================================
  {
    name: {
      label: 'Keys',
      value: 0,
    },
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
        attack: 0.005,
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
        default: 0.1,
        target: 'instrument',
        func: setSynthEnvelopeParam('attack', 0.001, 1),
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
  },

  // JARZ0 1 ===================================================
  {
    name: {
      label: 'jarz01',
      value: 1,
    },
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
            Utils.convertValToRange(val, 0, 100, 1, 0)
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
            Utils.convertValToRange(val, 0, 100, 0, 20)
          );
          shape.synth.voice0.oscillator.set(
            'detune',
            Utils.convertValToRange(val / 100, 0, 100, 0, 20)
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
  },

  // DUO =======================================================
  {
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
  },
];

export default InstrumentPresets;
