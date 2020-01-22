import React from 'react';
import FileManager from './FileManager';
import AudioManager from './AudioManager';
import ProjectContainer from './Container';
import { withData, readProject } from 'middleware';

import { CurrentUserContextConsumer } from 'context/CurrentUserContext';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Loading from 'components/Loading';

const DEFAULT_PROJECT = {
  projectName: '',
  tempo: 50,
  tonic: 'a',
  scale: 'major',
};

function ProjectCreate(props) {
  const projectProps = {
    initState: {
      ...DEFAULT_PROJECT,
    },
    saveProject: () => {
      console.log('Save');
    },
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

export default ProjectCreate;
