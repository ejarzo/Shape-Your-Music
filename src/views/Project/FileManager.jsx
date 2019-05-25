import React from 'react';
import { Component } from 'react';
import { createProject, readProject, updateProject } from 'middleware';
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
      const result = await readProject(projectId);
      const { data } = result;
      if (data) {
        console.log('loaded project', data);
        this.setState({
          loadedProject: data,
        });
      } else {
        console.log('_______ ERROR _______');
        console.log(result);
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
      const projectSaveData = getProjectSaveData(project);
      if (projectId) {
        // UPDATE project
        console.log('updating project', projectId);
        updateProject({ data: projectSaveData, id: projectId });
      } else {
        // CREATE project
        console.log('Saving new project');
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
    console.log('LOADED PROJECT', loadedProject);
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
