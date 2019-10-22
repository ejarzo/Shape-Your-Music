import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Project from 'views/Project';
import Discover from 'views/Discover';
import NotFound from 'views/NotFound';
import PageWrapper from 'components/PageWrapper';

function Routes() {
  return (
    <BrowserRouter>
      <PageWrapper>
        <Switch>
          <Route exact path="/" component={() => <Project />} />
          <Route
            exact
            path="/project/:projectId"
            component={({
              match: {
                params: { projectId },
              },
            }) => <Project projectId={projectId} />}
          />
          <Route path="/discover" component={Discover} />
          <Route component={NotFound} />
        </Switch>
      </PageWrapper>
    </BrowserRouter>
  );
}

export default Routes;
