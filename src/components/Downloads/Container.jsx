import React from 'react';
import DownloadsComponent from './Component';

class DownloadsContainer extends React.Component {
  render() {
    return <DownloadsComponent {...this.props} />;
  }
}

export default DownloadsContainer;
