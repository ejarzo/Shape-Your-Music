import React from 'react';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';
import { getProjectIdFromResponse } from 'utils/project';
import { formatTimestamp } from 'utils/time';

export default props => {
  const { projectPreview } = props;
  const id = getProjectIdFromResponse(projectPreview);
  const {
    ts,
    data: { name, userName, shapesList },
  } = projectPreview;

  const dateModified = formatTimestamp(ts);

  return (
    <Link to={`/project/${id}`}>
      <div className={styles.projectCard}>
        <div>
          <strong>{name}</strong>
        </div>
        <div>
          by <em>{userName}</em>
        </div>
        <div className="text-gray">{dateModified}</div>
      </div>
    </Link>
  );
};
