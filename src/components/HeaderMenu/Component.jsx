import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';
import { CurrentUserContextConsumer } from 'context/CurrentUserContext';
import { getUserName } from 'utils/user';
import styles from './styles.module.css';
import { ROUTES } from 'Routes';

const HeaderLink = props => (
  <NavLink activeStyle={{ fontWeight: 'bold' }} {...props} />
);

function HeaderMenu(props) {
  return (
    <CurrentUserContextConsumer>
      {({ user, authenticate, logout }) => (
        <div className={styles.headerMenu}>
          <div className={styles.headerMenuLinks}>
            <HeaderLink exact to={ROUTES.INDEX}>
              Create
            </HeaderLink>
            <HeaderLink exact to={ROUTES.DISCOVER}>
              Discover
            </HeaderLink>
            <a
              href="https://github.com/ejarzo/Shape-Your-Music/"
              target="blank"
            >
              GitHub
            </a>
          </div>
          <div className={styles.headerAccount}>
            {user ? (
              <div>
                <Dropdown
                  overlay={() => (
                    <Menu>
                      <Menu.Item>
                        <Link to={ROUTES.MY_PROJECTS}>My Projects</Link>
                      </Menu.Item>
                      <Menu.Item>
                        <button style={{ padding: 0 }} onClick={logout}>
                          Log Out
                        </button>
                      </Menu.Item>
                    </Menu>
                  )}
                >
                  <button>
                    {getUserName(user)} <Icon type="down" />
                  </button>
                </Dropdown>
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
