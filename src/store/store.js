import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Import the root Reducer
import rootReducer from '../reducers/index';

const middleware = [thunk];

const store = createStore(
    rootReducer,
    applyMiddleware(...middleware)
);

export default store;