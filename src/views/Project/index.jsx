import React from 'react';
import FileManager from './FileManager';
import AudioManager from './AudioManager';
import ProjectContainer from './Container';
import { CurrentUserContextConsumer } from 'context/CurrentUserContext';
class Project extends React.Component {
  render() {
    console.log('project render. projectId:', this.props.projectId);
    const { projectId } = this.props;
    return (
      <CurrentUserContextConsumer>
        {currentUser => (
          <FileManager projectId={projectId} {...currentUser}>
            {props => (
              <AudioManager>
                {audioProps => <ProjectContainer {...props} {...audioProps} />}
              </AudioManager>
            )}
          </FileManager>
        )}
      </CurrentUserContextConsumer>
    );
  }
}

export default Project;
