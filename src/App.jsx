import React from 'react';
import Project from 'components/Project';

const defaultState = {
  name: 'New Project',
  tempo: 50,
  tonic: 'a',
  scale: 'major'
};

function App () {
  return (
    <Project initState={defaultState} />
  );
}

export default App;
