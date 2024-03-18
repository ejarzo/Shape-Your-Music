import React, { useEffect, useState } from 'react';
import ProjectList from 'components/ProjectList';
import Loading from 'components/Loading';
import PageContainer from 'components/PageContainer';
import ErrorMessage from 'components/ErrorMessage';
import { fetchAllProjects } from 'utils/middleware';

function DiscoverGQLContainer() {
  const [pagination, setPagination] = useState({});
  const [{ loading, error, data }, setResult] = useState({ loading: true });

  useEffect(() => {
    setResult({ loading: true });
    const fetchData = async () => {
      try {
        const result = await fetchAllProjects(pagination);
        setResult({ loading: false, data: result });
      } catch (error) {
        setResult({ loading: false, error });
      }
    };
    fetchData();
  }, [pagination]);

  if (error) return <ErrorMessage message={error.message} />;
  if (!data || loading) return <Loading />;

  const { before, after, data: projectsData } = data;

  const onNextPageClick = () => {
    setPagination({ after });
  };
  const onPrevPageClick = () => {
    setPagination({ before });
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
