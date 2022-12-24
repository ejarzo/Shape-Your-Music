import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from './styles.module.css';

const propTypes = {
  downloadUrls: PropTypes.array.isRequired,
};

/* ================================ Toolbar ================================ */
function Downloads(props) {
  const { downloadUrls } = props;
  return (
    <div className={styles.downloads}>
      <div style={{ paddingBottom: 20 }}>
        {downloadUrls.length === 0 ? (
          <span>
            No recordings yet. Press record <i className="ion-record" /> to
            create some!
          </span>
        ) : (
          <span>
            Download your recordings to your computer as WAV files. The most
            recent recording is first.
          </span>
        )}
      </div>
      <Alert
        style={{ marginBottom: 20 }}
        showIcon
        type="warning"
        message="Recordings will be lost when you leave or reload the page."
      />
      <ul>
        {downloadUrls
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
          .map(({ url, fileName, createdAt }, i) => (
            <li key={url}>
              <h2>{createdAt.format('HH:mm:ss [on] MMM DD').toString()}</h2>
              <audio src={url} controls />

              <Button
                icon={<DownloadOutlined />}
                href={url}
                download={fileName || `recording-${i}`}
                title={`shape-your-music-download-${i}`}
              >
                Download
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
}

Downloads.propTypes = propTypes;

export default Downloads;
