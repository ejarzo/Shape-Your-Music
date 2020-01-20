const { ApolloServer, gql } = require('apollo-server-lambda');
const { GraphQLClient } = require('graphql-request');
const { typeDefs } = require('./utils/schema');
const { allProjects } = require('./utils/queries');

const FAUNADB_API = 'https://graphql.fauna.com/graphql';

const client = new GraphQLClient(FAUNADB_API, {
  headers: {
    authorization: `Bearer ${process.env.FAUNADB_SERVER_SECRET}`,
  },
});

const resolvers = {
  Query: {
    allProjects: async () => {
      const response = await client.request(allProjects);
      console.log('RESPONSE', response);
      return response.allProjects;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler();
