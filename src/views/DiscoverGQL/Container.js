import React from 'react';
import PageContainer from 'components/PageContainer';
import DiscoverComponent from './Component';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Loading from 'components/Loading';

const GET_ALL_PROJECTS = gql`
  {
    allProjects {
      data {
        _id
        _ts
        name
        userId
        userName
      }
    }
  }
`;

function DiscoverGQLContainer() {
  const { loading, error, data } = useQuery(GET_ALL_PROJECTS);
  if (loading) return <Loading />;
  if (error) return <div>error: {error.message}</div>;

  return (
    <PageContainer>
      <DiscoverComponent allProjects={data.allProjects.data} />
    </PageContainer>
  );
}

export default DiscoverGQLContainer;
