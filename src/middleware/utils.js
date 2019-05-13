const ENDPOINT = '/.netlify/functions';
export const getEndpoint = path => `${ENDPOINT}/${path}`;
