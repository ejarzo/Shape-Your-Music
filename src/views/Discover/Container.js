import React from 'react';
import PageContainer from 'components/PageContainer';
import DiscoverComponent from './Component';
import { withData, readAllProjects } from 'middleware';

function DiscoverContainer({ data }) {
  return (
    <PageContainer>
      <DiscoverComponent allProjects={data} />
    </PageContainer>
  );
}

export default withData('READ_ALL_PROJECTS', readAllProjects)(
  DiscoverContainer
);
