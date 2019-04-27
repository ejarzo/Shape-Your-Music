const ENDPOINT = '/.netlify/functions';

const getEndpoint = path => `${ENDPOINT}/${path}`;

export const testLambdaFunction = async data => {
  try {
    const response = await fetch(getEndpoint('test'), {
      body: JSON.stringify(data),
      method: 'POST',
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (e) {
    console.log('ERROR', e);
    return {};
  }
};
