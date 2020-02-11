import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from 'components/PageContainer';
import { Button } from 'antd';
import { ROUTES } from 'Routes';

export default () => (
  <PageContainer>
    <div>
      <h1>404</h1>
      <p>The page you are looking for could not be found</p>
      <Link to={ROUTES.INDEX}>
        <Button>Start Creating!</Button>
      </Link>
    </div>
  </PageContainer>
);
