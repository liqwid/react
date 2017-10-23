import { LOAD_INITIAL_CURRENCIES, ADD_BALANCE, SUBSTRACT_BALANCE,
         UPDATE_EXCHANGE_AMOUNT, UPDATE_RATES, LOAD_RATES, UPDATE_RATES_LOADING_STATE,
         ADD_CURRENCY, REMOVE_CURRENCY, SHOW_RATES_ERROR } from 'action-types';
import { omit } from 'utils';
import { INITIAL_CURRENCY_BALANCE, INITIAL_CURRENCY_EXCHANGE_AMOUNT, INITIAL_CURRENCY_RATE,
         BALANCE_FOR_STARTING_CURRENCIES, INITIAL_RATE_LOADING_STATE, INITIAL_RATE_ERROR_STATE,
         currencyIdsHandlers, currenciesByIdHandlers } from '../currencies';

function constructCurrenciesByIdWithBalance(currencyIds, balance) {
  return currencyIds.reduce((result, currencyId) => ({
    ...result,
    [currencyId]: {
      balance,
      exchangeAmount : INITIAL_CURRENCY_EXCHANGE_AMOUNT,
      rate           : INITIAL_CURRENCY_RATE,
      rateIsLoading  : INITIAL_RATE_LOADING_STATE,
      showRatesError : INITIAL_RATE_ERROR_STATE
    }
  }), {});
}

const constructCurrenciesById = (currencyIds) =>
  constructCurrenciesByIdWithBalance(currencyIds, INITIAL_CURRENCY_BALANCE);

const INITIAL_CURRENCY_IDS        = ['USD', 'EUR', 'GBP'];
const ANOTHER_CURRENCY_IDS        = ['JPY', 'USD', 'GBP'];
const NEW_CURRENCY_ID             = 'JPY';
const EXISTING_CURRENCY_ID        = 'USD';
const CURRENCY_IDS_AFTER_REMOVAL  = ['EUR', 'GBP'];
const CURRENCY_IDS_AFTER_ADDITION = ['USD', 'EUR', 'GBP', 'JPY'];

const INITIAL_CURRENCIES_BY_ID        = constructCurrenciesById(INITIAL_CURRENCY_IDS);
const CURRENCIES_BY_ID_AFTER_REMOVAL  = constructCurrenciesById(CURRENCY_IDS_AFTER_REMOVAL);
const CURRENCIES_BY_ID_AFTER_ADDITION = constructCurrenciesById(CURRENCY_IDS_AFTER_ADDITION);
const ANOTHER_CURRENCIES_BY_ID        = constructCurrenciesByIdWithBalance(
  ANOTHER_CURRENCY_IDS, BALANCE_FOR_STARTING_CURRENCIES
);

const BALANCE = 50;
const NEW_CURRENCY_EXCHANGE_AMOUNT = 42.42;
const NEW_RATES_TO_USD = {
  USD : 1,
  EUR : 0.846,
  GBP : 0.752
};
const NEW_RATES_LOADING_STATE = {
  USD : false,
  EUR : true,
  GBP : false
};
const NEW_RATES_ERROR_STATE = [
  'USD',
  'EUR',
  'GBP'
];

function checkSiblingItemsMutation(state, idKey, id, actionType, updateKey, updateValue) {
  const stateWithoutUpdatedItem = omit(state, id);
  const newState = currenciesByIdHandlers[actionType](
    state,
    { [idKey]: id, [updateKey]: updateValue }
  );
  const newStateWithoutUpdatedItem = omit(newState, id);

  expect(stateWithoutUpdatedItem).toEqual(
    expect.objectContaining(newStateWithoutUpdatedItem)
  );
}

function checkSiblingAttributesMutation(state, idKey, id, actionType, updateKey, updateValue) {
  const oldAttributes = omit(state[id], updateKey);
  const newState = currenciesByIdHandlers[actionType](
    state,
    { [idKey]: id, [updateKey]: updateValue }
  );
  const newAttributes = omit(newState[EXISTING_CURRENCY_ID], updateKey);

  expect(newAttributes).toEqual(expect.objectContaining(oldAttributes));
}

