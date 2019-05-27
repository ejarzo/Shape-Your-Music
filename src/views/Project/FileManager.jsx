import React from 'react';
import { withRouter } from 'react-router';
import { Component } from 'react';
import { createProject, readProject, updateProject } from 'middleware';
import Loading from 'components/Loading';
import { getProjectSaveData, getProjectIdFromResponse } from 'utils/project';

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
    return async project => {
      const { history, user, authenticate } = this.props;

      console.log(project);
      const projectSaveData = getProjectSaveData(project);

      const saveProject = async () => {
        console.log('Saving new project');
        const newProject = await createProject(projectSaveData);
        const id = getProjectIdFromResponse(newProject);
        history.push(`/project/${id}`);
      };

      if (projectId) {
        // UPDATE project
        console.log('updating project', projectId);
        updateProject({ data: projectSaveData, id: projectId });
      } else {
        // CREATE project
        if (!user) {
          authenticate({ onSuccess: saveProject });
        } else {
          saveProject();
        }
      }
    };
  }

  render() {
    const { children, projectId, user } = this.props;
    if (!projectId) {
      return children({
        initState: DEFAULT_PROJECT,
        saveProject: this.getSaveProject(),
        showSaveButton: true,
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
      showSaveButton: loadedProject.userId === user.id,
    });
  }
}

export default withRouter(ProjectFileManager);
