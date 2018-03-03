import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';
import reducers from './reducers';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);
const history = createHashHistory();
const router = routerMiddleware(history);
const middleware = applyMiddleware(router, thunk, createLogger({}));
let store = createStore(persistedReducer, middleware);
let persistor = persistStore(store);

export { store, history, persistor};