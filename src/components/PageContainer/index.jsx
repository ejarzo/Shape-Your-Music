import React from 'react';

function PageContainer({ children, style }) {
  return (
    <div style={{ flex: 1, ...style }}>
      <div style={{ padding: '40px 15px', maxWidth: 1000, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
