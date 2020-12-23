export const PROJECT_FRAGMENT = `
  fragment ProjectFragment on Project {
    _id
    _ts
    name
    tempo
    scale
    tonic
    isSnapToGridActive
    isAutoQuantizeActive
    isGridActive
    dateCreated
    selectedSynths
    knobVals
    shapesList {
      points
      isMuted
      colorIndex
      volume
      quantizeFactor
    }
    userName
    userId
  }
`;

export const allProjects = `
  query AllProjects {
    allProjects {
      data {
        ...ProjectFragment
      }
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const allProjectsSortedByDateCreated = `
  query AllProjectsSortedByDateCreated($_size: Int, $_cursor: String) {
    allProjectsSortedByDateCreated(_size: $_size, _cursor: $_cursor) {
      before
      after
      data {
        ...ProjectFragment
      }
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const projectByUserId = `
  query ProjectsByUserId($userId: String!) {
    projectsByUserId(userId: $userId) {
      data {
        ...ProjectFragment
      }
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const findProjectByID = `
  query FindProjectByID($id: ID!) {
    findProjectByID(id: $id) {
      ...ProjectFragment
    }
  }
  ${PROJECT_FRAGMENT}
`;
