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
      name
      tempo
      scale
      _id
      isSnapToGridActive
      isAutoQuantizeActive
      tonic
      isGridActive
      userId
      shapesList {
        points
        isMuted
        colorIndex
        volume
      }
      userName
      _ts
    }
  }
`;
