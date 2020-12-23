import React from 'react';
import PageContainer from 'components/PageContainer';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

function Loading(props) {
  return (
    <PageContainer>
      <div style={{ textAlign: 'center' }}>
        <Spin delay={100} indicator={<LoadingOutlined />} />
      </div>
    </PageContainer>
  );
}

export default Loading;
