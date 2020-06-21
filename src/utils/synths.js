import { SYNTH_TYPES, SYNTH_PRESETS } from 'instrumentPresets';

export const DEFAULT_SYNTHS = [
  SYNTH_TYPES.KEYS,
  SYNTH_TYPES.JARZO2,
  SYNTH_TYPES.CELLO,
  SYNTH_TYPES.PIANO,
  SYNTH_TYPES.SUB_BASS,
];

export const getDefaultParamValues = synthType => {
  const { dynamicParams } = SYNTH_PRESETS[synthType];
  return dynamicParams.map(param => param.default);
};
