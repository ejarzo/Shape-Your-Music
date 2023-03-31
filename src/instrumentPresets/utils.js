import { convertValToRange } from 'utils/math';

export const setSynthParam = (property, min, max) => (shape, val) => {
  shape.synth.set({ [property]: convertValToRange(val, 0, 100, min, max) });
};

export const setSynthEnvelopeParam = (property, min, max) => (shape, val) => {
  shape.synth.envelope.set({
    [property]: convertValToRange(val, 0, 100, min, max),
  });
};

export const setEffectWet = (
  effectIndex,
  effectParam = 'wet',
  min = 0,
  max = 1
) => (colorController, val) => {
  colorController.setEffectAmount(
    effectIndex,
    convertValToRange(val, 0, 100, min, max),
    effectParam
  );
};
