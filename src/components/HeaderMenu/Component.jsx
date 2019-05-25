import React from 'react';
import { NavLink } from 'react-router-dom';
import { CurrentUserContextConsumer } from 'context/CurrentUserContext';
import styles from './styles.module.css';

const HeaderLink = props => (
  <NavLink activeStyle={{ fontWeight: 'bold' }} {...props} />
);

function HeaderMenu(props) {
  return (
    <CurrentUserContextConsumer>
      {({ user, authenticate, logout }) => (
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
            {user ? (
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
