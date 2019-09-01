import { withRouter } from 'react-router';
import { Component } from 'react';
import { createProject, updateProject } from 'middleware';
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
    this.state = { projectId: props.projectId };
    this.getSaveProject = this.getSaveProject.bind(this);
  }

  getSaveProject(projectId) {
    return async project => {
      const { history, user, authenticate } = this.props;
      const projectSaveData = getProjectSaveData(project);

      const saveNewProject = async () => {
        console.log('Saving new project');
        const newProject = await createProject(projectSaveData);
        const id = getProjectIdFromResponse(newProject);
        history.push(`/project/${id}`);
      };

      if (projectId) {
        // Update project if it already exists
        console.log('updating project', projectId);
        updateProject({ data: projectSaveData, id: projectId });
      } else {
        /* TODO: only show this message if audio is playing */
        if (window.confirm('This action will stop audio. Proceed?')) {
          // Create new project and reload window
          if (!user) {
            authenticate({ onSuccess: saveNewProject });
          } else {
            saveNewProject();
          }
        }
      }
    };
  }

  render() {
    const { data, children, projectId, user } = this.props;

    if (!projectId) {
      return children({
        initState: DEFAULT_PROJECT,
        saveProject: this.getSaveProject(),
        showSaveButton: true,
        projectAuthor: user && {
          name: user.user_metadata.full_name,
          id: user.id,
        },
      });
    }

    return children({
      initState: { ...DEFAULT_PROJECT, ...data },
      saveProject: this.getSaveProject(projectId),
      showSaveButton: user && data && data.userId === user.id,
      projectAuthor: data && { name: data.userName, id: data.userId },
    });
  }
}

export default withRouter(ProjectFileManager);
