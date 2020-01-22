const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require('apollo-server-lambda');
const { GraphQLClient } = require('graphql-request');
const { typeDefs } = require('./utils/schema');
const { allProjects, findProjectByID } = require('./utils/queries');
const { updateProject } = require('./utils/mutations');

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
      return response.allProjects;
    },
    findProjectByID: async (_, variables) => {
      const response = await client.request(findProjectByID, variables);
      return response.findProjectByID;
    },
  },
  Mutation: {
    updateProject: async (_, variables, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not Logged In');
      }

      const { sub: loggedInUserId, user_metadata } = user;
      const userName = user_metadata.full_name;
      const { id } = variables;

      const {
        findProjectByID: { userId },
      } = await client.request(findProjectByID, { id });

      if (loggedInUserId !== userId) {
        throw new AuthenticationError('Not authorized');
      }

      const response = await client.request(updateProject, {
        id,
        data: {
          ...variables.data,
          userId: loggedInUserId,
          userName,
        },
      });
      return response.updateProject;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ context }) => {
    const { user } = context.clientContext || {};
    return { user };
  },
});

exports.handler = server.createHandler();
