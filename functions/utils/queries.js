export const PROJECT_FRAGMENT = `
  fragment ProjectFragment on Project {
    name
    tempo
    scale
    _id
    isSnapToGridActive
    isAutoQuantizeActive
    tonic
    isGridActive
    userId
    selectedSynths
    shapesList {
      points
      isMuted
      colorIndex
      volume
    }
    userName
    _ts
  }
`;

export const allProjects = `
  query AllProjects {
    allProjects {
      data {
        _id
        _ts
        name
        userId
        userName
      }
    }
  }
`;

export const findProjectByID = `
  query FindProjectByID($id: ID!) {
    findProjectByID(id: $id) {
      ...ProjectFragment
    }
  }
  ${PROJECT_FRAGMENT}
`;
