import { CHANGE_TO } from 'action-types';
import { createReducer } from 'utils';

export const INITIAL_TO_STATE = null;

export const toHandlers = {
  [CHANGE_TO]: (state, { currencyId }) => currencyId
};

export const to = createReducer(INITIAL_TO_STATE, toHandlers);
