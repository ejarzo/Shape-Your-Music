import React from 'react';
import { CurrentUserContextConsumer } from 'context/CurrentUserContext';
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

function ProjectEdit(props) {
  const {
    projectId,
    location: { state },
  } = props;
  const { projectData } = state || {};
  console.log('ProjectEdit render. projectId:', projectId);

  const { loading, data, error } = useQuery(GET_PROJECT, {
    skip: !!projectData,
    variables: { id: projectId },
  });

  const [saveProjectMutation] = useMutation(UPDATE_PROJECT, {
    onError: showErrorMessage,
    onCompleted: ({ updateProject: { name } }) => {
      showSuccessMessage(`Saved "${name}"`);
    },
  });

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  const project = projectData || data.findProjectByID;
  const originalShapesList = project.shapesList.data;

  const newProjectData = {
    ...project,
    shapesList: originalShapesList.map(({ __typename, _id, ...rest }) => ({
      ...rest,
    })),
  };

  const saveProject = project => {
    showLoadingMessage('Saving...');
    const projectSaveData = getProjectSaveData(project);
    saveProjectMutation({
      variables: {
        id: projectId,
        data: projectSaveData,
      },
    });
  };

  const projectProps = {
    initState: {
      ...DEFAULT_PROJECT,
      projectName: newProjectData && newProjectData.name,
      ...newProjectData,
    },
    saveProject,
    projectAuthor: newProjectData.userId && {
      name: newProjectData.userName,
      id: newProjectData.userId,
    },
  };

  return (
    <CurrentUserContextConsumer>
      {({ user }) => (
        <AudioManager>
          {audioProps => (
            <ProjectContainer
              showSaveButton={
                user && newProjectData && newProjectData.userId === user.id
              }
              {...projectProps}
              {...audioProps}
            />
          )}
        </AudioManager>
      )}
    </CurrentUserContextConsumer>
  );
}

export default withRouter(ProjectEdit);
