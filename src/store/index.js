import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import * as reducers from 'reducers';
import promiseMiddleware from 'redux-promise';

const reducer = combineReducers({ ...reducers });

const middlewares = compose(
  applyMiddleware(promiseMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
  reducer,
  middlewares
);

export default store;
