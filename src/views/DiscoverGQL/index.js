import React, { useEffect, useState } from 'react';
import ProjectList from 'components/ProjectList';
import Loading from 'components/Loading';
import PageContainer from 'components/PageContainer';
import ErrorMessage from 'components/ErrorMessage';
import { fetchAllProjects } from 'utils/middleware';

function DiscoverV2() {
  const [pagination, setPagination] = useState({});
  const [{ loading, error, data }, setResult] = useState({ loading: true });
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    setResult(prev => ({ ...prev, loading: true }));
    const fetchData = async () => {
      try {
        const result = await fetchAllProjects(pagination);
        setResult(prev => ({ ...prev, data: result }));
        if (pagination.startAfter) {
          setAllProjects(prev => [...prev, ...result.data]);
        } else {
          setAllProjects(result.data);
        }
      } catch (error) {
        setResult(prev => ({ ...prev, loading: false, error }));
      }
    };
    fetchData();
  }, [pagination]);

  if (error) return <ErrorMessage message={error.message} />;
  const loadingFirstPage = !data && loading;
  if (!data) return <Loading />;

  const { nextCursor, hasMore } = data;
  const onLoadMore = () => {
    setPagination({ startAfter: nextCursor });
  };

  return (
    <PageContainer>
      <ProjectList
        title="All Projects"
        projects={allProjects}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        // only show loading if there are no projects
        isLoading={loadingFirstPage}
      />
    </PageContainer>
  );
}

export default DiscoverV2;
