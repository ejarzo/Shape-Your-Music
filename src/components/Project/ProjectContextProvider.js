import React from 'react';

export const ProjectContext = React.createContext({});

export default ({ children, value }) => (
  <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
);
