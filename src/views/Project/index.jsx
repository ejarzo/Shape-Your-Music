import React from 'react';
import FileManager from './FileManager';
import ProjectContainer from './Container';

class Project extends React.Component {
  render() {
    console.log('project render. projectId:', this.props.projectId);
    const { projectId } = this.props;
    return (
      <FileManager projectId={projectId}>
        {props => <ProjectContainer {...props} />}
      </FileManager>
    );
  }
}

export default Project;
