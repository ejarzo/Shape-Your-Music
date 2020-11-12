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
        _id
        _ts
        dateCreated
        name
        userId
        userName
        shapesList {
          points
          isMuted
          colorIndex
          # quantizeFactor
        }
      }
    }
  }
`;

export const projectByUserId = `
  query ProjectsByUserId($userId: String!) {
    projectsByUserId(userId: $userId) {
      data {
        _id
        _ts
        dateCreated
        name
        userId
        userName
        shapesList {
          points
          isMuted
          colorIndex
          # quantizeFactor
        }
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
