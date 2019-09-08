import { fetch } from './utils';

export const updateProject = async ({ data, id, onSuccess, onError }) => {
  try {
    const response = await fetch(`project-update/${id}`, {
      body: JSON.stringify(data),
      method: 'POST',
    });
    const { ok, statusText } = response;
    if (ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      onSuccess && onSuccess(jsonResponse);
      return jsonResponse;
    } else throw new Error(statusText);
  } catch (e) {
    console.log('ERROR', e.message);
    onError && onError(e);
    // throw e;
  }
};
