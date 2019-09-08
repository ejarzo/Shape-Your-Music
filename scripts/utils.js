module.exports = {
  getServerSecret: () =>
    process.env.CONTEXT === 'deploy-preview' ||
    process.env.CONTEXT === 'branch-deploy'
      ? process.env.FAUNADB_SERVER_SECRET_STAGING
      : process.env.FAUNADB_SERVER_SECRET,
};
