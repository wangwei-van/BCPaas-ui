import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';

import rootReducer from '../reducer/index';
import promiseMiddleware from '../util/promise-middleware';

const logger = createLogger();

const enhancer = compose(
  applyMiddleware(promiseMiddleware(), logger)
)

export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, enhancer)
  return store;
}