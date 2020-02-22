import React from 'react';
import { Alert } from 'antd';
import PageContainer from 'components/PageContainer';

export default ({ message }) => (
  <PageContainer>
    <Alert showIcon type="error" message={message} />
  </PageContainer>
);
