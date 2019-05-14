import React from 'react';

function DiscoverComponent(props) {
  const { allProjects } = props;
  return (
    <div>
      <h1>All Projects</h1>
      <div>
        {allProjects.map(({ name }) => (
          <div>{name}</div>
        ))}
      </div>
    </div>
  );
}

export default DiscoverComponent;
