import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import ProjectList from 'components/ProjectList';
import Loading from 'components/Loading';
import PageContainer from 'components/PageContainer';
import { GET_ALL_PROJECTS_SORTED_BY_DATE_CREATED } from 'graphql/queries';
import ErrorMessage from 'components/ErrorMessage';

function DiscoverGQLContainer() {
  const pageSize = 24;
  const [cursor, setCursor] = useState(null);
  const { loading, error, data } = useQuery(
    GET_ALL_PROJECTS_SORTED_BY_DATE_CREATED,
    { variables: { _size: pageSize, _cursor: cursor } }
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  const {
    before,
    after,
    data: projectsData,
  } = data.allProjectsSortedByDateCreated;

  const onNextPageClick = () => {
    setCursor(after);
  };
  const onPrevPageClick = () => {
    setCursor(before);
  };

  return (
    <PageContainer>
      <ProjectList
        title="All Projects"
        projects={projectsData}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
        before={before}
        after={after}
      />
    </PageContainer>
  );
}

export default DiscoverGQLContainer;
