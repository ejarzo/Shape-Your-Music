import { gql } from 'apollo-boost';

export const ProjectFragment = gql`
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
    shapesList {
      points
      isMuted
      colorIndex
      volume
      quantizeFactor
    }
    userId
    userName
  }
`;

export const GET_ALL_PROJECTS = gql`
  query AllProjects {
    allProjects {
      data {
        _id
        _ts
        dateCreated
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
      ...ProjectFragment
    }
  }
  ${ProjectFragment}
`;
