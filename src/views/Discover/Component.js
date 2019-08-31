import React from 'react';
import ProjectCard from 'components/ProjectCard';
import styles from './styles.module.css';
import { getProjectIdFromResponse } from 'utils/project';

function DiscoverComponent(props) {
  const { allProjects } = props;
  return (
    <div>
      <h1>All Projects</h1>
      <div className={styles.projectsGrid}>
        {allProjects &&
          allProjects.map(projectPreview => (
            <div key={getProjectIdFromResponse(projectPreview)}>
              <ProjectCard projectPreview={projectPreview} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default DiscoverComponent;
