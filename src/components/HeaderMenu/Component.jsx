import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';
import { getUserName } from 'utils/user';
import styles from './styles.module.css';
import IdentityModal from 'components/IdentityModal';
import { useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';

const HeaderLink = props => (
  <NavLink activeStyle={{ fontWeight: 'bold' }} {...props} />
);

function HeaderMenu(props) {
  const { user, isLoggedIn, logoutUser } = useIdentityContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <IdentityModal
        showDialog={isModalOpen}
        onCloseDialog={() => setIsModalOpen(false)}
      />
      <div className={styles.headerMenu}>
        <div className={styles.headerMenuLinks}>
          <HeaderLink exact to="/">
            Create
          </HeaderLink>
          <HeaderLink exact to="/discover">
            Discover
          </HeaderLink>
          <HeaderLink exact to="/discovergql">
            Discover GQL
          </HeaderLink>
          <a href="https://github.com/ejarzo/Shape-Your-Music/" target="blank">
            GitHub
          </a>
        </div>
        <div className={styles.headerAccount}>
          {isLoggedIn ? (
            <div>
              <Dropdown
                overlay={() => (
                  <Menu>
                    <Menu.Item>
                      <button onClick={logoutUser}>Log out</button>
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
              <button onClick={() => setIsModalOpen(true)}>Log In</button>
              <button onClick={() => setIsModalOpen(true)}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HeaderMenu;
