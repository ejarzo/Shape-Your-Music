import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Icon, Drawer, Tooltip } from 'antd';

import Downloads from 'components/Downloads';
import styles from './styles.module.css';
import SaveButton from 'components/Toolbar/SaveButton';
import withProjectContext from 'views/Project/withProjectContext';

const propTypes = {
  downloadUrls: PropTypes.array.isRequired,
};

function Sidebar(props) {
  const {
    handleSaveClick,
    showSaveButton,
    projectName,
    activePage,
    downloadUrls,
    handleExportToMIDIClick,
  } = props;

  const [seenDownloadCount, setSeenDownloadCount] = useState(0);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const count = downloadUrls.length - seenDownloadCount;

  return (
    <div className={styles.sidebar}>
      <div className={styles.tabs}>
        {showSaveButton && (
          <Tooltip placement="right" title="Save Project">
            <div className={styles.tabButton} onClick={() => {}}>
              <SaveButton
                onConfirm={name => handleSaveClick(name)}
                projectName={projectName}
              />
            </div>
          </Tooltip>
        )}
        <Badge style={{ fontWeight: 'bold' }} count={count} offset={[-2, 2]}>
          <Tooltip placement="right" title="Downloads">
            <div
              className={styles.tabButton}
              onClick={() => {
                setSeenDownloadCount(downloadUrls.length);
                setIsDrawerVisible(true);
              }}
            >
              <Icon type="download" />
            </div>
          </Tooltip>
        </Badge>
        <Tooltip placement="right" title="Export to MIDI">
          <div className={styles.tabButton} onClick={handleExportToMIDIClick}>
            <Icon type="export" />
          </div>
        </Tooltip>
      </div>

      <Drawer
        title="Downloads"
        placement="left"
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

export default withProjectContext(Sidebar);
