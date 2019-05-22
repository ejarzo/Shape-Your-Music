import { fetch } from './utils';

export const readProject = async projectId => {
  try {
    const response = await fetch(`project-read/${projectId}`);
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (e) {
    console.log('ERROR', e);
    return null;
  }
};
