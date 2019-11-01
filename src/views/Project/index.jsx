import React from 'react';
import FileManager from './FileManager';
import AudioManager from './AudioManager';
import ProjectContainer from './Container';
import { withData, readProject } from 'middleware';

import { CurrentUserContextConsumer } from 'context/CurrentUserContext';

class Project extends React.Component {
  render() {
    console.log('project render. projectId:', this.props.projectId);
    const { projectId } = this.props;

    const FileManagerWithData = !!projectId
      ? withData('READ_PROJECT', () => readProject(projectId))(FileManager)
      : FileManager;

    return (
      <CurrentUserContextConsumer>
        {currentUser => (
          <FileManagerWithData projectId={projectId} {...currentUser}>
            {props => (
              <AudioManager>
                {audioProps => <ProjectContainer {...props} {...audioProps} />}
              </AudioManager>
            )}
          </FileManagerWithData>
        )}
      </CurrentUserContextConsumer>
    );
  }
}

export default Project;
