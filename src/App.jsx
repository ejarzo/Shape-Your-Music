import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Project from 'views/Project';
import Discover from 'views/Discover';
import Login from 'views/Login';
import PageWrapper from 'components/PageWrapper';
import ErrorBoundary from 'components/ErrorBoundary';
import { CurrentUserContextProvider } from 'context/CurrentUserContext';

const defaultState = {
  name: 'New Project',
  tempo: 50,
  tonic: 'a',
  scale: 'major',
};

function App() {
  return (
    <ErrorBoundary>
      <CurrentUserContextProvider>
        <BrowserRouter>
          <PageWrapper>
            <Switch>
              <Route
                exact
                path="/"
                component={() => <Project initState={defaultState} />}
              />
              <Route path="/discover" component={Discover} />
              <Route path="/login" component={Login} />
            </Switch>
          </PageWrapper>
        </BrowserRouter>
      </CurrentUserContextProvider>
    </ErrorBoundary>
  );
}

export default App;
