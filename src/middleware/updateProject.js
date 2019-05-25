import { fetch } from './utils';

export const updateProject = ({ data, id }) => {
  return fetch(`project-update/${id}`, {
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
