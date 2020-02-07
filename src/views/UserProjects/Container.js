import React, { useContext } from 'react';
import PageContainer from 'components/PageContainer';
import DiscoverComponent from './Component';
import { useQuery } from '@apollo/react-hooks';
import Loading from 'components/Loading';
import { GET_MY_PROJECTS } from 'graphql/queries';
import { CurrentUserContext } from 'context/CurrentUserContext/CurrentUserContextProvider';

function DiscoverGQLContainer() {
  const { user } = useContext(CurrentUserContext);
  const { loading, error, data } = useQuery(GET_MY_PROJECTS, { skip: !user });

  if (!user) return <div>Please log in to view your projects</div>;
  if (loading) return <Loading />;
  if (error) return <div>error: {error.message}</div>;

  return (
    <PageContainer>
      <DiscoverComponent allProjects={data.myProjects.data} />
    </PageContainer>
  );
}

export default DiscoverGQLContainer;
