import React from 'react';
import HeaderMenuComponent from './Component';

class HeaderMenuContainer extends React.Component {
  render() {
    return <HeaderMenuComponent {...this.props} />;
  }
}

export default HeaderMenuContainer;
