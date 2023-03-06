import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import ErrorBoundary from 'components/ErrorBoundary';
import { CurrentUserContextProvider } from 'context/CurrentUserContext';
import Routes from './Routes';
import netlifyIdentity from 'netlify-identity-widget';
import { ColorThemeContextProvider } from 'context/ColorThemeContext/ColorThemeContextProvider';
import { DuoSynth } from 'tone';
import { Button } from 'antd';

const client = new ApolloClient({
  uri: '/.netlify/functions/graphql',
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
});

function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <CurrentUserContextProvider>
          <ColorThemeContextProvider>
            <Button
              onClick={() => {
                /* TONE 14  */
                const synth = new DuoSynth({
                  vibratoAmount: 0.5,
                  vibratoRate: 5,
                  harmonicity: 1.5,
                  voice0: {
                    volume: -10,
                    portamento: 0,
                    oscillator: {
                      type: 'sine',
                    },
                    filterEnvelope: {
                      attack: 0.01,
                      decay: 0,
                      sustain: 1,
                      release: 0.5,
                    },
                    envelope: {
                      attack: 0.01,
                      decay: 0,
                      sustain: 1,
                      release: 0.5,
                    },
                  },
                  voice1: {
                    volume: -10,
                    portamento: 0,
                    oscillator: {
                      type: 'sine',
                    },
                    filterEnvelope: {
                      attack: 0.01,
                      decay: 0,
                      sustain: 1,
                      release: 0.5,
                    },
                    envelope: {
                      attack: 0.01,
                      decay: 0,
                      sustain: 1,
                      release: 0.5,
                    },
                  },
                }).toDestination();

                synth.triggerAttackRelease('C4', '8n');
              }}
            >
              asdasdads
            </Button>
            <Routes />
          </ColorThemeContextProvider>
        </CurrentUserContextProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;
