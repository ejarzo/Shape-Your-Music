import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import { CurrentUserContextProvider } from 'context/CurrentUserContext';
import Routes from './Routes';
import { ColorThemeContextProvider } from 'context/ColorThemeContext/ColorThemeContextProvider';

function App() {
  return (
    <ErrorBoundary>
      <CurrentUserContextProvider>
        <ColorThemeContextProvider>
          <Routes />
        </ColorThemeContextProvider>
      </CurrentUserContextProvider>
    </ErrorBoundary>
  );
}

export default App;
