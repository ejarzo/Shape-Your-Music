import { fetch } from './utils';

export const createProject = async data => {
  try {
    const response = await fetch('project-create', {
      body: JSON.stringify(data),
      method: 'POST',
    });
    const { ok } = response;
    if (ok) {
      return response.json();
    } else {
      const { status, statusText } = response;
      throw new Error(`${status} ${statusText}`);
    }
  } catch (error) {
    console.log('error!');
    console.log(error);
    throw error;
  }
};
