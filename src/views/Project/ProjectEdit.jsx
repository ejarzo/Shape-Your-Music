import React, { useContext } from 'react';
import { CurrentUserContext } from 'context/CurrentUserContext/CurrentUserContextProvider';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Loading from 'components/Loading';
import AudioManager from './AudioManager';
import ProjectContainer from './Container';
import { DEFAULT_PROJECT, getProjectSaveData } from 'utils/project';
import {
  showLoadingMessage,
  showErrorMessage,
  showSuccessMessage,
} from 'utils/message';
import { GET_PROJECT } from 'graphql/queries';
import { UPDATE_PROJECT } from 'graphql/mutations';
import { withRouter } from 'react-router';
import { DEFAULT_SYNTHS } from 'utils/synths';

function ProjectEdit(props) {
  const {
    projectId,
    history,
    location: { state },
  } = props;
  const { projectData } = state || {};
  const { user: currentUser } = useContext(CurrentUserContext);

  console.log('ProjectEdit render. projectId:', projectId);

  const { loading, data, error } = useQuery(GET_PROJECT, {
    skip: !!projectData,
    variables: { id: projectId },
  });

  const [saveProjectMutation] = useMutation(UPDATE_PROJECT, {
    onError: showErrorMessage,
    onCompleted: ({ updateProject }) => {
      const { name } = updateProject;
      showSuccessMessage(`Saved "${name}"`);
      // Update local state that may contain old data
      history.push({
        state: { projectData: updateProject },
      });
    },
  });

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  const project = projectData || data.findProjectByID;
  const { shapesList, selectedSynths } = project;

  const newSelectedSynths =
    selectedSynths && selectedSynths.length > 0
      ? selectedSynths
      : DEFAULT_SYNTHS;

  const newProjectData = {
    ...project,
    selectedSynths: newSelectedSynths,
    shapesList: shapesList.map(({ __typename, _id, ...rest }) => ({
      ...rest,
    })),
  };

  const saveProject = project => {
    showLoadingMessage('Saving...');
    const projectSaveData = getProjectSaveData(project);
    console.log('project save data', projectSaveData);
    saveProjectMutation({
      variables: {
        id: projectId,
        data: projectSaveData,
      },
    });
  };

  const userIsProjectAuthor =
    currentUser && newProjectData && newProjectData.userId === currentUser.id;
  const projectProps = {
    initState: {
      ...DEFAULT_PROJECT,
      projectName: newProjectData && newProjectData.name,
      ...newProjectData,
    },
    saveProject,
    showSaveButton: userIsProjectAuthor,
    showSettingsButton: userIsProjectAuthor,
    projectAuthor: newProjectData.userId && {
      name: newProjectData.userName,
      id: newProjectData.userId,
    },
  };

  return (
    <AudioManager>
      {audioProps => <ProjectContainer {...projectProps} {...audioProps} />}
    </AudioManager>
  );
}

export default withRouter(ProjectEdit);
