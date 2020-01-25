// APOLLO SERVER SCHEMA
import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  scalar Long
  scalar Time

  type Query {
    allProjects(_size: Int, _cursor: String): ProjectPage!
    findProjectByID(id: ID!): Project
  }

  type Mutation {
    createProject(data: ProjectCreateInput!): Project!
    updateProject(id: ID!, data: ProjectUpdateInput!): Project
    # deleteProject(id: ID!): Project
  }

  type Project {
    _id: ID!
    _ts: Long!
    name: String!
    tempo: Int!
    scale: String!
    isSnapToGridActive: Boolean!
    isAutoQuantizeActive: Boolean!
    tonic: String!
    isGridActive: Boolean!
    userId: String!
    shapesList: [Shape!]
    userName: String!
  }

  input ProjectCreateInput {
    name: String!
    tempo: Int!
    tonic: String!
    scale: String!
    isGridActive: Boolean!
    isSnapToGridActive: Boolean!
    isAutoQuantizeActive: Boolean!
    shapesList: [ShapeInput!]
  }

  input ProjectUpdateInput {
    name: String
    tempo: Int
    tonic: String
    scale: String
    isGridActive: Boolean
    isSnapToGridActive: Boolean
    isAutoQuantizeActive: Boolean
    shapesList: [ShapeInput!]
  }

  type ProjectPage {
    data: [Project]!
    after: String
    before: String
  }

  type Shape {
    points: [Float!]
    colorIndex: Int!
    volume: Int!
    isMuted: Boolean
  }

  input ShapeInput {
    points: [Float!]
    colorIndex: Int!
    volume: Int!
    isMuted: Boolean
  }
`;
