import { gql } from 'apollo-boost';
import { ProjectFragment } from './queries';

export const CREATE_PROJECT = gql`
  mutation CreateProject($data: ProjectCreateInput!) {
    createProject(data: $data) {
      ...ProjectFragment
    }
  }
  ${ProjectFragment}
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $data: ProjectUpdateInput!) {
    updateProject(id: $id, data: $data) {
      ...ProjectFragment
    }
  }
  ${ProjectFragment}
`;
