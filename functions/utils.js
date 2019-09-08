import faunadb from 'faunadb';

export const getFauna = () => ({
  q: faunadb.query,
  client: new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  }),
});

export const getId = urlPath => urlPath.match(/([^\/]*)\/*$/)[0];
export const getUserName = user => user && user.user_metadata.full_name;

export const getProjectPreviewData = ({ name, userName }) => ({
  name,
  userName,
});

export const withErrorWrapper = callback => async (event, context) => {
  try {
    return await callback(event, context);
  } catch (err) {
    console.log('GOT ERROR', err.name);
    console.log('ERROR MESSAGE:', err.message);
    try {
      return {
        statusCode: err.requestResult.statusCode,
        body: JSON.stringify(err),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify(err),
      };
    }
  }
};
