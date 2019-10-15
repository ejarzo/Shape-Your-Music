import { SYNTH_TYPES, SYNTH_PRESETS } from 'instrumentPresets';

export const getDefaultSynths = () => [
  SYNTH_TYPES.KEYS,
  SYNTH_TYPES.JARZO,
  SYNTH_TYPES.CELLO,
  SYNTH_TYPES.DUO,
  SYNTH_TYPES.BLIP,
];

export const getDefaultParamValues = synthType => {
  const { dynamicParams } = SYNTH_PRESETS[synthType];
  return dynamicParams.map(param => param.default);
};
