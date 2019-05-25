import React from 'react';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';
import { getProjectIdFromResponse } from 'utils/project';

export default props => {
  const { projectPreview } = props;
  const id = getProjectIdFromResponse(projectPreview);
  const {
    data: { name, userName },
  } = projectPreview;

  return (
    <Link to={`/project/${id}`}>
      <div className={styles.projectCard}>
        <div>
          <strong>{name}</strong>
        </div>
        <div>
          <em>by {userName}</em>
        </div>
      </div>
    </Link>
  );
};
