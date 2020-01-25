import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import ErrorBoundary from 'components/ErrorBoundary';
import { CurrentUserContextProvider } from 'context/CurrentUserContext';
import Routes from './Routes';
import { getToken } from 'utils/user';
import netlifyIdentity from 'netlify-identity-widget';

const client = new ApolloClient({
  uri: '/.netlify/functions/graphql',
  request: operation => {
    const currentUser = netlifyIdentity.currentUser();
    console.log('Got user', currentUser);
    const token = getToken(currentUser);
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <CurrentUserContextProvider>
          <Routes />
        </CurrentUserContextProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;
