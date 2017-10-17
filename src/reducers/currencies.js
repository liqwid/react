import { UPDATE_BALANCE, UPDATE_EXCHANGE_AMOUNT,
         ADD_CURRENCY, REMOVE_CURRENCY, LOAD_RATES,
         UPDATE_RATES, UPDATE_RATES_LOADING_STATE, SHOW_RATES_ERROR } from 'action-types';
import { createReducer, omit } from 'utils';

export const INITIAL_CURRENCY_BALANCE         = 0;
export const INITIAL_CURRENCY_EXCHANGE_AMOUNT = null;
export const INITIAL_CURRENCY_RATE            = null;
export const INITIAL_RATE_LOADING_STATE       = true;

const BALANCE_FOR_STARTING_CURRENCIES = 100;
const INITIAL_CURRENCY_IDS = ['USD', 'EUR', 'GBP'];
const INITIAL_CURRENCIES_BY_ID = INITIAL_CURRENCY_IDS.reduce((result, currencyId) => ({
  ...result,
  [currencyId]: {
    balance        : BALANCE_FOR_STARTING_CURRENCIES,
    exchangeAmount : INITIAL_CURRENCY_EXCHANGE_AMOUNT,
    rate           : INITIAL_CURRENCY_RATE,
    rateIsLoading  : INITIAL_RATE_LOADING_STATE
  }
}), {});

export const currencyIdsHandlers = {
  /**
   * Adds target currency id
   * @param state
   * @param payload.currencyId
   */
  [ADD_CURRENCY]: (state, { currencyId }) => {
    if (state.includes(currencyId)) return state;
    return state.concat(currencyId);
  },

  /**
   * Removes target currency id
   * @param state
   * @param payload.currencyId
   */
  [REMOVE_CURRENCY]: (state, { currencyId }) =>
    state.filter(prevCurrencyId => prevCurrencyId !== currencyId)
};

export const currenciesByIdHandlers = {
  /**
   * Adds target currency
   * with zero balance, unset exchangeAmount, unset rate and negative rate loading state
   * @param state
   * @param {CurrencyId} payload.currencyId
   */
  [ADD_CURRENCY]: (state, { currencyId }) => {
    if (Object.keys(state).includes(currencyId)) return state;
    return {
      ...state,
      [currencyId]: {
        balance        : INITIAL_CURRENCY_BALANCE,
        exchangeAmount : INITIAL_CURRENCY_EXCHANGE_AMOUNT,
        rate           : INITIAL_CURRENCY_RATE,
        rateIsLoading  : INITIAL_RATE_LOADING_STATE
      }
    };
  },

  /**
   * Removes target currency
   * @param state
   * @param {CurrencyId} payload.currencyId
   */
  [REMOVE_CURRENCY]: (state, { currencyId }) => omit(state, currencyId),

  /**
   * Updates available balance for target currency
   * @param state
   * @param payload.currencyId
   * @param {number} payload.balance
   */
  [UPDATE_BALANCE]: (state, { currencyId, balance }) => ({
    ...state,
    [currencyId]: {
      ...state[currencyId],
      balance
    }
  }),

  /**
   * Updates amount that is requested for exchange for target currency
   * @param state
   * @param payload.currencyId
   * @param {number} payload.exchangeAmount
   */
  [UPDATE_EXCHANGE_AMOUNT]: (state, { currencyId, exchangeAmount }) => ({
    ...state,
    [currencyId]: {
      ...state[currencyId],
      exchangeAmount
    }
  }),

  /**
   * Loads rates for specified currencies
   * Changes loading state to false and removes rate loading error
   * @param state
   * @param {Object<CurrencyId, ExchangeRate>} payload.ratesToUsd - currencyId to usdRate hashMap:
   * {
   *  "EUR": 0.85,
   *  "USD": 0.75,
   *  ...
   * }
   */
  [LOAD_RATES]: (state, { ratesToUsd }) =>
    Object.entries(ratesToUsd).reduce((newState, [currencyId, rateToUsd]) => ({
      ...newState,
      [currencyId]: {
        ...newState[currencyId],
        rate           : rateToUsd,
        rateIsLoading  : false,
        showRatesError : false
      }
    }), state),

  /**
   * Updates rate of specified currencies
   * Removes rate loading error
   * @param state
   * @param {Object<CurrencyId, ExchangeRate>} payload.ratesToUsd currencyId to usdRate hashMap:
   * {
   *  "EUR": 0.85,
   *  "GBP": 0.75,
   *  ...
   * }
   */
  [UPDATE_RATES]: (state, { ratesToUsd }) =>
    Object.entries(ratesToUsd).reduce((newState, [currencyId, rateToUsd]) => ({
      ...newState,
      [currencyId]: {
        ...newState[currencyId],
        rate           : rateToUsd,
        showRatesError : false
      }
    }), state),

  /**
   * Updates loading state of speicified currencies
   * Removes rate loading error
   * @param state
   * @param {Object<CurrencyId, boolean>} payload.loadingStates - currencyId to usdRate hashMap:
   * {
   *  "EUR": true,
   *  "USD": false,
   *  ...
   * }
   */
  [UPDATE_RATES_LOADING_STATE]: (state, { loadingStates }) =>
    Object.entries(loadingStates).reduce((newState, [currencyId, loadingState]) => ({
      ...newState,
      [currencyId]: {
        ...newState[currencyId],
        rateIsLoading  : loadingState,
        showRatesError : false
      }
    }), state),

  /**
   * Adds rates loading error for specified currencies
   * @param state
   * @param {CurrencyId[]} payload.currencyIds
   */
  [SHOW_RATES_ERROR]: (state, { currencyIds }) =>
    currencyIds.reduce((newState, currencyId) => ({
      ...newState,
      [currencyId]: {
        ...newState[currencyId],
        showRatesError: true
      }
    }), state)
};

export const currencyIds    = createReducer(INITIAL_CURRENCY_IDS, currencyIdsHandlers);
export const currenciesById = createReducer(INITIAL_CURRENCIES_BY_ID, currenciesByIdHandlers);
