import React from 'react';
import DiscoverComponent from './Component';
import { readAllProjects } from 'middleware';

class DiscoverContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { allProjects: [] };
  }
  async componentDidMount() {
    const allProjects = await readAllProjects();
    this.setState({ allProjects });
  }
  render() {
    const { allProjects } = this.state;
    return (
      <DiscoverComponent allProjects={allProjects.map(({ data }) => data)} />
    );
  }
}

export default DiscoverContainer;
