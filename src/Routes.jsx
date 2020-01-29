import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProjectCreate from 'views/Project/ProjectCreate';
import ProjectEdit from 'views/Project/ProjectEdit';
import Discover from 'views/Discover';
import DiscoverGQL from 'views/DiscoverGQL';
import NotFound from 'views/NotFound';
import PageWrapper from 'components/PageWrapper';

function Routes() {
  return (
    <BrowserRouter>
      <PageWrapper>
        <Switch>
          <Route exact path="/" component={() => <ProjectCreate />} />
          <Route
            exact
            path="/project/:projectId"
            component={({
              match: {
                params: { projectId },
              },
            }) => <ProjectEdit projectId={projectId} />}
          />
          <Route path="/discover" component={DiscoverGQL} />
          <Route path="/discover-legacy" component={Discover} />
          <Route component={NotFound} />
        </Switch>
      </PageWrapper>
    </BrowserRouter>
  );
}

export default Routes;
