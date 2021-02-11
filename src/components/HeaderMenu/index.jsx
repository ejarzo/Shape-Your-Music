import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Button, Dropdown, Modal, Typography } from 'antd';
import { BulbFilled, BulbOutlined, DownOutlined } from '@ant-design/icons';
import { CurrentUserContextConsumer } from 'context/CurrentUserContext';
import { getUserName } from 'utils/user';
import styles from './styles.module.css';
import { ROUTES } from 'Routes';
import { useColorThemeContext } from 'context/ColorThemeContext/useColorThemeContext';
import { appColors, THEMES } from 'utils/color';
import Color from 'color';
import AboutModalContent from 'components/AboutModalContent';

const { Link: AntLink } = Typography;

const HeaderLink = props => {
  const { isDarkMode } = useColorThemeContext();
  return (
    <NavLink
      component={AntLink}
      activeStyle={{
        fontWeight: 'bold',
        // borderBottom: '2px solid #666',
        // height: 25,
      }}
      style={{ color: isDarkMode && appColors.grayLightest }}
      {...props}
    />
  );
};

function HeaderMenu(props) {
  const { theme, setTheme, isDarkMode } = useColorThemeContext();
  // TODO: reveal when dark mode works
  const showDarkModeButton = false;
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);

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
          <Modal
            // title="About Shape Your Music"
            visible={isAboutModalVisible}
            onCancel={() => setIsAboutModalVisible(false)}
            footer={null}
            // width={700}
          >
            <AboutModalContent />
          </Modal>
          <div className={styles.headerMenuLinks}>
            <HeaderLink exact to={ROUTES.INDEX}>
              Create
            </HeaderLink>

            <HeaderLink exact to={ROUTES.DISCOVER}>
              Discover
            </HeaderLink>
            <div
              style={{
                borderRadius: '50%',
                width: 4,
                height: 4,
                background: '#555',
                position: 'relative',
                top: 8,
                marginRight: 10,
              }}
            ></div>
            <HeaderLink exact to={ROUTES.TUTORIAL}>
              Tutorial
            </HeaderLink>
            <AntLink
              size="small"
              type="link"
              onClick={() => setIsAboutModalVisible(true)}
            >
              About
            </AntLink>

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
              {showDarkModeButton && (
                <Button
                  onClick={() => {
                    setTheme(
                      theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
                    );
                  }}
                  type="link"
                  size="small"
                  style={{ color: isDarkMode && appColors.grayLightest }}
                  icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                />
              )}
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
