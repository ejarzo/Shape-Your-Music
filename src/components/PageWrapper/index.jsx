import React from 'react';
import HeaderMenu from 'components/HeaderMenu';

function PageWrapper(props) {
  const { children } = props;
  return (
    <div>
      <HeaderMenu />
      {children}
    </div>
  );
}

export default PageWrapper;
