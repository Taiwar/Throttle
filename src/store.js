import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const history = createHashHistory();
const router = routerMiddleware(history);
const middleware = applyMiddleware(router, thunk, createLogger({}));
const store = createStore(reducers, middleware);

export { store, history };