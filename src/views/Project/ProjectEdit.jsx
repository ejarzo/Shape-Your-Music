import React, { useContext } from 'react';
import { CurrentUserContext } from 'context/CurrentUserContext/CurrentUserContextProvider';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { withRouter } from 'react-router';

import Loading from 'components/Loading';
import ProjectContainer from './ContainerV2';
import { DEFAULT_PROJECT, getProjectSaveData } from 'utils/project';
import {
  showLoadingMessage,
  showErrorMessage,
  showSuccessMessage,
} from 'utils/message';

import { DEFAULT_SYNTHS } from 'utils/synths';
import { ROUTES } from 'Routes';
import {
  GET_PROJECT,
  GET_ALL_PROJECTS,
  GET_MY_PROJECTS,
} from 'graphql/queries';
import { UPDATE_PROJECT, DELETE_PROJECT } from 'graphql/mutations';
import ErrorMessage from 'components/ErrorMessage';

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

  const [deleteProjectMutation] = useMutation(DELETE_PROJECT, {
    refetchQueries: () => [
      { query: GET_ALL_PROJECTS },
      { query: GET_MY_PROJECTS },
    ],
    onError: showErrorMessage,
    onCompleted: ({ deleteProject }) => {
      const { name } = deleteProject;
      showSuccessMessage(`Deleted "${name}"`);
      history.push(ROUTES.INDEX);
    },
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

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

  const deleteProject = () => {
    showLoadingMessage('Deleting...');
    deleteProjectMutation({ variables: { id: newProjectData._id } });
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
    deleteProject,
    showSaveButton: userIsProjectAuthor,
    showSettingsButton: userIsProjectAuthor,
    projectAuthor: newProjectData.userId && {
      name: newProjectData.userName,
      id: newProjectData.userId,
    },
  };

  return <ProjectContainer {...projectProps} />;
}

export default withRouter(ProjectEdit);
