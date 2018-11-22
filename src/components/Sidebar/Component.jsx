import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.css';

import Downloads from 'components/Downloads';

const propTypes = {
  downloadUrls: PropTypes.array.isRequired,
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconScale: 1,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.downloadUrls.length !== this.props.downloadUrls.length) {
      this.setState({
        iconScale: 1.7,
      });
      setTimeout(() => {
        this.setState({
          iconScale: 1,
        });
      }, 200);
    }
  }

  render() {
    const { activePage, downloadUrls, handleTabClick } = this.props;
    return (
      <div className={styles.sidebar}>
        <div className={styles.tabs}>
          <div
            className={styles.tabButton}
            title="Downloads"
            style={{
              background: activePage === 0 && 'rgba(255,255,255,0.8)',
            }}
            onClick={() => handleTabClick(0)}
          >
            <div
              style={{
                transition: 'all 0.2s',
                transform: `scale(${this.state.iconScale})`,
              }}
            >
              <i className="ion-android-download" />
            </div>
          </div>
        </div>
        <div className={styles.content}>
          {activePage === 0 && (
            <div className={styles.contentInner}>
              <Downloads downloadUrls={downloadUrls} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = propTypes;

export default Sidebar;
