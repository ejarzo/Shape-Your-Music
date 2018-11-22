export const dist = (x0, y0, x1, y1) => {
  return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
};

export const convertValToRange = (oldVal, oldMin, oldMax, newMin, newMax) => {
  return ((oldVal - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
};

export const isEquivalent = (a, b) => {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {
    return false;
  }
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
};
