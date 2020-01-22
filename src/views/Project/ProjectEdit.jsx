import React from 'react';
import AudioManager from './AudioManager';
import ProjectContainer from './Container';
import { CurrentUserContextConsumer } from 'context/CurrentUserContext';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Loading from 'components/Loading';
import { getProjectSaveData } from 'utils/project';
import { message } from 'antd';

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
  console.log('project render. projectId:', props.projectId);
  const { projectId } = props;

  const { loading, data, error } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  });

  const [saveProjectMutation, mutationData] = useMutation(UPDATE_PROJECT, {
    onError: err => {
      console.log('ERROR', err);
      message.error(`Sorry, an error occurred: ${err}`);
    },
    onCompleted: data => {
      message.success(`Success!`);
      console.log('onSuccess', data);
    },
  });

  if (loading) return <Loading />;
  if (error) return <div>Error: {error.messsage}</div>;

  const originalShapesList = data.findProjectByID.shapesList.data;

  const projectData = {
    ...data.findProjectByID,
    shapesList: originalShapesList.map(({ __typename, _id, ...rest }) => ({
      ...rest,
    })),
  };

  const projectProps = {
    initState: {
      ...DEFAULT_PROJECT,
      projectName: projectData && projectData.name,
      ...projectData,
    },
    saveProject: project => {
      console.log('PROJECt', project);
      const projectSaveData = getProjectSaveData(project);

      const shapesListRelation = {
        create: projectSaveData.shapesList,
        disconnect: originalShapesList.map(({ _id }) => _id),
      };

      console.log('save data', projectSaveData);
      saveProjectMutation({
        variables: {
          id: projectId,
          data: { ...projectSaveData, shapesList: shapesListRelation },
        },
      });
    },
    projectAuthor: projectData.userId && {
      name: projectData.userName,
      id: projectData.userId,
    },
  };

  return (
    <CurrentUserContextConsumer>
      {({ user }) => (
        <AudioManager>
          {audioProps => (
            <ProjectContainer
              showSaveButton={
                user && projectData && projectData.userId === user.id
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

export default ProjectEdit;
