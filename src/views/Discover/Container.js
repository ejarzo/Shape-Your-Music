import React from 'react';
import PageContainer from 'components/PageContainer';
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
      <PageContainer>
        <DiscoverComponent allProjects={allProjects} />
      </PageContainer>
    );
  }
}

export default DiscoverContainer;
