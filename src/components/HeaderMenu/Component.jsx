import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Button, Dropdown } from 'antd';
import { BulbFilled, BulbOutlined, DownOutlined } from '@ant-design/icons';
import { CurrentUserContextConsumer } from 'context/CurrentUserContext';
import { getUserName } from 'utils/user';
import styles from './styles.module.css';
import { ROUTES } from 'Routes';
import { useColorThemeContext } from 'context/ColorThemeContext/useColorThemeContext';
import { appColors, THEMES } from 'utils/color';
import Color from 'color';

const HeaderLink = props => {
  const { isDarkMode } = useColorThemeContext();
  return (
    <NavLink
      activeStyle={{ fontWeight: 'bold' }}
      style={{ color: isDarkMode && appColors.grayLightest }}
      {...props}
    />
  );
};

function HeaderMenu(props) {
  const { theme, setTheme, isDarkMode } = useColorThemeContext();
  console.log(theme);

  return (
    <CurrentUserContextConsumer>
      {({ user, authenticate, logout }) => (
        <div
          className={styles.headerMenu}
          style={{
            background:
              isDarkMode &&
              Color(appColors.black)
                .lighten(0.7)
                .toString(),
            borderBottomColor:
              isDarkMode &&
              Color(appColors.black)
                .lighten(0.9)
                .toString(),
          }}
        >
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
              style={{ color: isDarkMode && appColors.grayLightest }}
            >
              GitHub
            </a>
          </div>
          <div className={styles.headerAccount}>
            <div>
              <Button
                onClick={() => {
                  setTheme(theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);
                }}
                type="link"
                size="small"
                style={{ color: isDarkMode && appColors.grayLightest }}
                icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
              />
              {user ? (
                <span>
                  <Dropdown
                    overlay={() => (
                      <Menu
                        style={{
                          background: isDarkMode && appColors.black,
                        }}
                      >
                        <Menu.Item>
                          <Link
                            style={{
                              color: isDarkMode && appColors.grayLightest,
                            }}
                            to={ROUTES.MY_PROJECTS}
                          >
                            My Projects
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            style={{
                              color: isDarkMode && appColors.grayLightest,
                              padding: 0,
                            }}
                            onClick={logout}
                          >
                            Log Out
                          </button>
                        </Menu.Item>
                      </Menu>
                    )}
                  >
                    <button
                      style={{ color: isDarkMode && appColors.grayLightest }}
                    >
                      {getUserName(user)} <DownOutlined />
                    </button>
                  </Dropdown>
                </span>
              ) : (
                <span>
                  <button onClick={authenticate}>Log In</button>
                  <button onClick={() => authenticate({ showSignup: true })}>
                    Sign Up
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </CurrentUserContextConsumer>
  );
}

export default HeaderMenu;
