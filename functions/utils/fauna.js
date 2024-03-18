import faunadb from 'faunadb';
import * as Sentry from '@sentry/node';
import { initSentry, captureError } from './errors';

initSentry();

export const getFauna = () => ({
  q: faunadb.query,
  client: new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  }),
});

export const getId = urlPath => urlPath.match(/([^\/]*)\/*$/)[0];
export const getUserName = user => user && user.user_metadata.full_name;

export const getProjectPreviewData = ({
  name,
  userName,
  shapesList,
  dateCreated,
}) => {
  return {
    name,
    userName,
    dateCreated,
    shapesList,
  };
};

export const withErrorWrapper = callback => async (event, context) => {
  try {
    return await callback(event, context);
  } catch (err) {
    console.log('GOT ERROR', err.name);
    console.log('ERROR MESSAGE:', err.message);

    captureError(err, context);
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
