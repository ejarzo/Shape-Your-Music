import React from 'react';
import PropTypes from 'prop-types';

import Portal from 'react-portal';
import styles from './styles.module.css';

import Button from 'components/Button';

const propTypes = {
  downloadUrls: PropTypes.array.isRequired,
};

/* ================================ Toolbar ================================ */
function Downloads(props) {
  const { downloadUrls } = props;
  return (
    <div className={styles.downloads}>
      <h2>Downloads</h2>
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
              color={'#f1f1f1'}
              title={`download-${i}`}
            >
              {`download-${i}`}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

Downloads.propTypes = propTypes;

export default Downloads;
