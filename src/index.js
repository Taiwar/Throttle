import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { store, history, persistor } from './store';
import Root from './containers/Root';

ReactDOM.render(
    <Root store={store} history={history} persistor={persistor}/>,
    document.getElementById('root')
);