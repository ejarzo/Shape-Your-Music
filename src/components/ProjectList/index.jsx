import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { formatTimestamp } from 'utils/time';
import { ROUTES } from 'Routes';
import { Button } from 'antd';

function ProjectList(props) {
  const { title, projects } = props;
  return (
    <div>
      <h1>{title}</h1>
      <div className={styles.projectsGrid}>
        {projects.length === 0 && (
          <div>
            <p>No projects yet</p>
            <Link to={ROUTES.INDEX}>
              <Button>Start Creating!</Button>
            </Link>
          </div>
        )}

        {projects &&
          projects.map(({ _id, name, userName, dateCreated }) => (
            <div key={_id}>
              <Link to={`${ROUTES.PROJECT}/${_id}`}>
                <div className={styles.ProjectCard}>
                  <div>
                    <strong>{name}</strong>
                  </div>
                  <div>
                    by <em>{userName}</em>
                  </div>
                  <div className="text-gray">
                    {dateCreated && formatTimestamp(dateCreated)}
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProjectList;
