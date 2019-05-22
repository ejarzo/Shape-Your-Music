import React from 'react';
import { Component } from 'react';
import { createProject, readProject } from 'middleware';
import Loading from 'components/Loading';
import { getProjectSaveData } from 'utils/project';

const DEFAULT_PROJECT = {
  name: 'My Project',
  tempo: 50,
  tonic: 'a',
  scale: 'major',
};

class ProjectFileManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedProject: null,
      projectId: props.projectId,
    };
    this.getSaveProject = this.getSaveProject.bind(this);
  }

  async componentDidMount() {
    const { projectId } = this.props;
    if (projectId) {
      const { data, responseCode } = await readProject(projectId);
      if (responseCode === 200) {
        console.log('loaded project', data);
        this.setState({
          loadedProject: data,
        });
      } else {
        // TODO handle error
        this.setState({
          loadedProject: {},
        });
      }
    }
  }

  getSaveProject(projectId) {
    return project => {
      console.log(project);
      if (projectId) {
        // UPDATE project
        console.log('updating project', projectId);
      } else {
        console.log('Saving new project');
        const projectSaveData = getProjectSaveData(project);
        createProject(projectSaveData);
      }
    };
  }

  render() {
    const { children, projectId } = this.props;

    if (!projectId) {
      return children({
        initState: DEFAULT_PROJECT,
        saveProject: this.getSaveProject(),
      });
    }

    const { loadedProject } = this.state;

    if (!loadedProject) {
      return <Loading />;
    }

    return children({
      initState: { ...DEFAULT_PROJECT, ...loadedProject },
      saveProject: this.getSaveProject(projectId),
    });
  }
}

export default ProjectFileManager;
