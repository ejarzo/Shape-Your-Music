import { fetch } from './utils';

export const createProject = async data => {
  try {
    const response = await fetch('project-create', {
      body: JSON.stringify(data),
      method: 'POST',
    });
    return response.json();
  } catch (error) {
    console.log('error!');
    console.log(error);
  }
};
