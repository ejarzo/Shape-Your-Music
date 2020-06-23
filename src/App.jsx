import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import ErrorBoundary from 'components/ErrorBoundary';
import { CurrentUserContextProvider } from 'context/CurrentUserContext';
import Routes from './Routes';
import netlifyIdentity from 'netlify-identity-widget';
import gql from 'graphql-tag';

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: '/.netlify/functions/graphql',
  cache,
  // connectToDevTools: true,
  request: operation => {
    const currentUser = netlifyIdentity.currentUser();
    console.log('current user', currentUser);
    if (currentUser) {
      currentUser.jwt().then(token => {
        console.log('TOKEN: ', token);
        operation.setContext({
          headers: {
            authorization: token ? `Bearer ${token}` : '',
          },
        });
      });
    }
  },
  resolvers: {
    Mutation: {
      toggleIsGridActive: (_root, { projectId }, { cache, getCacheKey }) => {
        console.log('toggleIsGridActive called');
        const id = getCacheKey({ __typename: 'Project', id: projectId });
        const fragment = gql`
          fragment toggleIsGridActive on Project {
            isGridActive
          }
        `;
        const project = cache.readFragment({ fragment, id });
        const data = { ...project, isGridActive: !project.isGridActive };
        cache.writeData({ id, data });
        return null;
      },
    },
  },
});

cache.writeData({
  data: {
    unsavedProject: { __typename: 'Project', id: 1, isGridActive: false },
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
