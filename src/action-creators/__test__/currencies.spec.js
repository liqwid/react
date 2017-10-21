import { LOAD_INITIAL_CURRENCIES, UPDATE_EXCHANGE_AMOUNT,
         ADD_BALANCE, SUBSTRACT_BALANCE } from 'action-types';

import { loadInitialCurrencies, updateExchangeAmount, addBalance, substractBalance,
         INITIAL_CURRENCY_IDS, CURRENCIES_LOAD_TIMEOUT } from '../currencies';

const dispatchMock = jest.fn();
const EXCHANGE_AMOUNT = '100';
const AMOUNT = 100;
const CURRENCY_ID = 'USD';
jest.useFakeTimers();

describe('loadInitialCurrencies', () => {
  afterEach(() => {
    dispatchMock.mockClear();
  });

  it('should return a thunk', () => {
    expect(loadInitialCurrencies()).toBeInstanceOf(Function);
  });

  it(`should dispatch a ${LOAD_INITIAL_CURRENCIES} action after a second`, () => {
    loadInitialCurrencies()(dispatchMock);
    jest.runTimersToTime(CURRENCIES_LOAD_TIMEOUT);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type    : LOAD_INITIAL_CURRENCIES,
      payload : {
        currencyIds: INITIAL_CURRENCY_IDS
      }
    });
  });
});

describe('updateExchangeAmount', () => {
  it(`should return a ${UPDATE_EXCHANGE_AMOUNT} action and pass amount to it`, () => {
    expect(updateExchangeAmount(CURRENCY_ID, EXCHANGE_AMOUNT)).toEqual({
      type    : UPDATE_EXCHANGE_AMOUNT,
      payload : {
        currencyId     : CURRENCY_ID,
        exchangeAmount : EXCHANGE_AMOUNT
      }
    });
  });
});

describe('addBalance', () => {
  it(`should return a ${ADD_BALANCE} action and pass amount to it`, () => {
    expect(addBalance(CURRENCY_ID, AMOUNT)).toEqual({
      type    : ADD_BALANCE,
      payload : {
        currencyId : CURRENCY_ID,
        amount     : AMOUNT
      }
    });
  });
});

describe('substractBalance', () => {
  it(`should return a ${SUBSTRACT_BALANCE} action and pass amount to it`, () => {
    expect(substractBalance(CURRENCY_ID, AMOUNT)).toEqual({
      type    : SUBSTRACT_BALANCE,
      payload : {
        currencyId : CURRENCY_ID,
        amount     : AMOUNT
      }
    });
  });
});
