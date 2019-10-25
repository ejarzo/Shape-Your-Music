import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Icon, Drawer, Tooltip } from 'antd';

import Downloads from 'components/Downloads';
import styles from './styles.module.css';

const propTypes = {
  downloadUrls: PropTypes.array.isRequired,
};

function Sidebar({ activePage, downloadUrls, handleTabClick }) {
  const [seenDownloadCount, setSeenDownloadCount] = useState(0);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const count = downloadUrls.length - seenDownloadCount;

  return (
    <div className={styles.sidebar}>
      <div className={styles.tabs}>
        <Badge style={{ fontWeight: 'bold' }} count={count} offset={[-2, 2]}>
          <Tooltip placement="right" title={'Downloads'}>
            <div
              className={styles.tabButton}
              onClick={() => {
                setSeenDownloadCount(downloadUrls.length);
                handleTabClick(1);
                setIsDrawerVisible(true);
              }}
            >
              <div>
                <Icon type="download" />
              </div>
            </div>
          </Tooltip>
        </Badge>
      </div>

      <Drawer
        title="Downloads"
        placement="left"
        closable={false}
        width={400}
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
      >
        <Downloads downloadUrls={downloadUrls} />
      </Drawer>
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
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = propTypes;

export default Sidebar;
