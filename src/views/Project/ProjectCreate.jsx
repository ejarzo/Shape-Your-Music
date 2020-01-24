import React, { useContext } from 'react';
import AudioManager from './AudioManager';
import ProjectContainer from './Container';

import { CurrentUserContextConsumer } from 'context/CurrentUserContext';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { message } from 'antd';
import { getProjectSaveData } from 'utils/project';
import { GET_ALL_PROJECTS } from 'views/DiscoverGQL/Container';
import { CurrentUserContext } from 'context/CurrentUserContext/CurrentUserContextProvider';
import { withRouter } from 'react-router';

const DEFAULT_PROJECT = {
  projectName: '',
  tempo: 50,
  tonic: 'a',
  scale: 'major',
};

const CREATE_PROJECT = gql`
  mutation CreateProject($data: ProjectCreateInput!) {
    createProject(data: $data) {
      name
      tempo
      scale
      _id
      isSnapToGridActive
      isAutoQuantizeActive
      tonic
      isGridActive
      userId
      shapesList {
        data {
          _id
          points
          isMuted
          colorIndex
          volume
        }
      }
      userName
      _ts
    }
  }
`;

function ProjectCreate(props) {
  const { user: currentUser, authenticate } = useContext(CurrentUserContext);
  const { history } = props;

  const [createProjectMutation] = useMutation(CREATE_PROJECT, {
    refetchQueries: () => [{ query: GET_ALL_PROJECTS }],
    onError: err => {
      message.error({
        content: `Sorry, an error occurred: ${err}`,
        key: 'LOADING_MESSAGE',
      });
    },
    onCompleted: ({ createProject: { _id, name } }) => {
      message.success({
        content: `Saved "${name}"`,
        key: 'LOADING_MESSAGE',
      });
      history.push(`/project/${_id}`);
    },
  });

  const saveProject = project => {
    const executeMutation = () => {
      message.loading({
        content: 'Saving...',
        key: 'LOADING_MESSAGE',
      });
      const projectSaveData = getProjectSaveData(project);
      createProjectMutation({
        variables: {
          data: projectSaveData,
        },
      });
    };
    if (!currentUser) {
      authenticate({ onSuccess: executeMutation });
    } else {
      executeMutation();
    }
  };

  const projectProps = {
    initState: {
      ...DEFAULT_PROJECT,
    },
    saveProject,
    showSaveButton: true,
    projectAuthor: '',
  };

  return (
    <CurrentUserContextConsumer>
      {currentUser => (
        <AudioManager>
          {audioProps => <ProjectContainer {...projectProps} {...audioProps} />}
        </AudioManager>
      )}
    </CurrentUserContextConsumer>
  );
}

export default withRouter(ProjectCreate);
