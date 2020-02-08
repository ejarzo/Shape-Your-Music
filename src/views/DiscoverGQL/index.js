import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import ProjectList from 'components/ProjectList';
import Loading from 'components/Loading';
import PageContainer from 'components/PageContainer';
import { GET_ALL_PROJECTS } from 'graphql/queries';

function DiscoverGQLContainer() {
  const { loading, error, data } = useQuery(GET_ALL_PROJECTS);
  if (loading) return <Loading />;
  if (error) return <div>error: {error.message}</div>;

  return (
    <PageContainer>
      <ProjectList title="All Projects" projects={data.allProjects.data} />
    </PageContainer>
  );
}

export default DiscoverGQLContainer;
