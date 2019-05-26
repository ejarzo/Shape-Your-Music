import React from 'react';
import FileManager from './FileManager';
import AudioManager from './AudioManager';
import ProjectContainer from './Container';

class Project extends React.Component {
  render() {
    console.log('project render. projectId:', this.props.projectId);
    const { projectId } = this.props;
    return (
      <FileManager projectId={projectId}>
        {props => (
          <AudioManager>
            {audioProps => <ProjectContainer {...props} {...audioProps} />}
          </AudioManager>
        )}
      </FileManager>
    );
  }
}

export default Project;
