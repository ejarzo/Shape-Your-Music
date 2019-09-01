import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';

export const formatTimestamp = ts =>
  format(fromUnixTime(ts / 1000000), 'MMM d, YYY');
