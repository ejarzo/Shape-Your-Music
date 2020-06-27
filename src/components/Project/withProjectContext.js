import React from 'react';
import ProjectContextConsumer from './ProjectContextConsumer';

export default Component => props => (
  <ProjectContextConsumer>
    {projectContext => <Component {...props} {...projectContext} />}
  </ProjectContextConsumer>
);
