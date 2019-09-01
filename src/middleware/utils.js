import { getCurrentUser, getToken } from 'utils/user';

const ENDPOINT = '/.netlify/functions';
const browserFetch = window.fetch;

export const getEndpoint = path => `${ENDPOINT}/${path}`;

export const fetch = async (endpoint, options = {}) => {
  const currentUser = getCurrentUser();
  const fetchOptions = currentUser
    ? {
        headers: {
          ...options.headers,
          Authorization: `Bearer ${getToken(currentUser)}`,
        },
        ...options,
      }
    : options;

  return browserFetch(getEndpoint(endpoint), fetchOptions);
};

export const readResult = async endpoint => {
  try {
    console.log('Reading', endpoint);
    const response = await fetch(endpoint);
    const { ok, statusText } = response;
    if (ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      return jsonResponse;
    } else throw new Error(statusText);
  } catch (e) {
    console.log('ERROR', e);
    throw e;
  }
};
