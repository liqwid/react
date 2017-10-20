import { CHANGE_FROM, LOAD_INITIAL_CURRENCIES } from 'action-types';
import { createReducer } from 'utils';

export const INITIAL_FROM_STATE = null;

export const fromHandlers = {
  /**
   * Changes currency to convert from
   * @param state
   * @param {CurrencyId} payload.currencyId
   */
  [CHANGE_FROM]: (state, { currencyId }) => currencyId,

  /**
   * Sets initial currency to convert from
   * @param state
   * @param {CurrencyId[]} payload.currencyIds
   */
  [LOAD_INITIAL_CURRENCIES]: (state, { currencyIds }) => currencyIds[0]
};

export const from = createReducer(INITIAL_FROM_STATE, fromHandlers);
