import { combineReducers } from 'redux';

import downloads from './downloadsReducer';
import settings from './settingsReducer';

export default combineReducers({
    downloads,
    settings
})