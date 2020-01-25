export const DEFAULT_PROJECT = {
  projectName: '',
  tempo: 50,
  tonic: 'a',
  scale: 'major',
};

export const getProjectSaveData = projectData => {
  const {
    name,
    tempo,
    scaleObj,
    isGridActive,
    isSnapToGridActive,
    isAutoQuantizeActive,
    shapesList,
  } = projectData;

  /* TODO: save selected instruments and knob values */
  return {
    name,
    tempo,
    tonic: scaleObj.tonic.toString(),
    scale: scaleObj.name.toString(),
    isGridActive,
    isSnapToGridActive,
    isAutoQuantizeActive,
    shapesList,
  };
};

export const getProjectIdFromResponse = project => project.ref['@ref'].id;
