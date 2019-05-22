export const getProjectSaveData = projectData => {
  const {
    name,
    tempo,
    scaleObj,
    isGridActive,
    isSnapToGridActive,
    isAutoQuantizeActive,
  } = projectData;

  return {
    name,
    tempo,
    tonic: scaleObj.tonic.toString(),
    scale: scaleObj.name.toString(),
    isGridActive,
    isSnapToGridActive,
    isAutoQuantizeActive,
  };
};
