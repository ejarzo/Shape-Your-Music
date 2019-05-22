import React from 'react';

function PageContainer({ children }) {
  return (
    <div style={{ padding: '40px 15px', maxWidth: 1000, margin: '0 auto' }}>
      {children}
    </div>
  );
}

export default PageContainer;
