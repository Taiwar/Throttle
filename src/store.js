import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from './reducers';

const middleware = applyMiddleware(thunk, createLogger({}));

export default createStore(reducers, middleware);