describe('currencyIdsHandlers', () => {
  describe(LOAD_INITIAL_CURRENCIES, () => {
    it('should reset currencyIds', () => {
      const newCurrencyIds = currencyIdsHandlers[LOAD_INITIAL_CURRENCIES](
        INITIAL_CURRENCY_IDS,
        { currencyIds: ANOTHER_CURRENCY_IDS }
      );

      expect(newCurrencyIds).toEqual(ANOTHER_CURRENCY_IDS);
    });
  });

  describe(ADD_CURRENCY, () => {
    it('should add currency id ', () => {
      const newCurrencyIds = currencyIdsHandlers[ADD_CURRENCY](
        INITIAL_CURRENCY_IDS,
        { currencyId: NEW_CURRENCY_ID }
      );

      expect(newCurrencyIds).toEqual(expect.arrayContaining(CURRENCY_IDS_AFTER_ADDITION));
    });

    it('should not add existing currency id', () => {
      const newCurrencyIds = currencyIdsHandlers[ADD_CURRENCY](
        INITIAL_CURRENCY_IDS,
        { currencyId: EXISTING_CURRENCY_ID }
      );

      expect(newCurrencyIds).toEqual(expect.arrayContaining(INITIAL_CURRENCY_IDS));
    });
  });


  describe(REMOVE_CURRENCY, () => {
    it('should remove existing currency id', () => {
      const newCurrencyIds = currencyIdsHandlers[REMOVE_CURRENCY](
        INITIAL_CURRENCY_IDS,
        { currencyId: EXISTING_CURRENCY_ID }
      );

      expect(newCurrencyIds).toEqual(expect.arrayContaining(CURRENCY_IDS_AFTER_REMOVAL));
    });

    it('should return previos state if currency id does not exist', () => {
      const newCurrencyIds = currencyIdsHandlers[REMOVE_CURRENCY](
        INITIAL_CURRENCY_IDS,
        { currencyId: NEW_CURRENCY_ID }
      );

      expect(newCurrencyIds).toEqual(expect.arrayContaining(INITIAL_CURRENCY_IDS));
    });
  });
});

