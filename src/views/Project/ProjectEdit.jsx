import React from 'react';
import AudioManager from './AudioManager';
import ProjectContainer from './Container';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Loading from 'components/Loading';
import { getProjectSaveData } from 'utils/project';
import { message } from 'antd';
import { useIdentityContext } from 'react-netlify-identity';

const DEFAULT_PROJECT = {
  projectName: '',
  tempo: 50,
  tonic: 'a',
  scale: 'major',
};

const GET_PROJECT = gql`
  query FindProjectByID($id: ID!) {
    findProjectByID(id: $id) {
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

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $data: ProjectUpdateInput!) {
    updateProject(id: $id, data: $data) {
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

function ProjectEdit(props) {
  const { projectId } = props;
  const { user } = useIdentityContext();

  console.log('ProjectEdit render. projectId:', projectId);

  const { loading, data, error } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  });

  const [saveProjectMutation] = useMutation(UPDATE_PROJECT, {
    onError: err => {
      message.error({
        content: `Sorry, an error occurred: ${err}`,
        key: 'LOADING_MESSAGE',
      });
    },
    onCompleted: ({ updateProject: { name } }) => {
      message.success({
        content: `Saved "${name}"`,
        key: 'LOADING_MESSAGE',
      });
    },
  });

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  const originalShapesList = data.findProjectByID.shapesList.data;
  const projectData = {
    ...data.findProjectByID,
    shapesList: originalShapesList.map(({ __typename, _id, ...rest }) => ({
      ...rest,
    })),
  };

  const showSaveButton = user && projectData && projectData.userId === user.id;

  const saveProject = project => {
    message.loading({
      content: 'Saving...',
      key: 'LOADING_MESSAGE',
    });
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
      projectName: projectData && projectData.name,
      ...projectData,
    },
    saveProject,
    showSaveButton,
    projectAuthor: projectData.userId && {
      name: projectData.userName,
      id: projectData.userId,
    },
  };

  return (
    <AudioManager>
      {audioProps => <ProjectContainer {...projectProps} {...audioProps} />}
    </AudioManager>
  );
}

export default ProjectEdit;
