import { getCurrentUser, getToken } from 'utils/user';

const ENDPOINT = '/.netlify/functions';
const browserFetch = window.fetch;

export const getEndpoint = path => `${ENDPOINT}/${path}`;

export const fetch = async (endpoint, options = {}) => {
  const currentUser = getCurrentUser();
  console.log('USER', currentUser);

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
    const { status, statusText } = response;
    if (status === 200) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } else throw new Error(statusText);
  } catch (e) {
    console.log('ERROR', e);
    throw e;
  }
};
