export const dist = (x0, y0, x1, y1) => {
  return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
};

export const convertValToRange = (oldVal, oldMin, oldMax, newMin, newMax) => {
  return ((oldVal - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
};
