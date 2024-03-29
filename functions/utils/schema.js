// APOLLO SERVER SCHEMA
import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  scalar Long
  scalar Time

  enum Synth {
    KEYS
    JARZO
    DUO
    BLIP
    CELLO
    SUB_BASS
    JARZO2
    PIANO
  }

  type Query {
    allProjects(_size: Int, _cursor: String): ProjectPage!
    myProjects(_size: Int, _cursor: String): ProjectPage!
    allProjectsSortedByDateCreated(_size: Int, _cursor: String): ProjectPage!
    findProjectByID(id: ID!): Project
  }

  type Mutation {
    createProject(data: ProjectCreateInput!): Project!
    updateProject(id: ID!, data: ProjectUpdateInput!): Project
    deleteProject(id: ID!): Project
  }

  type Project {
    _id: ID!
    _ts: Long!
    name: String!
    tempo: Int!
    scale: String!
    isSnapToGridActive: Boolean!
    isAutoQuantizeActive: Boolean!
    isProximityModeActive: Boolean
    proximityModeRadius: Int
    tonic: String!
    isGridActive: Boolean!
    shapesList: [Shape!]
    selectedSynths: [Synth!]
    userName: String!
    userId: String!
    dateCreated: Long
    knobVals: [[Float!]]
  }

  input ProjectCreateInput {
    name: String!
    tempo: Int!
    tonic: String!
    scale: String!
    isGridActive: Boolean!
    isSnapToGridActive: Boolean!
    isAutoQuantizeActive: Boolean!
    isProximityModeActive: Boolean!
    proximityModeRadius: Int!
    shapesList: [ShapeInput!]
    selectedSynths: [Synth!]
    dateCreated: Long
    knobVals: [[Float!]]
  }

  input ProjectUpdateInput {
    name: String
    tempo: Int
    tonic: String
    scale: String
    isGridActive: Boolean
    isSnapToGridActive: Boolean
    isAutoQuantizeActive: Boolean
    isProximityModeActive: Boolean!
    proximityModeRadius: Int!
    shapesList: [ShapeInput!]
    selectedSynths: [Synth!]
    dateCreated: Long
    knobVals: [[Float!]]
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
    quantizeFactor: Float
  }

  input ShapeInput {
    points: [Float!]
    colorIndex: Int!
    volume: Int!
    isMuted: Boolean
    quantizeFactor: Float
  }
`;
