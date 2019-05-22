import { fetch } from './utils';

export const createProject = data => {
  return fetch('project-create', {
    body: JSON.stringify(data),
    method: 'POST',
  })
    .then(response => {
      console.log(response);
      return response.json();
    })
    .catch(error => {
      console.log('error!');
      console.log(error);
    });
};
