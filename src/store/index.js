import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import * as reducers from 'reducers';
import thunk from 'redux-thunk';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const reducer = combineReducers({ ...reducers });
const middlewares = composeEnhancers(applyMiddleware(thunk));

const store = createStore(
  reducer,
  middlewares
);

export default store;
