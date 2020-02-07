import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { formatTimestamp } from 'utils/time';
import { CurrentUserContext } from 'context/CurrentUserContext/CurrentUserContextProvider';
import { getUserName } from 'utils/user';

function DiscoverGQLComponent(props) {
  const { allProjects } = props;
  const { user } = useContext(CurrentUserContext);
  const userName = getUserName(user);
  return (
    <div>
      <h1>{userName}'s Projects</h1>
      <div className={styles.projectsGrid}>
        {allProjects &&
          allProjects.map(({ _id, name, userName, dateCreated }) => (
            <div>
              <Link to={`/project/${_id}`}>
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

export default DiscoverGQLComponent;
