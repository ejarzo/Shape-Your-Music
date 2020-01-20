import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { formatTimestamp } from 'utils/time';

function DiscoverGQLComponent(props) {
  const { allProjects } = props;
  return (
    <div>
      <h1>All Projects</h1>
      <div className={styles.projectsGrid}>
        {allProjects &&
          allProjects.map(({ _id, name, userName, _ts }) => (
            <div>
              <Link to={`/project/${_id}`}>
                <div className={styles.projectCard}>
                  <div>
                    <strong>{name}</strong>
                  </div>
                  <div>
                    by <em>{userName}</em>
                  </div>
                  <div className="text-gray">{formatTimestamp(_ts)}</div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default DiscoverGQLComponent;
