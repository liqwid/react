import { CHANGE_TO, LOAD_INITIAL_CURRENCIES } from 'action-types';
import { createReducer } from 'utils';

export const INITIAL_TO_STATE = null;

export const toHandlers = {
  /**
   * Changes currency to convert to
   * @param state
   * @param {CurrencyId} payload.currencyId
   */
  [CHANGE_TO]: (state, { currencyId }) => currencyId,

  /**
   * Sets initial currency to convert to
   * @param state
   * @param {CurrencyId[]} payload.currencyIds
   */
  [LOAD_INITIAL_CURRENCIES]: (state, { currencyIds }) => currencyIds[1] || currencyIds[0]
};

export const to = createReducer(INITIAL_TO_STATE, toHandlers);
