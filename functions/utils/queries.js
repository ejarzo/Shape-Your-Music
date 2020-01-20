export const allProjects = `
  query AllProjects {
    allProjects {
      data {
        _id
        _ts
        name
        userId
        userName
      }
    }
  }
`;
