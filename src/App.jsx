import React from 'react';
import Project from './views/Project';

const defaultState = {
  name: 'New Project',
  tempo: 50,
  tonic: 'a',
  scale: 'major',
};

function App() {
  return <Project initState={defaultState} />;
}

export default App;
