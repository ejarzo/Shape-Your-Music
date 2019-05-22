import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ModalContainer } from 'react-router-modal';
import ModalRoute from 'components/ModalRoute';
import Project from 'views/Project';
import Discover from 'views/Discover';
import PageWrapper from 'components/PageWrapper';
import ErrorBoundary from 'components/ErrorBoundary';
import { CurrentUserContextProvider } from 'context/CurrentUserContext';

function App() {
  return (
    <ErrorBoundary>
      <CurrentUserContextProvider>
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
            </Switch>
            <ModalContainer />
          </PageWrapper>
        </BrowserRouter>
      </CurrentUserContextProvider>
    </ErrorBoundary>
  );
}

export default App;
