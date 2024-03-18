import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import * as serviceWorker from './serviceWorker';

import { initSentry } from 'utils/errorTracking';

import './static/css/normalize.css';
import './static/css/ionicons.min.css';
// import './static/css/rc-slider.css';
import './static/css/main.css';

initSentry();

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register({
  onUpdate: registration => {
    alert('New version available!  Ready to update?');
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  },
});
