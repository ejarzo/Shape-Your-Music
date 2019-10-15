import { map } from 'lodash';
import keys from './keys';
import duo from './duo';
import jarzo from './jarzo';
import blip from './blip';
import cello from './cello';

export const SYNTH_TYPES = {
  KEYS: 'KEYS',
  JARZO: 'JARZO',
  DUO: 'DUO',
  BLIP: 'BLIP',
  CELLO: 'CELLO',
};

export const SYNTH_PRESETS = {
  [SYNTH_TYPES.KEYS]: keys,
  [SYNTH_TYPES.JARZO]: jarzo,
  [SYNTH_TYPES.DUO]: duo,
  [SYNTH_TYPES.BLIP]: blip,
  [SYNTH_TYPES.CELLO]: cello,
};

export const ALL_SYNTHS = map(SYNTH_TYPES, key => ({
  value: key,
  label: SYNTH_PRESETS[key].name,
}));
