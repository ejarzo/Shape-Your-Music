import faunadb from 'faunadb';

export const getFauna = () => ({
  q: faunadb.query,
  client: new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  }),
});
