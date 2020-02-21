import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import PageContainer from 'components/PageContainer';
import ProjectList from 'components/ProjectList';
import Loading from 'components/Loading';
import { CurrentUserContext } from 'context/CurrentUserContext/CurrentUserContextProvider';
import { getUserName } from 'utils/user';
import { GET_MY_PROJECTS } from 'graphql/queries';
import ErrorMessage from 'components/ErrorMessage';

function UserProjects() {
  const { user } = useContext(CurrentUserContext);
  const { loading, error, data } = useQuery(GET_MY_PROJECTS, { skip: !user });

  if (!user)
    return <PageContainer>Please log in to view your projects</PageContainer>;
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <PageContainer>
      <ProjectList
        title={`${getUserName(user)}'s Projects`}
        projects={data.myProjects.data}
      />
    </PageContainer>
  );
}

export default UserProjects;
