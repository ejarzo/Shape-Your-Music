import React from 'react';
import Project from './views/Project';
import ErrorBoundary from './components/ErrorBoundary';

const defaultState = {
  name: 'New Project',
  tempo: 50,
  tonic: 'a',
  scale: 'major',
};

function App() {
  return (
    <ErrorBoundary>
      <Project initState={defaultState} />
    </ErrorBoundary>
  );
}

export default App;
