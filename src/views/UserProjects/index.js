import React, { useContext, useEffect, useState } from 'react';
import { Alert } from 'antd';

import PageContainer from 'components/PageContainer';
import ProjectList from 'components/ProjectList';
import Loading from 'components/Loading';
import { CurrentUserContext } from 'context/CurrentUserContext/CurrentUserContextProvider';
import { getUserName } from 'utils/user';
import ErrorMessage from 'components/ErrorMessage';
import { fetchMyProjects } from 'utils/middleware';

function UserProjects() {
  const { user } = useContext(CurrentUserContext);
  const [pagination, setPagination] = useState({});
  const [{ loading, error, data }, setResult] = useState({ loading: true });

  useEffect(() => {
    setResult({ loading: true });
    const fetchData = async () => {
      try {
        const result = await fetchMyProjects(pagination);
        setResult({ loading: false, data: result });
      } catch (error) {
        setResult({ loading: false, error });
      }
    };
    fetchData();
  }, [pagination]);

  if (error) return <ErrorMessage message={error.message} />;
  if (!data || loading) return <Loading />;

  const {
    // before, after,
    data: projectsData,
  } = data;

  // const onNextPageClick = () => {
  //   setPagination({ after });
  // };
  // const onPrevPageClick = () => {
  //   setPagination({ before });
  // };

  if (!user)
    return (
      <PageContainer>
        <Alert
          showIcon
          type="warning"
          message="Please log in to view your projects"
        />
      </PageContainer>
    );
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <PageContainer>
      <ProjectList
        title={`${getUserName(user)}'s Projects`}
        projects={projectsData}
        // before={before}
        // after={after}
        // onNextPageClick={onNextPageClick}
        // onPrevPageClick={onPrevPageClick}
      />
    </PageContainer>
  );
}

export default UserProjects;
