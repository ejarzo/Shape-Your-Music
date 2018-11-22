import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { appColors } from 'utils/color';
import styles from './styles.module.css';

const propTypes = {
  downloadUrls: PropTypes.array.isRequired,
};

/* ================================ Toolbar ================================ */
function Downloads(props) {
  const { downloadUrls } = props;
  return (
    <div className={styles.downloads}>
      <h2>Downloads</h2>
      {downloadUrls.length === 0 && (
        <div style={{ paddingBottom: 20 }}>No recordings yet</div>
      )}
      <ul>
        {downloadUrls.map((url, i) => (
          <li>
            <audio src={url} controls />
            <Button
              key={`download-${i}`}
              href={url}
              download={url}
              hasBorder
              darkHover
              color={appColors.grayLightest}
              title={`download-${i}`}
            >
              <i className="ion-android-download" /> {`download ${i}`}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

Downloads.propTypes = propTypes;

export default Downloads;
