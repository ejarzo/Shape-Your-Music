import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProjectCreate from 'views/ProjectCreate';
import ProjectEdit from 'views/ProjectEdit';
import DiscoverGQL from 'views/DiscoverGQL';
import UserProjects from 'views/UserProjects';
import NotFound from 'views/NotFound';
import PageWrapper from 'components/PageWrapper';

export const ROUTES = {
  INDEX: '/',
  DISCOVER: '/discover',
  PROJECT: '/project',
  MY_PROJECTS: '/myprojects',
};

function Routes() {
  return (
    <BrowserRouter>
      <PageWrapper>
        <Switch>
          <Route
            exact
            path={ROUTES.INDEX}
            component={() => <ProjectCreate />}
          />
          <Route
            exact
            path={`${ROUTES.PROJECT}/:projectId`}
            component={({
              match: {
                params: { projectId },
              },
            }) => <ProjectEdit projectId={projectId} />}
          />
          <Route path={ROUTES.DISCOVER} component={DiscoverGQL} />
          <Route path={ROUTES.MY_PROJECTS} component={UserProjects} />
          <Route component={NotFound} />
        </Switch>
      </PageWrapper>
    </BrowserRouter>
  );
}

export default Routes;
