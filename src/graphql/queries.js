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
    isProximityModeActive
    proximityModeRadius
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
    userId
    userName
  }
`;

export const GET_ALL_PROJECTS = gql`
  query AllProjects {
    allProjects {
      data {
        ...ProjectFragment
      }
    }
  }
  ${ProjectFragment}
`;

export const GET_ALL_PROJECTS_SORTED_BY_DATE_CREATED = gql`
  query AllProjectsSortedByDateCreated($_size: Int, $_cursor: String) {
    allProjectsSortedByDateCreated(_size: $_size, _cursor: $_cursor) {
      before
      after
      data {
        ...ProjectFragment
      }
    }
  }
  ${ProjectFragment}
`;

export const GET_MY_PROJECTS = gql`
  query MyProjects {
    myProjects {
      data {
        ...ProjectFragment
      }
    }
  }
  ${ProjectFragment}
`;

export const GET_PROJECT = gql`
  query FindProjectByID($id: ID!) {
    findProjectByID(id: $id) {
      ...ProjectFragment
    }
  }
  ${ProjectFragment}
`;
