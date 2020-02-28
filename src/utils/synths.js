import { SYNTH_TYPES, SYNTH_PRESETS } from 'instrumentPresets';

export const DEFAULT_SYNTHS = [
  SYNTH_TYPES.PIANO,
  SYNTH_TYPES.JARZO2,
  SYNTH_TYPES.CELLO,
  SYNTH_TYPES.DUO,
  SYNTH_TYPES.BLIP,
];

export const getDefaultParamValues = synthType => {
  const { dynamicParams } = SYNTH_PRESETS[synthType];
  return dynamicParams.map(param => param.default);
};
