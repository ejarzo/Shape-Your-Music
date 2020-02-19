import { PROJECT_FRAGMENT } from './queries';

export const updateProject = `
  mutation UpdateProject($id: ID!, $data: ProjectInput!) {
    updateProject(id: $id, data: $data) {
      ...ProjectFragment
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const createProject = `
  mutation CreateProject($data: ProjectInput!) {
    createProject(data: $data) {
      ...ProjectFragment
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const deleteProject = `
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      ...ProjectFragment
    }
  }
  ${PROJECT_FRAGMENT}
`;
