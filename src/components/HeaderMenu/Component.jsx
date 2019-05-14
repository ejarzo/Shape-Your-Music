import React from 'react';
import { Link } from 'react-router-dom';
import { netlifyAuth } from 'utils/auth';
import cx from 'classnames';
import styles from './styles.module.css';
import { CurrentUserContextConsumer } from 'context/CurrentUserContext';

function HeaderMenu(props) {
  const { user } = netlifyAuth;
  console.log(user);
  return (
    <CurrentUserContextConsumer>
      {({ user, isAuthenticated, authenticate, logout }) => (
        <div className={styles.headerMenu}>
          <div className={styles.headerMenuLinks}>
            <Link to="/">Create</Link>
            <Link to="/discover">Discover</Link>
          </div>
          <div className={styles.headerAccount}>
            {isAuthenticated ? (
              <div>
                {/*<i className="ion-ios-person" />*/}
                <span>{user.user_metadata.full_name}</span>
                {' |'}
                <button onClick={logout}>Log out</button>
              </div>
            ) : (
              <div>
                <button onClick={authenticate}>Log In</button>
                <button onClick={() => authenticate({ showSignup: true })}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </CurrentUserContextConsumer>
  );
}

export default HeaderMenu;
