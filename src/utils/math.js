export const dist = (x0, y0, x1, y1) => {
  return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
};

export const convertValToRange = (oldVal, oldMin, oldMax, newMin, newMax) => {
  return ((oldVal - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
};

export const convertToLogScale = (
  position,
  { max = 20000, min = 200 } = {}
) => {
  // position will be between 0 and 100
  const minp = 0;
  const maxp = 100;

  // The result should be between 100 an 10000000
  const minv = Math.log(min);
  const maxv = Math.log(max);

  // calculate adjustment factor
  const scale = (maxv - minv) / (maxp - minp);
  const result = Math.exp(minv + scale * (position - minp));
  console.log('result', result);
  return result;
};
