import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './static/css/normalize.css';
import './static/css/ionicons.min.css';
import './static/css/react-select/react-select-theme.css';
import './static/css/rc-slider.css';
import './static/css/main.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
