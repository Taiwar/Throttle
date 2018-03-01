import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { store, history } from './store';
import Root from "./containers/Root";

ReactDOM.render(
    <Root store={store} history={history} />,
    document.getElementById('root')
);