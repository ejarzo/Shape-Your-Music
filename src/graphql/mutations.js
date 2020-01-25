import { gql } from 'apollo-boost';

export const CREATE_PROJECT = gql`
  mutation CreateProject($data: ProjectCreateInput!) {
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

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $data: ProjectUpdateInput!) {
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
