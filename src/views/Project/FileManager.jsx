import { withRouter } from 'react-router';
import { Component } from 'react';
import { message } from 'antd';
import { createProject, updateProject } from 'middleware';
import { getProjectSaveData, getProjectIdFromResponse } from 'utils/project';
import { getUserName } from 'utils/user';

message.config({
  top: 90,
});

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
      const hideLoadingMessage = message.loading('Saving..');
      const { history, user, authenticate } = this.props;
      const { isPlaying } = project;
      const projectSaveData = getProjectSaveData(project);

      const saveNewProject = async () => {
        const newProject = await createProject(projectSaveData);
        const id = getProjectIdFromResponse(newProject);
        history.push(`/project/${id}`);
        hideLoadingMessage();
        message.success('Saved new project!');
      };

      if (projectId) {
        // Update project if it already exists
        await updateProject({
          data: projectSaveData,
          id: projectId,
          onError: e => {
            hideLoadingMessage();
            message.error(`Error: ${e.message}`);
          },
          onSuccess: () => {
            hideLoadingMessage();
            message.success('Saved project!');
          },
        });
      } else {
        if (
          !isPlaying ||
          window.confirm('This action will stop audio. Proceed?')
        ) {
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
          name: getUserName(user),
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
