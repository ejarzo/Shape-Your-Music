import React from 'react';
import HeaderMenu from 'components/HeaderMenu';

function PageWrapper(props) {
  const { children } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <HeaderMenu />
      {children}
    </div>
  );
}

export default PageWrapper;
