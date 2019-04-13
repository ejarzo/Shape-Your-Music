import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as Sentry from '@sentry/browser';

import './static/css/normalize.css';
import './static/css/ionicons.min.css';
import './static/css/react-select/react-select-theme.css';
import './static/css/rc-slider.css';
import './static/css/main.css';

Sentry.init({
  dsn: 'https://c3e720ff6fc54122b163c1bce3fe0bed@sentry.io/1438424',
  // beforeSend(event, hint) {
  //   // Check if it is an exception, and if so, show the report dialog
  //   if (event.exception) {
  //     Sentry.showReportDialog({ eventId: event.event_id });
  //   }
  //   return event;
  // },
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
