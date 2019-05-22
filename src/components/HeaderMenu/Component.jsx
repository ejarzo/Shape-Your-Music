import React from 'react';
import { NavLink } from 'react-router-dom';
import { netlifyAuth } from 'utils/auth';
import styles from './styles.module.css';
import { CurrentUserContextConsumer } from 'context/CurrentUserContext';

const HeaderLink = props => (
  <NavLink activeStyle={{ fontWeight: 'bold' }} {...props} />
);

function HeaderMenu(props) {
  const { user } = netlifyAuth;
  console.log(user);
  return (
    <CurrentUserContextConsumer>
      {({ user, isAuthenticated, authenticate, logout }) => (
        <div className={styles.headerMenu}>
          <div className={styles.headerMenuLinks}>
            <HeaderLink exact to="/">
              Create
            </HeaderLink>
            <HeaderLink exact to="/discover">
              Discover
            </HeaderLink>
          </div>
          <div className={styles.headerAccount}>
            {isAuthenticated ? (
              <div>
                {/* <i className="ion-ios-person" /> */}
                <span>
                  <em>{user.user_metadata.full_name}</em>
                </span>
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
