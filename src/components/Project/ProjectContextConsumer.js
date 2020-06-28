import React from 'react';

import { ProjectContext } from './ProjectContextProvider';

export default ({ children, value }) => (
  <ProjectContext.Consumer>{value => children(value)}</ProjectContext.Consumer>
);
