import { UPDATE_BALANCE, UPDATE_EXCHANGE_AMOUNT,
         UPDATE_RATES, UPDATE_RATES_LOADING_STATE,
         ADD_CURRENCY, REMOVE_CURRENCY } from 'action-types';
import { omit } from 'utils';
import { INITIAL_CURRENCY_BALANCE, INITIAL_CURRENCY_EXCHANGE_AMOUNT,
         INITIAL_CURRENCY_RATE, INITIAL_RATE_LOADING_STATE,
         currencyIdsHandlers, currenciesByIdHandlers } from '../currencies';

function constructCurrenciesById(currencyIds) {
  return currencyIds.reduce((result, currencyId) => ({
    ...result,
    [currencyId]: {
      balance        : INITIAL_CURRENCY_BALANCE,
      exchangeAmount : INITIAL_CURRENCY_EXCHANGE_AMOUNT,
      rate           : INITIAL_CURRENCY_RATE,
      rateIsLoading  : INITIAL_RATE_LOADING_STATE
    }
  }), {});
}

const INITIAL_CURRENCY_IDS        = ['USD', 'EUR', 'GBP'];
const NEW_CURRENCY_ID             = 'JPY';
const EXISTING_CURRENCY_ID        = 'USD';
const CURRENCY_IDS_AFTER_REMOVAL  = ['EUR', 'GBP'];
const CURRENCY_IDS_AFTER_ADDITION = ['USD', 'EUR', 'GBP', 'JPY'];

const INITIAL_CURRENCIES_BY_ID        = constructCurrenciesById(INITIAL_CURRENCY_IDS);
const CURRENCIES_BY_ID_AFTER_REMOVAL  = constructCurrenciesById(CURRENCY_IDS_AFTER_REMOVAL);
const CURRENCIES_BY_ID_AFTER_ADDITION = constructCurrenciesById(CURRENCY_IDS_AFTER_ADDITION);

const NEW_CURRENCY_BALANCE = 1000;
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

function checkAttributeUpdate(state, idKey, id, actionType, updateKey, updateValue) {
  const newState = currenciesByIdHandlers[actionType](
    state,
    { [idKey]: id, [updateKey]: updateValue }
  );

  expect(newState[id][updateKey]).toBe(updateValue);
}

describe('currencyIdsHandlers', () => {
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

  describe(UPDATE_BALANCE, () => {
    it('should update balance of the currency', () => {
      checkAttributeUpdate(
        INITIAL_CURRENCIES_BY_ID,
        'currencyId',
        EXISTING_CURRENCY_ID,
        UPDATE_BALANCE,
        'balance',
        NEW_CURRENCY_BALANCE
      );
    });

    it('should copy currency\'s other properties', () => {
      checkSiblingAttributesMutation(
        INITIAL_CURRENCIES_BY_ID,
        'currencyId',
        EXISTING_CURRENCY_ID,
        UPDATE_BALANCE,
        'balance',
        NEW_CURRENCY_BALANCE
      );
    });

    it('should copy other currencies\' references', () => {
      checkSiblingItemsMutation(
        INITIAL_CURRENCIES_BY_ID,
        'currencyId',
        EXISTING_CURRENCY_ID,
        UPDATE_BALANCE,
        'balance',
        NEW_CURRENCY_BALANCE
      );
    });
  });

  describe(UPDATE_EXCHANGE_AMOUNT, () => {
    it('should update exchange amount of the currency', () => {
      checkAttributeUpdate(
        INITIAL_CURRENCIES_BY_ID,
        'currencyId',
        EXISTING_CURRENCY_ID,
        UPDATE_EXCHANGE_AMOUNT,
        'exchangeAmount',
        NEW_CURRENCY_EXCHANGE_AMOUNT
      );
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

    it('should copy every currency\'s other properties', () => {
      const newState = currenciesByIdHandlers[UPDATE_RATES](
        INITIAL_CURRENCIES_BY_ID,
        { ratesToUsd: NEW_RATES_TO_USD }
      );

      Object.keys(NEW_RATES_TO_USD).forEach((currencyId) => {
        const currencyWithoutRate = omit(newState[currencyId], 'rate');
        const oldCurrencyWithoutRate = omit(INITIAL_CURRENCIES_BY_ID[currencyId], 'rate');
        expect(currencyWithoutRate).toEqual(expect.objectContaining(oldCurrencyWithoutRate));
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

    it('should copy every currency\'s other properties', () => {
      const newState = currenciesByIdHandlers[UPDATE_RATES_LOADING_STATE](
        INITIAL_CURRENCIES_BY_ID,
        { loadingStates: NEW_RATES_LOADING_STATE }
      );

      Object.keys(NEW_RATES_LOADING_STATE).forEach((currencyId) => {
        const currencyWithoutLoading = omit(newState[currencyId], 'rateIsLoading');
        const oldCurrencyWithoutLoading = omit(INITIAL_CURRENCIES_BY_ID[currencyId], 'rateIsLoading');
        expect(currencyWithoutLoading).toEqual(
          expect.objectContaining(oldCurrencyWithoutLoading)
        );
      });
    });
  });
});
