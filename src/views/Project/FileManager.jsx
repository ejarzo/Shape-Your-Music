import React from 'react';
import { Component } from 'react';
import { createProject, readProject } from 'middleware';
import Loading from 'components/Loading';

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
      const project = await readProject(projectId);
      console.log('loaded project', project);
      this.setState({
        loadedProject: project && project.data,
      });
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
        const {
          name,
          tempo,
          scaleObj,
          isGridActive,
          isSnapToGridActive,
          isAutoQuantizeActive,
        } = project;
        const projectData = {
          name,
          tempo,
          tonic: scaleObj.tonic.toString(),
          scale: scaleObj.name.toString(),
          isGridActive,
          isSnapToGridActive,
          isAutoQuantizeActive,
        };
        console.log(projectData);
        createProject(projectData);
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
    console.log('loadedProject', loadedProject);
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
