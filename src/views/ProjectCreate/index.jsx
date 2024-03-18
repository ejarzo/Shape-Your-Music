import React, { useContext } from 'react';
import { withRouter } from 'react-router';
// import { useMutation } from '@apollo/react-hooks';

import { DEFAULT_PROJECT, getProjectSaveData } from 'utils/project';
import { CurrentUserContext } from 'context/CurrentUserContext/CurrentUserContextProvider';

import {
  showLoadingMessage,
  showErrorMessage,
  showSuccessMessage,
} from 'utils/message';
import ProjectContainer from 'components/Project';
import { ROUTES } from 'Routes';
import { apiPostProject } from 'utils/middleware';

function ProjectCreate(props) {
  const { user: currentUser, authenticate } = useContext(CurrentUserContext);
  const { history } = props;

  const saveProject = async project => {
    /* TODO: Automatically save on user login success */
    if (!currentUser) {
      authenticate();
      return;
    }

    showLoadingMessage('Saving...');
    const projectSaveData = getProjectSaveData(project);
    try {
      const { data: savedProject } = await apiPostProject(projectSaveData);
      console.log({ savedProject });
      showSuccessMessage(`Saved "${savedProject.name}"`);
      history.push({
        pathname: `${ROUTES.PROJECT}/${savedProject._id}`,
        state: { projectData: savedProject },
      });
    } catch (error) {
      showErrorMessage(error);
      return;
    }
  };

  const projectProps = {
    initState: DEFAULT_PROJECT,
    saveProject,
    showSaveButton: true,
    showSettingsButton: false,
    projectAuthor: '',
  };

  return <ProjectContainer {...projectProps} />;
}

export default withRouter(ProjectCreate);
