import React from 'react';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';

export default props => {
  const { projectPreview } = props;
  console.log(projectPreview);
  const id = projectPreview.ref['@ref'].id;
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