describe('currenciesByIdHandlers', () => {
  describe(LOAD_INITIAL_CURRENCIES, () => {
    it('should set currencies with starting balance', () => {
      const newCurrencies = currenciesByIdHandlers[LOAD_INITIAL_CURRENCIES](
        INITIAL_CURRENCIES_BY_ID,
        { currencyIds: ANOTHER_CURRENCY_IDS }
      );

      expect(newCurrencies).toEqual(expect.objectContaining(ANOTHER_CURRENCIES_BY_ID));
    });
  });

  describe(ADD_CURRENCY, () => {
    it('should add currency with default values', () => {
      const newCurrencies = currenciesByIdHandlers[ADD_CURRENCY](
        INITIAL_CURRENCIES_BY_ID,
        { currencyId: NEW_CURRENCY_ID }
      );

      expect(newCurrencies).toEqual(expect.objectContaining(CURRENCIES_BY_ID_AFTER_ADDITION));
    });

    it('should not add currency with existing id', () => {
      const newCurrencies = currenciesByIdHandlers[ADD_CURRENCY](
        INITIAL_CURRENCIES_BY_ID,
        { currencyId: EXISTING_CURRENCY_ID }
      );

      expect(newCurrencies).toEqual(expect.objectContaining(INITIAL_CURRENCIES_BY_ID));
    });
  });

  describe(REMOVE_CURRENCY, () => {
    it('should remove currency with existing id', () => {
      const newCurrencies = currenciesByIdHandlers[REMOVE_CURRENCY](
        INITIAL_CURRENCIES_BY_ID,
        { currencyId: EXISTING_CURRENCY_ID }
      );

      expect(newCurrencies).toEqual(expect.objectContaining(CURRENCIES_BY_ID_AFTER_REMOVAL));
    });

    it('should not remove currency if non-existent id', () => {
      const newCurrencies = currenciesByIdHandlers[REMOVE_CURRENCY](
        INITIAL_CURRENCIES_BY_ID,
        { currencyId: NEW_CURRENCY_ID }
      );

      expect(newCurrencies).toEqual(expect.objectContaining(INITIAL_CURRENCIES_BY_ID));
    });
  });

  describe(ADD_BALANCE, () => {
    it('should update balance of the currency', () => {
      const newState = currenciesByIdHandlers[ADD_BALANCE](
        INITIAL_CURRENCIES_BY_ID,
        { currencyId: EXISTING_CURRENCY_ID, amount: BALANCE }
      );
      const initialAmount = INITIAL_CURRENCIES_BY_ID[EXISTING_CURRENCY_ID].balance;

      expect(newState[EXISTING_CURRENCY_ID].balance).toBe(initialAmount + BALANCE);
    });

    it('should copy currency\'s other properties', () => {
      checkSiblingAttributesMutation(
        INITIAL_CURRENCIES_BY_ID,
        'currencyId',
        EXISTING_CURRENCY_ID,
        ADD_BALANCE,
        'balance',
        BALANCE
      );
    });

    it('should copy other currencies\' references', () => {
      checkSiblingItemsMutation(
        INITIAL_CURRENCIES_BY_ID,
        'currencyId',
        EXISTING_CURRENCY_ID,
        ADD_BALANCE,
        'balance',
        BALANCE
      );
    });
  });

  describe(SUBSTRACT_BALANCE, () => {
    it('should update balance of the currency', () => {
      const newState = currenciesByIdHandlers[SUBSTRACT_BALANCE](
        INITIAL_CURRENCIES_BY_ID,
        { currencyId: EXISTING_CURRENCY_ID, amount: BALANCE }
      );
      const initialAmount = INITIAL_CURRENCIES_BY_ID[EXISTING_CURRENCY_ID].balance;

      expect(newState[EXISTING_CURRENCY_ID].balance).toBe(initialAmount - BALANCE);
    });

    it('should copy currency\'s other properties', () => {
      checkSiblingAttributesMutation(
        INITIAL_CURRENCIES_BY_ID,
        'currencyId',
        EXISTING_CURRENCY_ID,
        SUBSTRACT_BALANCE,
        'balance',
        BALANCE
      );
    });

    it('should copy other currencies\' references', () => {
      checkSiblingItemsMutation(
        INITIAL_CURRENCIES_BY_ID,
        'currencyId',
        EXISTING_CURRENCY_ID,
        SUBSTRACT_BALANCE,
        'balance',
        BALANCE
      );
    });
  });

  describe(UPDATE_EXCHANGE_AMOUNT, () => {
    it('should update exchange amount of the currency', () => {
      const newState = currenciesByIdHandlers[UPDATE_EXCHANGE_AMOUNT](
        INITIAL_CURRENCIES_BY_ID,
        { currencyId: EXISTING_CURRENCY_ID, exchangeAmount: NEW_CURRENCY_EXCHANGE_AMOUNT }
      );

      expect(newState[EXISTING_CURRENCY_ID].exchangeAmount).toBe(NEW_CURRENCY_EXCHANGE_AMOUNT);
    });

    it('should copy currency\'s other properties', () => {
      checkSiblingAttributesMutation(
        INITIAL_CURRENCIES_BY_ID,
        'currencyId',
        EXISTING_CURRENCY_ID,
        UPDATE_EXCHANGE_AMOUNT,
        'exchangeAmount',
        NEW_CURRENCY_EXCHANGE_AMOUNT
      );
    });

    it('should copy other currencies\' references', () => {
      checkSiblingItemsMutation(
        INITIAL_CURRENCIES_BY_ID,
        'currencyId',
        EXISTING_CURRENCY_ID,
        UPDATE_EXCHANGE_AMOUNT,
        'exchangeAmount',
        NEW_CURRENCY_EXCHANGE_AMOUNT
      );
    });
  });

  describe(LOAD_RATES, () => {
    it('should update rate of every specified currency', () => {
      const newState = currenciesByIdHandlers[LOAD_RATES](
        INITIAL_CURRENCIES_BY_ID,
        { ratesToUsd: NEW_RATES_TO_USD }
      );

      Object.entries(NEW_RATES_TO_USD).forEach(([currencyId, rate]) =>
        expect(rate).toBe(newState[currencyId].rate)
      );
    });

    it('should copy every currency\'s other properties except error and loading state', () => {
      const newState = currenciesByIdHandlers[LOAD_RATES](
        INITIAL_CURRENCIES_BY_ID,
        { ratesToUsd: NEW_RATES_TO_USD }
      );

      Object.keys(NEW_RATES_TO_USD).forEach((currencyId) => {
        const currencyWithoutRate = omit(newState[currencyId], 'rate', 'showRatesError', 'rateIsLoading');
        const oldCurrencyWithoutRate = omit(INITIAL_CURRENCIES_BY_ID[currencyId], 'rate', 'showRatesError', 'rateIsLoading');
        expect(currencyWithoutRate).toEqual(expect.objectContaining(oldCurrencyWithoutRate));
      });
    });

    it('should unset the rates error for specified currencies', () => {
      const stateWithErrors = currenciesByIdHandlers[SHOW_RATES_ERROR](
        INITIAL_CURRENCIES_BY_ID,
        { currencyIds: INITIAL_CURRENCY_IDS }
      );
      const newState = currenciesByIdHandlers[LOAD_RATES](
        stateWithErrors,
        { ratesToUsd: NEW_RATES_TO_USD }
      );

      Object.keys(NEW_RATES_TO_USD).forEach((currencyId) => {
        expect(newState[currencyId].showRatesError).toEqual(false);
      });
    });
  });

  describe(UPDATE_RATES, () => {
    it('should update rate of every specified currency', () => {
      const newState = currenciesByIdHandlers[UPDATE_RATES](
        INITIAL_CURRENCIES_BY_ID,
        { ratesToUsd: NEW_RATES_TO_USD }
      );

      Object.entries(NEW_RATES_TO_USD).forEach(([currencyId, rate]) =>
        expect(rate).toBe(newState[currencyId].rate)
      );
    });

    it('should copy every currency\'s other properties except error', () => {
      const newState = currenciesByIdHandlers[UPDATE_RATES](
        INITIAL_CURRENCIES_BY_ID,
        { ratesToUsd: NEW_RATES_TO_USD }
      );

      Object.keys(NEW_RATES_TO_USD).forEach((currencyId) => {
        const currencyWithoutRate = omit(newState[currencyId], 'rate', 'showRatesError');
        const oldCurrencyWithoutRate = omit(INITIAL_CURRENCIES_BY_ID[currencyId], 'rate', 'showRatesError');
        expect(currencyWithoutRate).toEqual(expect.objectContaining(oldCurrencyWithoutRate));
      });
    });

    it('should unset the rates error for specified currencies', () => {
      const stateWithErrors = currenciesByIdHandlers[SHOW_RATES_ERROR](
        INITIAL_CURRENCIES_BY_ID,
        { currencyIds: INITIAL_CURRENCY_IDS }
      );
      const newState = currenciesByIdHandlers[LOAD_RATES](
        stateWithErrors,
        { ratesToUsd: NEW_RATES_TO_USD }
      );

      Object.keys(NEW_RATES_TO_USD).forEach((currencyId) => {
        expect(newState[currencyId].showRatesError).toEqual(false);
      });
    });

    it('should unset the loading state for specified currencies', () => {
      const stateWithLoadings = currenciesByIdHandlers[UPDATE_RATES_LOADING_STATE](
        INITIAL_CURRENCIES_BY_ID,
        { loadingStates: NEW_RATES_LOADING_STATE }
      );
      const newState = currenciesByIdHandlers[LOAD_RATES](
        stateWithLoadings,
        { ratesToUsd: NEW_RATES_TO_USD }
      );

      INITIAL_CURRENCY_IDS.forEach((currencyId) => {
        expect(newState[currencyId].rateIsLoading).toEqual(false);
      });
    });
  });

  describe(UPDATE_RATES_LOADING_STATE, () => {
    it('should update loading state of every specified currency', () => {
      const newState = currenciesByIdHandlers[UPDATE_RATES_LOADING_STATE](
        INITIAL_CURRENCIES_BY_ID,
        { loadingStates: NEW_RATES_LOADING_STATE }
      );

      Object.entries(NEW_RATES_LOADING_STATE).forEach(([currencyId, rateIsLoading]) =>
        expect(rateIsLoading).toBe(newState[currencyId].rateIsLoading)
      );
    });

    it('should copy every currency\'s other properties except error', () => {
      const newState = currenciesByIdHandlers[UPDATE_RATES_LOADING_STATE](
        INITIAL_CURRENCIES_BY_ID,
        { loadingStates: NEW_RATES_LOADING_STATE }
      );

      Object.keys(NEW_RATES_LOADING_STATE).forEach((currencyId) => {
        const currencyWithoutLoading = omit(newState[currencyId], 'rateIsLoading', 'showRatesError');
        const oldCurrencyWithoutLoading = omit(INITIAL_CURRENCIES_BY_ID[currencyId], 'rateIsLoading', 'showRatesError');
        expect(currencyWithoutLoading).toEqual(
          expect.objectContaining(oldCurrencyWithoutLoading)
        );
      });
    });

    it('should unset the rates error for specified currencies', () => {
      const stateWithErrors = currenciesByIdHandlers[SHOW_RATES_ERROR](
        INITIAL_CURRENCIES_BY_ID,
        { currencyIds: INITIAL_CURRENCY_IDS }
      );
      const newState = currenciesByIdHandlers[UPDATE_RATES_LOADING_STATE](
        stateWithErrors,
        { loadingStates: NEW_RATES_LOADING_STATE }
      );

      Object.keys(NEW_RATES_LOADING_STATE).forEach((currencyId) => {
        expect(newState[currencyId].showRatesError).toEqual(false);
      });
    });
  });

  describe(SHOW_RATES_ERROR, () => {
    it('should update rates error state of every specified currency', () => {
      const newState = currenciesByIdHandlers[SHOW_RATES_ERROR](
        INITIAL_CURRENCIES_BY_ID,
        { currencyIds: NEW_RATES_ERROR_STATE }
      );

      NEW_RATES_ERROR_STATE.forEach((currencyId) =>
        expect(newState[currencyId].showRatesError).toBe(true)
      );
    });

    it('should copy every currency\'s other properties except loading state', () => {
      const newState = currenciesByIdHandlers[SHOW_RATES_ERROR](
        INITIAL_CURRENCIES_BY_ID,
        { currencyIds: NEW_RATES_ERROR_STATE }
      );

      Object.keys(NEW_RATES_LOADING_STATE).forEach((currencyId) => {
        const currencyWithoutRatesError = omit(newState[currencyId], 'showRatesError', 'rateIsLoading');
        const oldCurrencyWithoutRatesError = omit(INITIAL_CURRENCIES_BY_ID[currencyId], 'showRatesError', 'rateIsLoading');
        expect(currencyWithoutRatesError).toEqual(
          expect.objectContaining(oldCurrencyWithoutRatesError)
        );
      });
    });

    it('should unset the loading state for specified currencies', () => {
      const stateWithLoadings = currenciesByIdHandlers[UPDATE_RATES_LOADING_STATE](
        INITIAL_CURRENCIES_BY_ID,
        { loadingStates: NEW_RATES_LOADING_STATE }
      );
      const newState = currenciesByIdHandlers[SHOW_RATES_ERROR](
        stateWithLoadings,
        { currencyIds: INITIAL_CURRENCY_IDS }
      );

      INITIAL_CURRENCY_IDS.forEach((currencyId) => {
        expect(newState[currencyId].rateIsLoading).toEqual(false);
      });
    });
  });
});
