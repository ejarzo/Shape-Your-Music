import faunadb from 'faunadb';

const getServerSecret = () =>
  process.env.CONTEXT === 'deploy-preview' ||
  process.env.CONTEXT === 'branch-deploy'
    ? process.env.FAUNADB_SERVER_SECRET_STAGING
    : process.env.FAUNADB_SERVER_SECRET;

console.log('context', process.env.CONTEXT);
console.log('server secret', getServerSecret());

export const getFauna = () => ({
  q: faunadb.query,
  client: new faunadb.Client({
    secret: getServerSecret(),
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
