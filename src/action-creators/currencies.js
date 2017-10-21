import { LOAD_INITIAL_CURRENCIES, UPDATE_EXCHANGE_AMOUNT,
         ADD_BALANCE, SUBSTRACT_BALANCE } from 'action-types';

export const INITIAL_CURRENCY_IDS = ['USD', 'EUR', 'GBP'];
export const CURRENCIES_LOAD_TIMEOUT = 1000;

export function loadInitialCurrencies() {
  return (dispatch) => {
    setTimeout(() => dispatch({
      type    : LOAD_INITIAL_CURRENCIES,
      payload : {
        currencyIds: INITIAL_CURRENCY_IDS
      }
    }), CURRENCIES_LOAD_TIMEOUT);
  };
}

export function updateExchangeAmount(currencyId, exchangeAmount) {
  return {
    type    : UPDATE_EXCHANGE_AMOUNT,
    payload : { currencyId, exchangeAmount }
  };
}

export function addBalance(currencyId, amount) {
  return {
    type    : ADD_BALANCE,
    payload : { currencyId, amount }
  };
}

export function substractBalance(currencyId, amount) {
  return {
    type    : SUBSTRACT_BALANCE,
    payload : { currencyId, amount }
  };
}
