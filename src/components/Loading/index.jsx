import React from 'react';
import PageContainer from 'components/PageContainer';
import { Spin, Icon } from 'antd';

function Loading(props) {
  return (
    <PageContainer>
      <div style={{ textAlign: 'center' }}>
        <Spin
          delay={100}
          indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
        />
      </div>
    </PageContainer>
  );
}

export default Loading;
