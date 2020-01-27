const {
  ApolloServer,
  AuthenticationError,
  ApolloError,
} = require('apollo-server-lambda');
const { GraphQLClient } = require('graphql-request');
const { typeDefs } = require('./utils/schema');
const { allProjects, findProjectByID } = require('./utils/queries');
const { updateProject, createProject } = require('./utils/mutations');

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
      if (!response.findProjectByID) {
        throw new ApolloError('Project not found');
      }
      return response.findProjectByID;
    },
  },
  Mutation: {
    updateProject: async (_, variables, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not Logged In');
      }
      const { userId: loggedInUserId, userName } = user;
      const { id, data } = variables;

      const {
        findProjectByID: { userId },
      } = await client.request(findProjectByID, { id });

      if (loggedInUserId !== userId) {
        throw new AuthenticationError('Not authorized');
      }

      const response = await client.request(updateProject, {
        id,
        data: {
          ...data,
          userId: loggedInUserId,
          userName,
        },
      });
      return response.updateProject;
    },
    createProject: async (_, variables, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not Logged In');
      }
      const { userId, userName } = user;
      const { data } = variables;

      const response = await client.request(createProject, {
        data: {
          ...data,
          userId,
          userName,
        },
      });
      return response.createProject;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ context }) => {
    const { user } = context.clientContext || {};
    if (!user) return { user: null };

    const { sub: userId, user_metadata } = user;
    const userName = user_metadata.full_name;
    return { user: { userId, userName } };
  },
});

exports.handler = server.createHandler();
