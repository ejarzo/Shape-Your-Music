import React from 'react';
import ShapeContainer from './Container';
import { ProjectContext } from 'views/Project/Container';

export default props => (
  <ProjectContext.Consumer>
    {project => <ShapeContainer project={project} {...props} />}
  </ProjectContext.Consumer>
);
