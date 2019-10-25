import React from 'react';
import SidebarComponent from './Component';

class SidebarContainer extends React.Component {
  render() {
    return <SidebarComponent {...this.props} />;
  }
}

export default SidebarContainer;
