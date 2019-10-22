import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import { CurrentUserContextProvider } from 'context/CurrentUserContext';
import Routes from './Routes';

function App() {
  return (
    <ErrorBoundary>
      <CurrentUserContextProvider>
        <Routes />
      </CurrentUserContextProvider>
    </ErrorBoundary>
  );
}

export default App;
