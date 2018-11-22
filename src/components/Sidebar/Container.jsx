import React from 'react';
import SidebarComponent from './Component';

class SidebarContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: -1,
    };

    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(index) {
    if (index === this.state.activePage) {
      this.setState({ activePage: -1 });
    } else {
      this.setState({
        activePage: index,
      });
    }
  }

  render() {
    return (
      <SidebarComponent
        handleTabClick={this.handleTabClick}
        activePage={this.state.activePage}
        {...this.props}
      />
    );
  }
}

export default SidebarContainer;
