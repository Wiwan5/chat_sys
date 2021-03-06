import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';

import App from './App';

import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
