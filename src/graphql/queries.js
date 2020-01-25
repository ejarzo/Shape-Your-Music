import { gql } from 'apollo-boost';

export const GET_ALL_PROJECTS = gql`
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

export const GET_PROJECT = gql`
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
  }
`;
