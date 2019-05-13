import { getEndpoint } from './utils';

export const createProject = data => {
  return fetch(getEndpoint('project-create'), {
    body: JSON.stringify(data),
    method: 'POST',
  }).then(response => {
    return response.json();
  });
};
