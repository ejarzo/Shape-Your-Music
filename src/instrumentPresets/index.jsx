import { map } from 'lodash';
import keys from './keys';
import duo from './duo';
import jarzo from './jarzo';
import blip from './blip';
import cello from './cello';
import subBass from './subBass';
import jarzo2 from './jarzo2';
import piano from './piano';

export const SYNTH_TYPES = {
  KEYS: 'KEYS',
  JARZO: 'JARZO',
  DUO: 'DUO',
  BLIP: 'BLIP',
  CELLO: 'CELLO',
  SUB_BASS: 'SUB_BASS',
  JARZO2: 'JARZO2',
  PIANO: 'PIANO',
};

export const SYNTH_PRESETS = {
  [SYNTH_TYPES.KEYS]: keys,
  [SYNTH_TYPES.JARZO]: jarzo,
  [SYNTH_TYPES.DUO]: duo,
  [SYNTH_TYPES.BLIP]: blip,
  [SYNTH_TYPES.CELLO]: cello,
  [SYNTH_TYPES.SUB_BASS]: subBass,
  [SYNTH_TYPES.JARZO2]: jarzo2,
  [SYNTH_TYPES.PIANO]: piano,
};

export const ALL_SYNTHS = map(SYNTH_TYPES, key => ({
  value: key,
  label: SYNTH_PRESETS[key].name,
}));
