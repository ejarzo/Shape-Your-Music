import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.css';

import Downloads from 'components/Downloads';

const propTypes = {
  downloadUrls: PropTypes.array.isRequired,
};

function Sidebar({ activePage, downloadUrls, handleTabClick }) {
  const [iconScale, setIconScale] = useState(1);

  useEffect(() => {
    if (downloadUrls.length === 0) return;
    setIconScale(1.8);
    const timer = setTimeout(() => setIconScale(1), 200);
    return () => clearTimeout(timer);
  }, [downloadUrls]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.tabs}>
        {/*<div
            className={styles.tabButton}
            title="Settings"
            style={{
              background: activePage === 0 && 'white',
            }}
            onClick={() => handleTabClick(0)}
          >
            <div>
              <i className="ion-gear-b" />
            </div>
          </div>*/}

        <div
          className={styles.tabButton}
          title="Downloads"
          style={{
            background: activePage === 1 && 'white',
          }}
          onClick={() => handleTabClick(1)}
        >
          <div
            style={{
              transition: 'all 0.2s',
              transform: `scale(${iconScale})`,
            }}
          >
            <i className="ion-android-download" />
          </div>
        </div>
      </div>

      <div>
        <div className={styles.content}>
          {activePage === 0 && (
            <div className={styles.contentInner}>
              <h2>Settings</h2>
              <label htmlFor="projectName">Project Name</label>
              <br />
              <input name="projectName" />
            </div>
          )}
          {activePage === 1 && (
            <div className={styles.contentInner}>
              <Downloads downloadUrls={downloadUrls} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = propTypes;

export default Sidebar;
