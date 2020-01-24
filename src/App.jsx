import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import ErrorBoundary from 'components/ErrorBoundary';
import Routes from './Routes';
import { getToken } from 'utils/user';
import { message } from 'antd';
import { IdentityContextProvider } from 'react-netlify-identity-widget';
import { useIdentityContext } from 'react-netlify-identity';

/* Global style for message component */
message.config({ top: 90 });

const IDENTITY_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://shapeyourmusic-staging.netlify.com/'
    : window.location.origin;

const AppIdentityWrapper = ({ children }) => {
  const { user } = useIdentityContext();
  const client = new ApolloClient({
    uri: '/.netlify/functions/graphql',
    request: operation => {
      const token = getToken(user);
      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      });
    },
  });
  return children({ client });
};

function App() {
  return (
    <IdentityContextProvider url={IDENTITY_URL}>
      <AppIdentityWrapper>
        {({ client }) => (
          <ErrorBoundary>
            <ApolloProvider client={client}>
              <Routes />
            </ApolloProvider>
          </ErrorBoundary>
        )}
      </AppIdentityWrapper>
    </IdentityContextProvider>
  );
}

export default App;
