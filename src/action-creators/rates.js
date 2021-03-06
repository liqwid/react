import { fetchRates } from 'api';
import { UPDATE_RATES, UPDATE_RATES_LOADING_STATE, LOAD_RATES, SHOW_RATES_ERROR } from 'action-types';

export const RATES_POLL_TIMEOUT = 10000;
let rateInterval;

function getRateLoadingPayload(currencyIds, loadingState) {
  return currencyIds.reduce((result, currencyId) => ({
    ...result,
    [currencyId]: loadingState
  }), {});
}

function setUnloadedRatesState(dispatch, currencyIds) {
  dispatch({
    type    : UPDATE_RATES_LOADING_STATE,
    payload : {
      loadingStates: getRateLoadingPayload(currencyIds, true)
    }
  });
}

function loadRates(dispatch, ratesByCurrencyIds) {
  dispatch({
    type    : LOAD_RATES,
    payload : {
      ratesToUsd: ratesByCurrencyIds
    }
  });
}

function updateRates(dispatch, ratesByCurrencyIds) {
  dispatch({
    type    : UPDATE_RATES,
    payload : {
      ratesToUsd: ratesByCurrencyIds
    }
  });
}

function showRatesError(dispatch, currencyIds) {
  dispatch({
    type    : SHOW_RATES_ERROR,
    payload : { currencyIds }
  });
}

/**
 * Fetches exchange rates for new currencies
 * Manages rates loading states
 * @param {CurrencyId[]} currencyIds
 */
export function initRates(currencyIds) {
  return (dispatch) => {
    setUnloadedRatesState(dispatch, currencyIds);

    return fetchRates(currencyIds)
    .then(loadRates.bind(null, dispatch))
    .catch(showRatesError.bind(null, dispatch, currencyIds));
  };
}

/**
 * Starts regular updates for currency rates
 * Cancels previous update routine
 * @param {CurrencyId[]} currencyIds
 */
export function pollForRates(currencyIds) {
  return (dispatch) => {
    clearInterval(rateInterval);
    rateInterval = setInterval(() => {
      fetchRates(currencyIds)
      .then(updateRates.bind(null, dispatch))
      .catch(showRatesError.bind(null, dispatch, currencyIds));
    }, RATES_POLL_TIMEOUT);
  };
}

/**
 * Stops updating currency rates
 */
export function stopPollingForRates() {
  clearInterval(rateInterval);
}
