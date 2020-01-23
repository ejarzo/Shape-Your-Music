export const updateProject = `
  mutation UpdateProject($id: ID!, $data: ProjectInput!) {
    updateProject(id: $id, data: $data) {
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
        data {
          _id
          points
          isMuted
          colorIndex
          volume
        }
      }
      userName
      _ts
    }
  }
`;

export const createProject = `
  mutation CreateProject($data: ProjectInput!) {
    createProject(data: $data) {
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
        data {
          _id
          points
          isMuted
          colorIndex
          volume
        }
      }
      userName
      _ts
    }
  }
`;
