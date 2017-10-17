import { CHANGE_FROM } from 'action-types';
import { createReducer } from 'utils';

export const INITIAL_FROM_STATE = null;

export const fromHandlers = {
  [CHANGE_FROM]: (state, { currencyId }) => currencyId
};

export const from = createReducer(INITIAL_FROM_STATE, fromHandlers);
