const {
  ApolloServer,
  gql,
  AuthenticationError,
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
      const {
        id,
        data: { shapesList },
      } = variables;

      const {
        findProjectByID: { userId, shapesList: originalShapesList },
      } = await client.request(findProjectByID, { id });

      if (loggedInUserId !== userId) {
        throw new AuthenticationError('Not authorized');
      }

      const shapesListRelation = {
        create: shapesList,
        disconnect: originalShapesList.data.map(({ _id }) => _id),
      };

      const response = await client.request(updateProject, {
        id,
        data: {
          ...variables.data,
          shapesList: shapesListRelation,
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

      const { sub: loggedInUserId, user_metadata } = user;
      const userName = user_metadata.full_name;
      const {
        data: { shapesList },
      } = variables;

      const shapesListRelation = {
        create: shapesList,
      };

      const response = await client.request(createProject, {
        data: {
          ...variables.data,
          shapesList: shapesListRelation,
          userId: loggedInUserId,
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
    return { user };
  },
});

exports.handler = server.createHandler();
