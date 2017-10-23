import { LOAD_INITIAL_CURRENCIES } from 'action-types';
import { createReducer } from 'utils';

export const INITIAL_APP_LOADED_STATE = false;

export const appLoadedHandlers = {
  [LOAD_INITIAL_CURRENCIES]: () => true
};

export const appLoaded = createReducer(INITIAL_APP_LOADED_STATE, appLoadedHandlers);
